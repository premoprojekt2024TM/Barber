import { FastifyRequest, FastifyReply } from "fastify";
import * as model from "../models/index";
import { AppDataSource } from "../config/dbconfig";
import { AuthenticatedRequest, GetStoreId } from "../interfaces/interfaces";
import { storeSchema } from "../shared/validation/userValidation";
import axios from "axios";
import * as dotenv from "dotenv";
import { uploadStoreImage } from "../config/awsconfig";

dotenv.config();

export const createStore = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(401).send({ message: "User not authenticated" });
  }

  try {
    const { name, address, phone, email, workerId, image } =
      request.body as any;
    if (!name || !address || !phone || !email) {
      return reply.status(400).send({ message: "Missing required fields" });
    }

    const creator = await AppDataSource.getRepository(model.User).findOne({
      where: { userId },
    });

    if (!creator) {
      return reply.status(404).send({ message: "User not found" });
    }

    const existingOwnerStore = await AppDataSource.getRepository(
      model.StoreWorker,
    ).findOne({
      where: {
        user: creator,
        role: "owner",
      },
      relations: ["store"],
    });

    if (existingOwnerStore) {
      return reply.status(400).send({ message: "User already owns a store" });
    }

    const geocodedData = await geocodeAddress(address);
    if (!geocodedData) {
      return reply.status(400).send({ message: "Nem létezik ilyen cím" });
    }

    const { lat, lng, city, postalCode, streetAddress, country } = geocodedData;

    let pictureUrl = undefined;
    if (image) {
      const contentType =
        image.match(/^data:([A-Za-z-+\/]+);base64,/)?.[1] || "image/jpeg";
      pictureUrl = await uploadStoreImage(
        image,
        "store-image.jpg",
        contentType,
      );
    }

    const store = new model.Store();
    store.name = name;
    store.address = streetAddress || address;
    store.city = city || "";
    store.postalCode = postalCode || "";
    store.phone = phone;
    store.email = email;
    store.latitude = lat;
    store.longitude = lng;
    store.picture = pictureUrl;

    await AppDataSource.getRepository(model.Store).save(store);

    // Add the creator as the store owner
    const storeWorker = new model.StoreWorker();
    storeWorker.store = store;
    storeWorker.user = creator;
    storeWorker.role = "owner";
    await AppDataSource.getRepository(model.StoreWorker).save(storeWorker);

    // Logic to add the store worker if workerId is provided
    if (workerId) {
      const worker = await AppDataSource.getRepository(model.User).findOneBy({
        userId: parseInt(workerId),
      });
      if (!worker) {
        return reply.status(404).send({ message: "Worker not found" });
      }

      // Check if the worker is already assigned to another store
      const existingWorkerStore = await AppDataSource.getRepository(
        model.StoreWorker,
      ).findOne({
        where: {
          user: worker,
        },
        relations: ["store"],
      });

      if (existingWorkerStore) {
        return reply
          .status(400)
          .send({ message: "Worker is already assigned to another store" });
      }

      const storeWorkersRepo = AppDataSource.getRepository(model.StoreWorker);
      const storeWorkersCount = await storeWorkersRepo.count({
        where: { store: { storeId: store.storeId } },
      });

      if (storeWorkersCount >= 4) {
        return reply
          .status(400)
          .send({ message: "Store already has the maximum number of workers" });
      }

      const newStoreWorker = new model.StoreWorker();
      newStoreWorker.store = store;
      newStoreWorker.user = worker;
      newStoreWorker.role = "worker";

      await storeWorkersRepo.save(newStoreWorker);
    }

    return reply
      .status(201)
      .send({ message: "Store created successfully", store });
  } catch (error) {
    console.error("Error during store creation:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while creating the store" });
  }
};

