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


jest.mock("../config/dbconfig", () => ({
    AppDataSource: {
      getRepository: jest.fn().mockImplementation(() => ({
        findOneBy: mockFindOneBy,
        save: mockSave,
        remove: mockRemove,
        find: mockFind,
        delete: mockDelete,
      })),
    },
  }));
  
  jest.mock("../middlewares/authMiddleware", () => ({
    generateToken: jest.fn().mockReturnValue("mockJWTToken"),
  }));
  import { generateToken } from "../middlewares/authMiddleware";
  
  jest.mock("bcryptjs", () => ({
    genSalt: jest.fn().mockResolvedValue("mockSalt"),
    hash: jest.fn().mockResolvedValue("mockHashedPassword"),
    compare: jest.fn(),
  }));
  
  jest.mock("../shared/validation/userValidation", () => ({
    registerSchema: { safeParse: jest.fn() },
    loginSchema: { safeParse: jest.fn() },
    updateSchema: { safeParse: jest.fn() },
  }));
  
  const mockRequest = (body: any): Partial<FastifyRequest> => ({
    body,
  });
  
  const mockReply = (): Partial<FastifyReply> => {
    const reply: any = {};
    reply.status = jest.fn().mockReturnThis();
    reply.send = jest.fn().mockReturnThis();
    return reply as FastifyReply;
  };


  describe("authController - registerUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockFindOneBy.mockReset();
      mockSave.mockReset();
      mockRemove.mockReset();
      mockFind.mockReset();
      mockDelete.mockReset();
      (registerSchema.safeParse as jest.Mock).mockReset();
    });
  
    const validUserData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "client",
      firstName: "Test",
      lastName: "User",
    };
  
    it("Sikeres regisztráció", async () => {
      const request = mockRequest(validUserData);
      const reply = mockReply();
  
      (registerSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: validUserData,
      });
      mockFindOneBy.mockResolvedValue(null);
      const savedUser = {
        ...validUserData,
        userId: 1,
        password: "mockHashedPassword",
        profilePic: `https://ui-avatars.com/api/?name=${validUserData.username[0]}&size=128`,
      };
      mockSave.mockResolvedValue(savedUser);
  
      await registerUser(request as FastifyRequest, reply as FastifyReply);
  
      expect(registerSchema.safeParse).toHaveBeenCalledWith(validUserData);
      expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.User);
      expect(mockFindOneBy).toHaveBeenCalledTimes(2);
      expect(mockFindOneBy).toHaveBeenNthCalledWith(1, {
        email: validUserData.email,
      });
      expect(mockFindOneBy).toHaveBeenNthCalledWith(2, {
        username: validUserData.username,
      });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(12);
      expect(bcrypt.hash).toHaveBeenCalledWith(
        validUserData.password,
        "mockSalt",
      );
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          username: validUserData.username,
          email: validUserData.email,
          password: "mockHashedPassword",
          role: validUserData.role,
          firstName: validUserData.firstName,
          lastName: validUserData.lastName,
          profilePic: `https://ui-avatars.com/api/?name=${validUserData.username[0]}&size=128`,
        }),
      );
      expect(reply.status).toHaveBeenCalledWith(201);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Felhasználó sikeresen létrehozva.",
      });
    });

    it("400 ha szerep érvénytelen", async () => {
      const invalidRoleData = { ...validUserData, role: "admin" };
      const request = mockRequest(invalidRoleData);
      const reply = mockReply();
  
      (registerSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: invalidRoleData,
      });
  
      await registerUser(request as FastifyRequest, reply as FastifyReply);
  
      expect(registerSchema.safeParse).toHaveBeenCalledWith(invalidRoleData);
      expect(reply.status).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        message:
          "Érvénytelen szerep. A szerepnek „client” vagy „worker” kell lennie.",
      });
      expect(mockFindOneBy).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
    });


    it("400 ha email már létezik", async () => {
      const request = mockRequest(validUserData);
      const reply = mockReply();
      const existingUserWithEmail = new model.User();
      existingUserWithEmail.email = validUserData.email;
      existingUserWithEmail.userId = 99;
  
      (registerSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: validUserData,
      });
      mockFindOneBy.mockResolvedValueOnce(existingUserWithEmail);
  
      await registerUser(request as FastifyRequest, reply as FastifyReply);
      expect(registerSchema.safeParse).toHaveBeenCalledWith(validUserData);
      expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.User);
      expect(mockFindOneBy).toHaveBeenCalledTimes(1);
      expect(mockFindOneBy).toHaveBeenCalledWith({ email: validUserData.email });
      expect(reply.status).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Ez az email cím már létezik",
      });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
    });

    it("400 ha Felhasználónév már létezik", async () => {
      const request = mockRequest(validUserData);
      const reply = mockReply();
      const existingUserWithUsername = new model.User();
      existingUserWithUsername.username = validUserData.username;
      existingUserWithUsername.userId = 100;
  
      (registerSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: validUserData,
      });
      mockFindOneBy.mockResolvedValueOnce(null);
      mockFindOneBy.mockResolvedValueOnce(existingUserWithUsername);
  
      await registerUser(request as FastifyRequest, reply as FastifyReply);
  
      expect(registerSchema.safeParse).toHaveBeenCalledWith(validUserData);
      expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.User);
      expect(mockFindOneBy).toHaveBeenCalledTimes(2);
      expect(mockFindOneBy).toHaveBeenNthCalledWith(1, {
        email: validUserData.email,
      });
      expect(mockFindOneBy).toHaveBeenNthCalledWith(2, {
        username: validUserData.username,
      });
      expect(reply.status).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Ez a felhasználónév már létezik",
      });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
    });


  });
