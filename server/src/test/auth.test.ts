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

  describe("authController- loginUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockFindOneBy.mockReset();
      (loginSchema.safeParse as jest.Mock).mockReset();
      (bcrypt.compare as jest.Mock).mockReset();
      (generateToken as jest.Mock).mockClear();
      (AppDataSource.getRepository as jest.Mock).mockClear();
    });
  
    const loginCredentials = {
      email: "test@example.com",
      password: "password123",
    };
  
    const mockExistingUser = {
      userId: 1,
      email: "test@example.com",
      password: "hashedPasswordFromDb",
      username: "testuser",
      role: "client",
    };
  
    it("Sikeres bejelentkezés", async () => {
      const request = mockRequest(loginCredentials);
      const reply = mockReply();
  
      (loginSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: loginCredentials,
      });
      mockFindOneBy.mockResolvedValue(mockExistingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  
      await loginUser(request as FastifyRequest, reply as FastifyReply);
      expect(loginSchema.safeParse).toHaveBeenCalledWith(loginCredentials);
      expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.User);
      expect(mockFindOneBy).toHaveBeenCalledWith({
        email: loginCredentials.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginCredentials.password,
        mockExistingUser.password,
      );
      expect(generateToken).toHaveBeenCalledWith(mockExistingUser);
      expect(reply.status).not.toHaveBeenCalled();
      expect(reply.send).toHaveBeenCalledWith({
        message: "Sikeres bejelentkezés",
        token: "mockJWTToken",
      });
    });
  
    it("400 ha a validáció sikertelen", async () => {
      const invalidCredentials = { email: "rosszemail", password: "pw" };
      const request = mockRequest(invalidCredentials);
      const reply = mockReply();
  
      (loginSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: "validációs hiba",
      });
  
      await loginUser(request as FastifyRequest, reply as FastifyReply);
  
      expect(loginSchema.safeParse).toHaveBeenCalledWith(invalidCredentials);
      expect(reply.status).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Sikertelen validáció",
      });
      expect(mockFindOneBy).not.toHaveBeenCalled();
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
    });
  
    it("401 ha a felhasználó nem található", async () => {
      const request = mockRequest(loginCredentials);
      const reply = mockReply();
  
      (loginSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: loginCredentials,
      });
      mockFindOneBy.mockResolvedValue(null);
  
      await loginUser(request as FastifyRequest, reply as FastifyReply);
      expect(loginSchema.safeParse).toHaveBeenCalledWith(loginCredentials);
      expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.User);
      expect(mockFindOneBy).toHaveBeenCalledWith({
        email: loginCredentials.email,
      });
      expect(reply.status).toHaveBeenCalledWith(401);
      expect(reply.send).not.toHaveBeenCalledWith(
        expect.objectContaining({ message: "Sikeres bejelentkezés" }),
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
    });
  
    it("400 ha a jelszó helytelen", async () => {
      const request = mockRequest(loginCredentials);
      const reply = mockReply();
      (loginSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: loginCredentials,
      });
      mockFindOneBy.mockResolvedValue(mockExistingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
  
      await loginUser(request as FastifyRequest, reply as FastifyReply);
  
      expect(loginSchema.safeParse).toHaveBeenCalledWith(loginCredentials);
      expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.User);
      expect(mockFindOneBy).toHaveBeenCalledWith({
        email: loginCredentials.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginCredentials.password,
        mockExistingUser.password,
      );
      expect(reply.status).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Érvénytelen hitelesítő adatok",
      });
      expect(generateToken).not.toHaveBeenCalled();
    });
  });