const geocodeAddress = async (
  address: string,
): Promise<{
  lat: number;
  lng: number;
  city: string;
  postalCode: string;
  streetAddress: string;
  country: string;
} | null> => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await axios.get(geocodeUrl);
    if (response.data.status === "OK" && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      const addressComponents = response.data.results[0].address_components;

      let city = "";
      let postalCode = "";
      let streetAddress = "";
      let country = "";
      for (let component of addressComponents) {
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("postal_code")) {
          postalCode = component.long_name;
        }
        if (component.types.includes("route")) {
          streetAddress = component.long_name;
        }
        if (component.types.includes("country")) {
          country = component.long_name;
        }
      }

      return {
        lat: location.lat,
        lng: location.lng,
        city,
        postalCode,
        streetAddress,
        country,
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getAllStores = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const stores = await AppDataSource.getRepository(model.Store).find();

    return reply.status(200).send({
      message: "Stores retrieved successfully",
      stores: stores,
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while retrieving stores" });
  }
};

export const getStoreById = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { storeId } = request.params as GetStoreId;
  try {
    const store = await AppDataSource.getRepository(model.Store).findOne({
      where: { storeId },
      relations: [
        "storeWorkers",
        "storeWorkers.user",
        "storeWorkers.user.availabilityTimes",
      ],
    });
    if (!store) {
      return reply.status(404).send({ message: "Store not found" });
    }
    // Collect the workers along with their available time slots
    const workersWithAvailability = store.storeWorkers.map((storeWorker) => {
      const user = storeWorker.user;
      const availabilityTimes = user.availabilityTimes;
      // Filter for only available time slots
      const availableTimeSlots = availabilityTimes.filter(
        (availability) => availability.status === "available",
      );
      return {
        workerId: user.userId,
        workerName: user.username,
        workerImage: user.profilePic,
        WorkerLastName: user.lastName,
        WorkerFirstName: user.firstName,
        availability: availableTimeSlots.map((availability) => ({
          availabilityId: availability.timeSlotId,
          day: availability.day,
          timeSlot: availability.timeSlot,
          status: availability.status,
        })),
      };
    });
    return reply.status(200).send({
      message: "Store and workers retrieved successfully",
      store: {
        storeId: store.storeId,
        name: store.name,
        address: store.address,
        city: store.city,
        postalCode: store.postalCode,
        phone: store.phone,
        email: store.email,
        picture: store.picture,
        workers: workersWithAvailability,
      },
    });
  } catch (error) {
    console.error("Error fetching store by ID:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while retrieving the store" });
  }
};

export const getStoreWorkerDetails = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(401).send({ message: "User not authenticated" });
  }

  try {
    const user = await AppDataSource.getRepository(model.User).findOne({
      where: { userId },
    });

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    const storeWorker = await AppDataSource.getRepository(
      model.StoreWorker,
    ).findOne({
      where: {
        user: user,
      },
      relations: ["store"],
    });

    if (!storeWorker) {
      return reply
        .status(404)
        .send({ message: "User is not assigned to any store" });
    }

    const store = storeWorker.store;
    const role = storeWorker.role;

    return reply.status(200).send({
      message: "Store worker details retrieved successfully",
      store: {
        storeId: store.storeId,
        name: store.name,
        address: store.address,
        city: store.city,
        postalCode: store.postalCode,
        phone: store.phone,
        email: store.email,
        picture: store.picture,
      },
      role: role,
    });
  } catch (error) {
    console.error("Error getting store worker details:", error);
    return reply.status(500).send({
      message: "An error occurred while retrieving store worker details",
    });
  }
};

