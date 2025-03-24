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

        if (existingAvailability) {
          existingAvailability.status = "available";
          await AppDataSource.getRepository(model.AvailabilityTimes).save(
            existingAvailability,
          );
        } else {
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
      .andWhere("availability.status = :status", { status: "available" })
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
