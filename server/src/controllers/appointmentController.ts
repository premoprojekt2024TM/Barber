import { FastifyReply } from "fastify";
import { AppDataSource } from "../config/dbconfig";
import * as model from "../models/index";
import {
  AuthenticatedRequest,
  CreateAppointmentRequestBody,
} from "../interfaces/interfaces";

export const createAppointment = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const clientId = request.user?.userId;
  if (!clientId) {
    return reply.status(400).send({ message: "User not authenticated" });
  }

  const { storeworkerId, day, timeSlot, notes } =
    request.body as CreateAppointmentRequestBody;

  const storeworker = await AppDataSource.getRepository(model.User).findOne({
    where: { userId: storeworkerId, role: "worker" },
  });
  if (!storeworker) {
    return reply
      .status(404)
      .send({ message: "Store worker (hairdresser) not found" });
  }

  if (clientId === storeworker.userId) {
    return reply
      .status(400)
      .send({ message: "Client cannot be the same as the hairdresser" });
  }

  const timeSlotEntity = await AppDataSource.getRepository(
    model.AvailabilityTimes,
  ).findOne({
    where: {
      user: { userId: storeworkerId },
      day: day,
      timeSlot: timeSlot,
      status: "available",
    },
  });

  if (!timeSlotEntity) {
    return reply
      .status(404)
      .send({
        message: "Selected time slot is not available on the specified day",
      });
  }

  const newAppointment = new model.Appointment();
  newAppointment.client = { userId: clientId } as any;
  newAppointment.worker = storeworker;
  newAppointment.timeSlot = timeSlotEntity;
  newAppointment.status = "confirmed";
  newAppointment.notes = notes || "";
  timeSlotEntity.status = "accepted";

  try {
    await AppDataSource.getRepository(model.AvailabilityTimes).save(
      timeSlotEntity,
    );
    await AppDataSource.getRepository(model.Appointment).save(newAppointment);

    return reply.status(201).send({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return reply.status(500).send({
      message: "Error creating appointment",
    });
  }
};

export const getAppointment = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const clientId = request.user?.userId;
  if (!clientId) {
    return reply.status(400).send({ message: "User not authenticated" });
  }
};
