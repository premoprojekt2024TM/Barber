import { FastifyRequest, FastifyReply } from "fastify";
import * as model from "../models/index";
import { AppDataSource } from "../config/dbconfig";
import { AuthenticatedRequest, GetStoreId } from "../interfaces/interfaces";
import axios from "axios";
import * as dotenv from "dotenv";
import { uploadStoreImage } from "../config/awsconfig";

dotenv.config();
//Bolt létrehozása
export const createStore = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply
      .status(401)
      .send({ message: "A felhasználó nincs hitelesítve" });
  }

  try {
    const { name, address, phone, email, workerIds, image } =
      request.body as any;
    if (!name || !address || !phone || !email) {
      return reply.status(400).send({ message: "Hiányzó kötelező mezők" });
    }

    const creator = await AppDataSource.getRepository(model.User).findOne({
      where: { userId },
    });

    if (!creator) {
      return reply.status(404).send({ message: "A felhasználó nem található" });
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
      return reply
        .status(400)
        .send({ message: "A felhasználónak már van boltja" });
    }

    const extractStreetAddress = (fullAddress: string): string => {
      const parts = fullAddress.split(",");
      if (parts.length > 1) {
        return parts[1].trim();
      }
      const streetMatch = fullAddress.match(/([^\d,]+\s\d+)/);
      if (streetMatch) {
        return streetMatch[0].trim();
      }
      return fullAddress;
    };

    const streetOnlyAddress = extractStreetAddress(address);

    const geocodedData = await geocodeAddress(address);
    if (!geocodedData) {
      return reply.status(400).send({ message: "Nem létezik ilyen cím" });
    }

    const { lat, lng, city, postalCode } = geocodedData;

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
    store.address = streetOnlyAddress;
    store.city = city || "";
    store.postalCode = postalCode || "";
    store.phone = phone;
    store.email = email;
    store.latitude = lat;
    store.longitude = lng;
    store.picture = pictureUrl;

    await AppDataSource.getRepository(model.Store).save(store);

    const storeWorker = new model.StoreWorker();
    storeWorker.store = store;
    storeWorker.user = creator;
    storeWorker.role = "owner";
    await AppDataSource.getRepository(model.StoreWorker).save(storeWorker);

    if (workerIds && Array.isArray(workerIds) && workerIds.length > 0) {
      const storeWorkersRepo = AppDataSource.getRepository(model.StoreWorker);
      const storeWorkersCount = await storeWorkersRepo.count({
        where: { store: { storeId: store.storeId } },
      });
      const maxAdditionalWorkers = 4 - storeWorkersCount;

      const workersToProcess = workerIds.slice(0, maxAdditionalWorkers);

      if (workersToProcess.length < workerIds.length) {
        return reply.status(400).send({
          error: `Csak ${workersToProcess.length} munkavállaló került feldolgozásra a(z) ${workerIds.length} közül a bolt korlátja miatt.`,
        });
      }

      for (const workerId of workersToProcess) {
        const worker = await AppDataSource.getRepository(model.User).findOneBy({
          userId: typeof workerId === "string" ? parseInt(workerId) : workerId,
        });

        if (!worker) {
          return reply.status(404).send({
            error: `A(z) ${workerId} azonosítójú munkavállaló nem található.`,
          });
        }

        const existingWorkerStore = await storeWorkersRepo.findOne({
          where: {
            user: worker,
          },
          relations: ["store"],
        });

        if (existingWorkerStore) {
          return reply.status(400).send({
            error: `A(z) ${workerId} azonosítójú munkavállaló már hozzá van rendelve egy másik áruházhoz.`,
          });
        }

        const newStoreWorker = new model.StoreWorker();
        newStoreWorker.store = store;
        newStoreWorker.user = worker;
        newStoreWorker.role = "worker";

        await storeWorkersRepo.save(newStoreWorker);
      }
    }

    return reply
      .status(201)
      .send({ message: "A bolt sikeresen létrejött", store });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt a bolt létrehozása közben" });
  }
};