export const getStoreWorkersAndAppointments = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(401).send({ message: "User not authenticated" });
  }

  try {
    const storeWorker = await AppDataSource.getRepository(
      model.StoreWorker,
    ).findOne({
      where: { user: { userId } },
      relations: ["store"],
    });

    if (!storeWorker) {
      return reply
        .status(404)
        .send({ message: "User is not assigned to any store" });
    }

    if (!storeWorker.store || !storeWorker.store.storeId) {
      return reply.status(500).send({
        message: "Failed to retrieve store information for the worker.",
      });
    }

    const storeId = storeWorker.store.storeId;

    if (typeof storeId !== "number") {
      return reply
        .status(500)
        .send({ message: "Internal error: Invalid store identifier found." });
    }

    const storeWorkers = await AppDataSource.getRepository(
      model.StoreWorker,
    ).find({
      where: { store: { storeId } },
      relations: [
        "user",
        "user.workerAppointments",
        "user.workerAppointments.client",
        "user.workerAppointments.timeSlot", // Add this line
      ],
    });

    const workersWithAppointments = storeWorkers
      .map((worker) => {
        if (!worker.user) return null;
        if (!worker.user.workerAppointments) {
          worker.user.workerAppointments = [];
        }

        return {
          workerId: worker.user.userId,
          workerName: worker.user.username,
          workerFirstName: worker.user.firstName,
          workerLastName: worker.user.lastName,
          workerImage: worker.user.profilePic,
          appointments: worker.user.workerAppointments.map((appointment) => {
            if (!appointment.client) {
              return {
                appointmentId: appointment.appointmentId,
                client: null,
                day: null, // Add Day
                timeSlot: null, // Add Timeslot
                status: appointment.status,
              };
            }

            return {
              appointmentId: appointment.appointmentId,
              client: {
                profilePic: appointment.client.profilePic,
                username: appointment.client.username,
                lastName: appointment.client.lastName,
                firstName: appointment.client.firstName,
              },
              day: appointment.timeSlot?.day || null, // Add Day
              timeSlot: appointment.timeSlot?.timeSlot || null, // Add Timeslot
              status: appointment.status,
            };
          }),
        };
      })
      .filter((worker) => worker !== null);

    return reply.status(200).send({
      message: "Store workers and their appointments retrieved successfully",
      storeId,
      workers: workersWithAppointments,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "An error occurred while retrieving data" });
  }
};

export const deleteStore = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(401).send({ message: "User not authenticated" });
  }

  try {
    const storeWorker = await AppDataSource.getRepository(
      model.StoreWorker,
    ).findOne({
      where: {
        user: { userId },
        role: "owner",
      },
      relations: ["store"],
    });

    if (!storeWorker) {
      return reply
        .status(403)
        .send({ message: "Only store owners can delete the store" });
    }

    const store = storeWorker.store;
    const storeWorkers = await AppDataSource.getRepository(
      model.StoreWorker,
    ).find({
      where: { store: { storeId: store.storeId } },
      relations: ["user"],
    });

    for (const worker of storeWorkers) {
      await AppDataSource.getRepository(model.Appointment).delete({
        worker: { userId: worker.user.userId },
      });
    }

    for (const worker of storeWorkers) {
      await AppDataSource.getRepository(model.AvailabilityTimes).delete({
        user: { userId: worker.user.userId },
      });
    }

    await AppDataSource.getRepository(model.StoreWorker).delete({
      store: { storeId: store.storeId },
    });

    await AppDataSource.getRepository(model.Store).delete({
      storeId: store.storeId,
    });

    return reply.status(200).send({
      message: "Store and all related data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting store:", error);
    return reply.status(500).send({
      message: "An error occurred while deleting the store",
    });
  }
};

export const exitStore = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(401).send({ message: "User not authenticated" });
  }

  try {
    const storeWorker = await AppDataSource.getRepository(
      model.StoreWorker,
    ).findOne({
      where: {
        user: { userId },
        role: "worker",
      },
      relations: ["store", "user"],
    });

    if (!storeWorker) {
      return reply.status(403).send({
        message: "Only workers can exit the store. Store owners cannot exit.",
      });
    }

    await AppDataSource.getRepository(model.Appointment).delete({
      worker: { userId },
    });

    await AppDataSource.getRepository(model.AvailabilityTimes).delete({
      user: { userId },
    });

    await AppDataSource.getRepository(model.StoreWorker).delete({
      user: { userId },
      store: { storeId: storeWorker.store.storeId },
    });

    return reply.status(200).send({
      message:
        "Successfully exited the store. Appointments and availability cleared.",
    });
  } catch (error) {
    console.error("Error exiting store:", error);
    return reply.status(500).send({
      message: "An error occurred while exiting the store",
    });
  }
};
