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

    // Validate required fields
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
      return reply.status(400).send({ message: "Failed to geocode address" });
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
    // Use API key from environment variables
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

      // Extract components
      for (let component of addressComponents) {
        if (component.types.includes("locality")) {
          city = component.long_name; // City
        }
        if (component.types.includes("postal_code")) {
          postalCode = component.long_name; // Postal Code
        }
        if (component.types.includes("route")) {
          streetAddress = component.long_name; // Street Address
        }
        if (component.types.includes("country")) {
          country = component.long_name; // Country
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
      console.error(`Geocoding failed for address: ${address}`);
      return null;
    }
  } catch (error) {
    console.error("Error during geocoding request:", error);
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