//Cím alapján geokodolás
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
//Bolt lekérdezés
export const getAllStores = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const stores = await AppDataSource.getRepository(model.Store).find();

    return reply.status(200).send({
      message: "A boltok sikeresen lekérdezve",
      stores: stores,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt a boltok lekérdezése közben" });
  }
};
//Bolt lekérdezés Id alapján
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
      return reply.status(404).send({ message: "A bolt nem található" });
    }
    const workersWithAvailability = store.storeWorkers.map((storeWorker) => {
      const user = storeWorker.user;
      const availabilityTimes = user.availabilityTimes;
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
      message: "A bolt és a munkavállalók sikeresen lekérdezve",
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
    return reply
      .status(500)
      .send({ message: "Hiba történt a bolt lekérdezése közben" });
  }
};

//Bolt dolgozoi adat
export const getStoreWorkerDetails = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply
      .status(401)
      .send({ message: "A felhasználó nincs hitelesítve" });
  }

  try {
    const user = await AppDataSource.getRepository(model.User).findOne({
      where: { userId },
    });

    if (!user) {
      return reply.status(404).send({ message: "A felhasználó nem található" });
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
        .send({ message: "A felhasználó nincs hozzárendelve egy boltba." });
    }

    const store = storeWorker.store;
    const role = storeWorker.role;

    return reply.status(200).send({
      message:
        "A bolt munkavállalói adatainak lekérdezése sikeresen megtörtént",
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
    return reply.status(500).send({
      message:
        "Hiba történt a bolt munkavállalói adatainak lekérdezése közben.",
    });
  }
};
//Bolt dolgozai és időpontjai
export const getStoreWorkersAndAppointments = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply
      .status(401)
      .send({ message: "A felhasználó nincs hitelesítve" });
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
        .send({ message: "A felhasználó nincs hozzárendelve egy bolthoz" });
    }

    if (!storeWorker.store || !storeWorker.store.storeId) {
      return reply.status(500).send({
        message:
          "Nem sikerült lekérdezni a bolt információit a munkavállaló számára.",
      });
    }

    const storeId = storeWorker.store.storeId;

    if (typeof storeId !== "number") {
      return reply
        .status(500)
        .send({ message: "Belső hiba: Érvénytelen boltazonosító található." });
    }

    const storeWorkers = await AppDataSource.getRepository(
      model.StoreWorker,
    ).find({
      where: { store: { storeId } },
      relations: [
        "user",
        "user.workerAppointments",
        "user.workerAppointments.client",
        "user.workerAppointments.timeSlot",
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
                day: null,
                timeSlot: null,
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
              day: appointment.timeSlot?.day || null,
              timeSlot: appointment.timeSlot?.timeSlot || null,
              status: appointment.status,
            };
          }),
        };
      })
      .filter((worker) => worker !== null);

    return reply.status(200).send({
      message: "A bolt munkavállalói és azok időpontjai sikeresen lekérdezve",
      storeId,
      workers: workersWithAppointments,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt az adatok lekérdezése közben" });
  }
};
//Bolt törlés
export const deleteStore = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply
      .status(401)
      .send({ message: "A felhasználó nincs hitelesítve" });
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
        .send({ message: "Csak a bolt tulajdonosai törölhetik a boltot" });
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
      message: "A bolt és minden kapcsolódó adat sikeresen törölve",
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Hiba történt a bolt törlése közben",
    });
  }
};
//Bolt elhagyása
export const exitStore = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply
      .status(401)
      .send({ message: "A felhasználó nincs hitelesítve." });
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
        message:
          "Csak a munkavállalók hagyhatják el a boltot. A bolt tulajdonosai nem hagyhatják el a boltot.",
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
        "Sikeresen elhagytad a boltot. Az időpontok és a foglalások törlésre kerültek.",
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Hiba történt a bolt elhagyása közben.",
    });
  }
};
//Bolt kapcsolata
export const isConnectedToStore = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(400).send({ message: "Hiányzó Felhasználó ID." });
  }

  try {
    const storeWorkerRepository = AppDataSource.getRepository(
      model.StoreWorker,
    );

    const storeConnection = await storeWorkerRepository.findOne({
      where: {
        user: { userId: userId },
      },
      relations: ["store"],
    });

    if (storeConnection) {
      return reply.send({
        isConnectedToStore: true,
        store: storeConnection.store,
        role: storeConnection.role,
      });
    }

    return reply.send({
      isConnectedToStore: false,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Hiba történt a bolt kapcsolatának ellenőrzése közben",
    });
  }
};
//Bolt tulajdonos
export const isStoreOwner = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  if (!userId) {
    return reply.status(400).send({ message: "A felhasználói ID hiányzik" });
  }
  try {
    const storeWorkerRepository = AppDataSource.getRepository(
      model.StoreWorker,
    );
    const storeWorker = await storeWorkerRepository.findOne({
      where: {
        user: { userId: userId },
        role: "owner",
      },
      relations: ["store"],
    });

    if (storeWorker) {
      const allStoreWorkers = await storeWorkerRepository.find({
        where: {
          store: { storeId: storeWorker.store.storeId },
          role: "worker",
        },
        relations: ["user", "store"],
      });

      const workers = allStoreWorkers.map((worker) => ({
        userId: worker.user.userId,
        username: worker.user.username,
        email: worker.user.email,
        role: worker.role,
        storeWorkerId: worker.storeWorkerId,
        profilepic: worker.user.profilePic,
      }));

      return reply.send({
        isStoreOwner: true,
        store: {
          storeId: storeWorker.store.storeId,
          name: storeWorker.store.name,
          description: storeWorker.store.description,
          address: storeWorker.store.address,
          city: storeWorker.store.city,
          postalCode: storeWorker.store.postalCode,
          phone: storeWorker.store.phone,
          email: storeWorker.store.email,
          latitude: storeWorker.store.latitude,
          longitude: storeWorker.store.longitude,
          picture: storeWorker.store.picture,
        },
        workers: workers,
      });
    }

    return reply.send({
      isStoreOwner: false,
    });
  } catch (error) {
    return reply.status(500).send({
      message:
        "Hiba történt annak ellenőrzése közben, hogy a felhasználó bolt tulajdonos-e",
    });
  }
};

