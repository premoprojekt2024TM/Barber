import bcrypt from "bcryptjs";
import { FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../config/dbconfig";
import * as model from "../models/index";
import {
  registerSchema,
  loginSchema,
} from "../shared/validation/userValidation";
import { registerUser, loginUser } from "../controllers/authController";

const mockSave = jest.fn();
const mockFindOneBy = jest.fn();
const mockRemove = jest.fn();
const mockFind = jest.fn();
const mockDelete = jest.fn();