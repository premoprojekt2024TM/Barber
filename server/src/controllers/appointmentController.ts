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

  const { workerId, availabilityId } =
    request.body as CreateAppointmentRequestBody;

  // Validate worker exists and is a worker
  const storeworker = await AppDataSource.getRepository(model.User).findOne({
    where: {
      userId: workerId,
      role: "worker",
    },
  });

  if (!storeworker) {
    return reply
      .status(404)
      .send({ message: "Store worker (hairdresser) not found" });
  }

  // Prevent booking with self
  if (clientId === storeworker.userId) {
    return reply
      .status(400)
      .send({ message: "Client cannot be the same as the hairdresser" });
  }

  // Find available time slot by its ID
  const timeSlotEntity = await AppDataSource.getRepository(
    model.AvailabilityTimes,
  ).findOne({
    where: {
      timeSlotId: availabilityId,
      user: { userId: workerId },
      status: "available",
    },
    relations: ["user"], // Ensure user relation is loaded
  });

  if (!timeSlotEntity) {
    return reply.status(404).send({
      message: "Selected time slot is not available",
    });
  }

  // Create new appointment
  const newAppointment = new model.Appointment();
  newAppointment.client = { userId: clientId } as any;
  newAppointment.worker = storeworker;
  newAppointment.timeSlot = timeSlotEntity;
  newAppointment.status = "confirmed";
  newAppointment.notes = "";

  // Update time slot status
  timeSlotEntity.status = "accepted";

  try {
    // Save time slot status
    await AppDataSource.getRepository(model.AvailabilityTimes).save(
      timeSlotEntity,
    );

    // Save new appointment
    const savedAppointment = await AppDataSource.getRepository(
      model.Appointment,
    ).save(newAppointment);

    // Prepare response with simplified worker object
    const workerResponse = {
      userId: storeworker.userId,
      firstName: storeworker.firstName,
      lastName: storeworker.lastName,
    };

    return reply.status(201).send({
      message: "Appointment created successfully",
      appointment: {
        ...savedAppointment,
        worker: workerResponse,
      },
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return reply.status(500).send({
      message: "Error creating appointment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAppointment = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const clientId = request.user?.userId;
  if (!clientId) {
    return reply.status(401).send({ message: "User not authenticated" }); // Use 401 for Unauthorized
  }

  try {
    // Retrieve appointments for the authenticated client.
    // Include relations:
    // - worker: The worker performing the appointment.
    // - timeSlot: The timeslot of the appointment.
    // - worker.storeWorkers: The join entity instances linking the worker to stores.
    // - worker.storeWorkers.store: The actual Store entity where the worker works.
    const appointments = await AppDataSource.getRepository(
      model.Appointment,
    ).find({
      where: { client: { userId: clientId } },
      relations: [
        "worker",
        "timeSlot",
        "worker.storeWorkers", // Load the link table entries for the worker
        "worker.storeWorkers.store", // Load the actual Store via the link table
      ],
      // Optional: Add ordering if needed, e.g., by appointment date
      // order: { appointmentDate: "ASC" }
    });

    // The resulting 'appointments' array will now have each appointment object structured like:
    // appointment: {
    //   ...,
    //   worker: {
    //     ...,
    //     storeWorkers: [
    //       {
    //         ..., // StoreWorker properties
    //         store: { storeId: ..., name: ..., address: ..., ... } // The Store details
    //       },
    //       // Potentially more if the worker is linked to multiple stores via StoreWorker
    //     ]
    //   },
    //   timeSlot: { ... }
    // }

    return reply.status(200).send({
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    return reply.status(500).send({
      message: "Error retrieving appointments",
      error: error instanceof Error ? error.message : "Unknown error", // Include error details cautiously
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