export const updateStore = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply
      .status(401)
      .send({ message: "A felhasználó nincs hitelesítve" });
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

    if (!storeWorker || !storeWorker.store) {
      return reply
        .status(403)
        .send({ message: "Csak a bolt tulajdonosa frissítheti a boltot" });
    }

    const store = storeWorker.store;
    const storeId = store.storeId;
    const {
      name,
      address,
      phone,
      email,
      image,
      workerIds = [],
    } = request.body as any;

    if (!name || !address || !phone || !email) {
      return reply.status(400).send({ message: "Hiányzó kötelező mezők" });
    }

    const extractStreetAddress = (fullAddress: string): string => {
      const parts = fullAddress.split(",");
      if (parts.length > 1) {
        return parts[1].trim();
      }
      const streetMatch = fullAddress.match(/([^\d,]+\s\d+)/);
      if (streetMatch) {
        return streetMatch[0].trim();
      }
      return fullAddress;
    };

    const streetOnlyAddress = extractStreetAddress(address);

    let geocodedData = null;
    if (address !== store.address) {
      geocodedData = await geocodeAddress(address);
      if (!geocodedData) {
        return reply.status(400).send({ message: "Nem létezik ilyen cím" });
      }
    }

    let pictureUrl = store.picture;
    if (image && image !== store.picture) {
      const contentType =
        image.match(/^data:([A-Za-z-+\/]+);base64,/)?.[1] || "image/jpeg";
      pictureUrl = await uploadStoreImage(
        image,
        "store-image.jpg",
        contentType,
      );
    }

    store.name = name;

    if (geocodedData) {
      const { lat, lng, city, postalCode } = geocodedData;
      store.address = streetOnlyAddress;
      store.city = city || store.city;
      store.postalCode = postalCode || store.postalCode;
      store.latitude = lat;
      store.longitude = lng;
    } else {
      store.address = streetOnlyAddress;
    }

    store.phone = phone;
    store.email = email;
    store.picture = pictureUrl;

    await AppDataSource.getRepository(model.Store).save(store);
    if (workerIds && Array.isArray(workerIds) && workerIds.length > 0) {
      const storeWorkersRepo = AppDataSource.getRepository(model.StoreWorker);
      const userRepo = AppDataSource.getRepository(model.User);
      const existingWorkers = await storeWorkersRepo.find({
        where: { store: { storeId } },
        relations: ["user"],
      });

      const currentWorkers = existingWorkers.filter(
        (sw) => sw.role === "worker",
      );

      const workerIdsAsNumbers = workerIds.map((id) => parseInt(id));
      const workersToRemove = currentWorkers.filter(
        (worker) => !workerIdsAsNumbers.includes(worker.user.userId),
      );

      for (const workerToRemove of workersToRemove) {
        await AppDataSource.getRepository(model.Appointment).delete({
          worker: { userId: workerToRemove.user.userId },
        });

        await AppDataSource.getRepository(model.AvailabilityTimes).delete({
          user: { userId: workerToRemove.user.userId },
        });

        await storeWorkersRepo.delete({
          storeWorkerId: workerToRemove.storeWorkerId,
        });
      }

      for (const workerId of workerIdsAsNumbers) {
        const existingWorker = currentWorkers.find(
          (worker) => worker.user.userId === workerId,
        );

        if (!existingWorker) {
          const newWorker = await userRepo.findOneBy({
            userId: workerId,
          });

          if (!newWorker) {
            return reply
              .status(404)
              .send({ message: `A szakember (ID: ${workerId}) nem található` });
          }

          const newWorkerExistsInAnotherStore = await storeWorkersRepo.findOne({
            where: {
              user: { userId: workerId },
            },
            relations: ["store"],
          });

          if (newWorkerExistsInAnotherStore) {
            return reply.status(400).send({
              message: `A munkavállaló (ID: ${workerId}) már egy másik bolthoz van rendelve`,
            });
          }

          const newStoreWorker = new model.StoreWorker();
          newStoreWorker.store = store;
          newStoreWorker.user = newWorker;
          newStoreWorker.role = "worker";

          await storeWorkersRepo.save(newStoreWorker);
        }
      }
    } else {
      const storeWorkersRepo = AppDataSource.getRepository(model.StoreWorker);
      const existingWorkers = await storeWorkersRepo.find({
        where: { store: { storeId }, role: "worker" },
        relations: ["user"],
      });

      for (const worker of existingWorkers) {
        await AppDataSource.getRepository(model.Appointment).delete({
          worker: { userId: worker.user.userId },
        });

        await AppDataSource.getRepository(model.AvailabilityTimes).delete({
          user: { userId: worker.user.userId },
        });

        await storeWorkersRepo.delete({
          storeWorkerId: worker.storeWorkerId,
        });
      }
    }

    const updatedWorkers = await AppDataSource.getRepository(
      model.StoreWorker,
    ).find({
      where: { store: { storeId } },
      relations: ["user"],
    });

    return reply.status(200).send({
      message: "A bolt sikeresen frissítve",
      store,
      workers: updatedWorkers.map((sw) => ({
        userId: sw.user.userId,
        username: sw.user.username,
        email: sw.user.email,
        role: sw.role,
        storeWorkerId: sw.storeWorkerId,
      })),
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt a bolt frissítése közben" });
  }
};
