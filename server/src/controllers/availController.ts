import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource } from "../config/dbconfig";
import * as model from "../models/index";
import {
  AuthenticatedRequest,
  AvailabilityRequest,
  GetIdParams,
} from "../interfaces/interfaces";

export const createAvailability = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  if (!userId) {
    return reply
      .status(400)
      .send({ message: "Felhasználó nincs autentikálva" });
  }

  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
    request.body as AvailabilityRequest;

  const timeSlots = [
    { day: "monday", slots: monday },
    { day: "tuesday", slots: tuesday },
    { day: "wednesday", slots: wednesday },
    { day: "thursday", slots: thursday },
    { day: "friday", slots: friday },
    { day: "saturday", slots: saturday },
    { day: "sunday", slots: sunday },
  ];

  // First, get all existing availability times for this user
  const existingAvailabilities = await AppDataSource.getRepository(
    model.AvailabilityTimes,
  ).find({
    where: {
      user: { userId: userId },
    },
  });

  // Function to build a combined array of all received time slots
  const allReceivedTimeSlots = timeSlots.reduce<
    { day: string; timeSlot: string }[]
  >((acc, { day, slots }) => {
    if (slots) {
      slots.forEach((timeSlot) => acc.push({ day, timeSlot }));
    }
    return acc;
  }, []);

  // Loop through all existing availabilities and delete if not in the new set
  for (const existingAvailability of existingAvailabilities) {
    const isStillAvailable = allReceivedTimeSlots.some(
      (slot) =>
        slot.day === existingAvailability.day &&
        slot.timeSlot === existingAvailability.timeSlot,
    );

    if (!isStillAvailable) {
      // If the existing availability is NOT in the received time slots, delete it
      await AppDataSource.getRepository(model.AvailabilityTimes).remove(
        existingAvailability,
      );
    }
  }

  // Loop through the timeSlots array, checking if a availability exists.
  for (const { day, slots } of timeSlots) {
    if (slots && slots.length > 0) {
      for (const timeSlot of slots) {
        let existingAvailability = await AppDataSource.getRepository(
          model.AvailabilityTimes,
        ).findOne({
          where: {
            user: { userId: userId },
            day: day,
            timeSlot: timeSlot,
          },
        });

        if (!existingAvailability) {
          // Does not exists create a new one.
          const newAvailabilityTime = new model.AvailabilityTimes();
          newAvailabilityTime.user = { userId } as any;
          newAvailabilityTime.day = day;
          newAvailabilityTime.timeSlot = timeSlot;
          newAvailabilityTime.status = "available";

          await AppDataSource.getRepository(model.AvailabilityTimes).save(
            newAvailabilityTime,
          );
        }
      }
    }
  }

  return reply.status(200).send({
    message: "Availability created or updated successfully",
  });
};

export const getAvailabilitybyId = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = request.params as GetIdParams;

  const userId = parseInt(id);
  if (isNaN(userId)) {
    return reply.status(400).send({ message: "Invalid user ID" });
  }

  try {
    const availability = await AppDataSource.getRepository(
      model.AvailabilityTimes,
    )
      .createQueryBuilder("availability")
      .leftJoinAndSelect("availability.user", "user")
      .where("user.userId = :id", { id: userId })
      .getMany();

    if (availability.length === 0) {
      return reply
        .status(200)
        .send({ message: "No available slots found for this user" });
    }

    const availabilityByDay = availability.reduce(
      (acc: { [key: string]: string[] }, curr) => {
        if (!acc[curr.day]) acc[curr.day] = [];
        acc[curr.day].push(curr.timeSlot);
        return acc;
      },
      {},
    );

    return reply.status(200).send({
      message: "Availability fetched successfully",
      availability: availabilityByDay,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return reply.status(500).send({
      message: "Error fetching availability",
    });
  }
};

export const getMyAvailability = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  try {
    const user = request.user;

    if (!user || !user.userId) {
      return reply.status(401).send({
        message: "Authentication required to access this resource",
      });
    }

    const availability = await AppDataSource.getRepository(
      model.AvailabilityTimes,
    )
      .createQueryBuilder("availability")
      .leftJoinAndSelect("availability.user", "user")
      .where("user.userId = :userId", { userId: user.userId })
      .getMany();

    if (availability.length === 0) {
      return reply.status(200).send({
        message: "No available slots found for your account",
        availability: {}, // Return an empty object for consistency.
      });
    }

    const availabilityByDay = availability.reduce(
      (
        acc: { [key: string]: { timeSlot: string; status: string }[] },
        curr,
      ) => {
        if (!acc[curr.day]) acc[curr.day] = [];
        acc[curr.day].push({
          timeSlot: curr.timeSlot,
          status: curr.status,
        });
        return acc;
      },
      {},
    );

    return reply.status(200).send({
      message: "Your availability fetched successfully",
      availability: availabilityByDay,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return reply.status(500).send({
      message: "Error fetching availability",
    });
  }
};

export const getAvailableWorkers = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    // Find users with worker role who have availability
    const availableWorkers = await AppDataSource.getRepository(model.User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.availabilityTimes", "availability")
      .where("user.role = :role", { role: "worker" })
      .getMany();

    // Transform the data to include worker details and their availability
    const workersWithAvailability = availableWorkers.map((worker) => ({
      userId: worker.userId,
      username: worker.username,
      firstName: worker.firstName,
      lastName: worker.lastName,
      profilePic: worker.profilePic,
      availability: worker.availabilityTimes.reduce(
        (
          acc: { [key: string]: { timeSlot: string; status: string }[] },
          curr,
        ) => {
          if (!acc[curr.day]) acc[curr.day] = [];
          acc[curr.day].push({
            timeSlot: curr.timeSlot,
            status: curr.status,
          });
          return acc;
        },
        {},
      ),
    }));

    if (workersWithAvailability.length === 0) {
      return reply.status(200).send({
        message: "No workers with time slots found",
        workers: [],
      });
    }

    return reply.status(200).send({
      message: "Workers fetched successfully",
      workers: workersWithAvailability,
    });
  } catch (error) {
    console.error("Error fetching workers:", error);
    return reply.status(500).send({
      message: "Error fetching workers",
    });
  }
};
