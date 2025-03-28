import bcrypt from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource } from "../config/dbconfig";
import { generateToken } from "../middlewares/authMiddleware";
import * as model from "../models/index";
import { uploadProfilePicture } from "../config/awsconfig";
import {
  loginSchema,
  registerSchema,
  updateSchema,
} from "../shared/validation/userValidation";
import { AuthenticatedRequest } from "../interfaces/interfaces";

export const registerUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const result = registerSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400);
  }

  const { username, email, password, role, firstName, lastName } = result.data;

  if (role !== "client" && role !== "worker") {
    return reply
      .status(400)
      .send({ message: 'Invalid role. Must be either "client" or "worker".' });
  }

  const existingEmail = await AppDataSource.getRepository(model.User).findOneBy(
    {
      email,
    },
  );
  if (existingEmail) {
    return reply.status(400).send({ message: "Ez az email cím már létezik" });
  }

  const existingUser = await AppDataSource.getRepository(model.User).findOneBy({
    username,
  });
  if (existingUser) {
    return reply
      .status(400)
      .send({ message: "Ez a felhasználónév már létezik" });
  }

  const generateProfilepic = `https://ui-avatars.com/api/?name=${username[0]}&size=128`;

  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new model.User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.role = role;
    newUser.profilePic = generateProfilepic;
    newUser.lastName = lastName;
    newUser.firstName = firstName;
    await AppDataSource.getRepository(model.User).save(newUser);
    return reply
      .status(201)
      .send({ message: "Felhasználó sikeresen létrehozva." });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt Felhasználó létrehozása közben" });
  }
};

export const loginUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const result = loginSchema.safeParse(request.body);
  if (!result.success) {
    return reply
      .status(400)
      .send({ message: "Validation failed", errors: result.error.errors });
  }

  const { email, password } = result.data;

  try {
    const user = await AppDataSource.getRepository(model.User).findOneBy({
      email,
    });

    if (!user) {
      return reply.status(401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply
        .status(400)
        .send({ message: "Érvénytelen hitelesítő adatok" });
    }

    const token = generateToken(user);

    return reply.send({ message: "Sikeres bejelentkezés", token });
  } catch (error) {
    return reply.status(500).send({ message: "Hiba történt bejelentkezéskor" });
  }
};

export const updateUser = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(400).send({ message: "User ID is missing." });
  }

  const result = updateSchema.safeParse(request.body);
  if (!result.success) {
    return reply
      .status(400)
      .send({ message: "Validation failed", errors: result.error.errors });
  }

  const { username, email, password, firstName, lastName, profilePic } =
    result.data;

  try {
    const userRepository = AppDataSource.getRepository(model.User);
    const user = await userRepository.findOneBy({ userId });

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    // Check if the username is already taken (only if it's being updated)
    if (username && username !== user.username) {
      const checkUsername = await userRepository.findOneBy({ username });
      if (checkUsername) {
        return reply.status(400).send({ message: "Username already exists!" });
      }
    }

    // Handle profile picture upload
    let profilePictureUrl: string | undefined;
    if (profilePic) {
      // Check if profilePic data exists
      try {
        profilePictureUrl = await uploadProfilePicture(
          profilePic, // Assuming profilePic is the base64 encoded image
          `${userId}-${Date.now()}.png`, // Generate a unique filename
          "image/png", // Adjust contentType as needed based on your image format
        );
      } catch (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        return reply
          .status(500)
          .send({ message: "Failed to upload profile picture" });
      }
    }

    // Update user properties conditionally
    if (username) user.username = username;
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profilePictureUrl) user.profilePic = profilePictureUrl; // Save the URL from S3

    if (password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    }

    await userRepository.save(user);

    // Remove password from response
    const { password: removedPassword, ...userWithoutPassword } = user;

    return reply.send({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error during user update:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while updating user" });
  }
};

import { getConnection } from "typeorm"; // Import getConnection

export const deleteUser = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(400).send({ message: "User ID is missing" });
  }

  try {
    const userRepository = AppDataSource.getRepository(model.User);
    const user = await userRepository.findOneBy({ userId: userId });

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    // Check if the user is a store owner
    const storeWorker = await AppDataSource.getRepository(
      model.StoreWorker,
    ).findOne({
      where: { user: { userId }, role: "owner" },
      relations: ["store"],
    });

    if (storeWorker) {
      const store = storeWorker.store;

      // Delete all store workers
      await AppDataSource.getRepository(model.StoreWorker).delete({
        store: { storeId: store.storeId },
      });

      // Delete all store-related appointments
      await AppDataSource.getRepository(model.Appointment).delete({
        worker: { userId: storeWorker.user.userId },
      });

      // Delete all store-related availability times
      await AppDataSource.getRepository(model.AvailabilityTimes).delete({
        user: { userId: storeWorker.user.userId },
      });

      // Delete the store itself
      await AppDataSource.getRepository(model.Store).delete({
        storeId: store.storeId,
      });
    }

    // Delete all user-related appointments
    const appointments = await AppDataSource.getRepository(
      model.Appointment,
    ).find({
      where: [{ client: { userId: userId } }, { worker: { userId: userId } }],
      relations: ["timeSlot"],
    });

    for (const appointment of appointments) {
      if (appointment.timeSlot) {
        appointment.timeSlot.status = "available";
        await AppDataSource.getRepository(model.AvailabilityTimes).save(
          appointment.timeSlot,
        );
      }
    }

    // Delete user's availability times
    await AppDataSource.getRepository(model.AvailabilityTimes).delete({
      user: { userId: userId },
    });

    // Delete friendships manually
    const friendships = await AppDataSource.getRepository(
      model.Friendship,
    ).find({
      where: [{ user: { userId: userId } }, { friend: { userId: userId } }],
    });
    for (const friendship of friendships) {
      await AppDataSource.getRepository(model.Friendship).remove(friendship);
    }

    // Delete user account
    await userRepository.remove(user);

    return reply.send({
      message: "User and related data deleted successfully",
    });
  } catch (error) {
    console.error("Error during user deletion:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while deleting user" });
  }
};

export const isConnectedToStore = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(400).send({ message: "User ID is missing" });
  }

  try {
    const storeWorkerRepository = AppDataSource.getRepository(
      model.StoreWorker,
    );

    // Check if the user is connected to any store (either as owner or worker)
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
    console.error("Error checking store connection:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while checking store connection" });
  }
};

export const getCurrentUser = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(400).send({ message: "User ID is missing" });
  }

  try {
    const userRepository = AppDataSource.getRepository(model.User);

    // Find the user by ID, excluding sensitive information like password
    const user = await userRepository.findOne({
      where: { userId },
      select: [
        "userId",
        "username",
        "email",
        "firstName",
        "lastName",
        "profilePic",
      ],
    });

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    // Return the user data
    return reply.send(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while retrieving user data" });
  }
};

export const isStoreOwner = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(400).send({ message: "User ID is missing" });
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
      return reply.send({
        isStoreOwner: true,
        storeId: storeWorker.store.storeId,
        storeName: storeWorker.store.name,
      });
    }

    return reply.send({
      isStoreOwner: false,
    });
  } catch (error) {
    console.error("Error checking if user is store owner:", error);
    return reply.status(500).send({
      message: "An error occurred while checking if user is a store owner",
    });
  }
};
