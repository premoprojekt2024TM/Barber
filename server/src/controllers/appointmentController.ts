import { FastifyReply } from "fastify";
import { AppDataSource } from "../config/dbconfig";
import * as model from "../models/index";
import {
  AuthenticatedRequest,
  CreateAppointmentRequestBody,
} from "../interfaces/interfaces";

//foglalás
export const createAppointment = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const clientId = request.user?.userId;
  if (!clientId) {
    return reply.status(400).send({ message: "Felhasználó nincs hitelesitve" });
  }

  const { workerId, availabilityId } =
    request.body as CreateAppointmentRequestBody;

  const storeworker = await AppDataSource.getRepository(model.User).findOne({
    where: {
      userId: workerId,
      role: "worker",
    },
  });

  if (!storeworker) {
    return reply
      .status(404)
      .send({ message: "Szakember nem található" });
  }

  if (clientId === storeworker.userId) {
    return reply
      .status(400)
  }

  const timeSlotEntity = await AppDataSource.getRepository(
    model.AvailabilityTimes,
  ).findOne({
    where: {
      timeSlotId: availabilityId,
      user: { userId: workerId },
      status: "available",
    },
    relations: ["user"], 
  });

  if (!timeSlotEntity) {
    return reply.status(404).send({
      message: "A kiválasztott időpont nem választható",
    });
  }

  const newAppointment = new model.Appointment();
  newAppointment.client = { userId: clientId } as any;
  newAppointment.worker = storeworker;
  newAppointment.timeSlot = timeSlotEntity;
  newAppointment.status = "confirmed";
  newAppointment.notes = "";
  timeSlotEntity.status = "accepted";

  try {
    await AppDataSource.getRepository(model.AvailabilityTimes).save(
      timeSlotEntity,
    );

    const savedAppointment = await AppDataSource.getRepository(
      model.Appointment,
    ).save(newAppointment);

    const workerResponse = {
      userId: storeworker.userId,
      firstName: storeworker.firstName,
      lastName: storeworker.lastName,
    };

    return reply.status(201).send({
      message: "Időpont sikeresen lefoglalva",
      appointment: {
        ...savedAppointment,
        worker: workerResponse,
      },
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Hiba történt időpont lefoglalása közben.",
    });
  }
};

//foglalások lekérdezése
export const getAppointment = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const clientId = request.user?.userId;
  if (!clientId) {
    return reply.status(401).send({ message: "Felhasználó nincs hitelesitve" }); 
  }

  try {
    const appointments = await AppDataSource.getRepository(
      model.Appointment,
    ).find({
      where: { client: { userId: clientId } },
      relations: [
        "worker",
        "timeSlot",
        "worker.storeWorkers", 
        "worker.storeWorkers.store", 
      ],
    });

    return reply.status(200).send({
      message: "Időpontok sikeresen lekérdezve",
      appointments,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Hiba törént időpontok lekérdezése során",
    });
  }
};

export const getWorkerStore = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const { workerId } = request.params as { workerId: string };

  try {
    const storeWorker = await AppDataSource.getRepository(
      model.StoreWorker,
    ).findOne({
      where: { user: { userId: parseInt(workerId) } },
      relations: ["store", "user"],
    });

    // Check if store worker exists
    if (!storeWorker) {
      return reply.status(404).send({
        message: "No store found for the specified worker",
      });
    }

    return reply.status(200).send({
      store: storeWorker.store,
      worker: storeWorker.user,
    });
  } catch (error) {
    console.error("Error fetching worker's store:", error);
    return reply.status(500).send({
      message: "Error retrieving worker's store information",
    });
  }
};

export const getAppointmentsByWorker = async (
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

    // Fetch appointments for the current worker
    const appointments = await AppDataSource.getRepository(model.Appointment)
      .createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.client", "client")
      .leftJoinAndSelect("appointment.worker", "worker")
      .leftJoinAndSelect("appointment.timeSlot", "timeSlot")
      .where("worker.userId = :workerId", { workerId: user.userId })
      .getMany();

    if (appointments.length === 0) {
      return reply.status(200).send({
        message: "No appointments found for this worker",
        appointments: [],
      });
    }

    // Transform appointments to include more details
    const transformedAppointments = appointments.map((appointment) => ({
      appointmentId: appointment.appointmentId,
      client: {
        userId: appointment.client.userId,
        username: appointment.client.username,
        firstName: appointment.client.firstName,
        lastName: appointment.client.lastName,
        profilePic: appointment.client.profilePic,
      },
      timeSlot: {
        day: appointment.timeSlot.day,
        timeSlot: appointment.timeSlot.timeSlot,
      },
      status: appointment.status,
      notes: appointment.notes || null,
    }));

    return reply.status(200).send({
      message: "Worker appointments fetched successfully",
      appointments: transformedAppointments,
    });
  } catch (error) {
    console.error("Error fetching worker appointments:", error);
    return reply.status(500).send({
      message: "Error fetching worker appointments",
    });
  }
};
