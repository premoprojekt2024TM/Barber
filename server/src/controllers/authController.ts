import bcrypt from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource } from "../config/dbconfig";
import { generateToken } from "../middlewares/authMiddleware";
import * as model from "../models/index";
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
    return reply
      .status(400)
      .send({ message: "Validation failed", errors: result.error.errors });
  }

  const { username, email, password, role } = result.data;

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
    return reply.status(400).send({ message: "Email already exists" });
  }

  const existingUser = await AppDataSource.getRepository(model.User).findOneBy({
    username,
  });
  if (existingUser) {
    return reply.status(400).send({ message: "Username already exists" });
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
    await AppDataSource.getRepository(model.User).save(newUser);

    if (role === "worker") {
      const newExtendedWorker = new model.ExtendedWorker();
      newExtendedWorker.user = newUser;
      newExtendedWorker.description = "";
      await AppDataSource.getRepository(model.ExtendedWorker).save(
        newExtendedWorker,
      );
    }

    return reply.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    return reply.status(500).send({ message: "Error creating user" });
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
      return reply.status(400).send({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.status(400).send({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return reply.send({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred during login" });
  }
};

export const updateUser = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(400).send({ message: "User ID is missing" });
  }

  const result = updateSchema.safeParse(request.body);
  if (!result.success) {
    return reply
      .status(400)
      .send({ message: "Validation failed", errors: result.error.errors });
  }

  const { username, email, password } = result.data;

  try {
    const userRepository = AppDataSource.getRepository(model.User);
    const user = await userRepository.findOneBy({ userId: userId });

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    }

    await userRepository.save(user);
    return reply.send({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error during user update:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while updating user" });
  }
};

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

    await userRepository.remove(user);
    return reply.send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error during user deletion:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while deleting user" });
  }
};
