import { FastifyReply } from "fastify";
import * as model from "../models/index";
import { sendFriendRequest } from "../controllers/friendController";
import { AuthenticatedRequest } from "../interfaces/interfaces";

const mockSave = jest.fn();
const mockFindOneBy = jest.fn();
const mockFindOne = jest.fn();
const mockFind = jest.fn();
const mockRemove = jest.fn();

jest.mock("../config/dbconfig", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation(() => ({
      findOneBy: mockFindOneBy,
      findOne: mockFindOne,
      find: mockFind,
      save: mockSave,
      remove: mockRemove,
    })),
  },
}));

const mockAuthenticatedRequest = (
  userId: number | undefined,
  body: any,
): Partial<AuthenticatedRequest> => ({
  //@ts-ignore
  user: userId ? { userId } : undefined,
  body,
});

const mockReply = (): Partial<FastifyReply> => {
  const reply: any = {};
  reply.status = jest.fn().mockReturnThis();
  reply.send = jest.fn().mockReturnThis();
  return reply as FastifyReply;
};

describe("friendController - sendFriendRequest", () => {
  const requestingUserId = 1;
  const targetFriendId = 2;
  const targetClientId = 3;

  const mockUser = new model.User();
  mockUser.userId = requestingUserId;
  mockUser.role = "client";

  const mockFriendWorker = new model.User();
  mockFriendWorker.userId = targetFriendId;
  mockFriendWorker.role = "worker";

  const mockFriendClient = new model.User();
  mockFriendClient.userId = targetClientId;
  mockFriendClient.role = "client";

  beforeEach(() => {
    jest.clearAllMocks();
    mockFindOneBy.mockReset();
    mockFindOne.mockReset();
    mockSave.mockReset();
  });

  it("Sikeres barátkérelem küldése", async () => {
    const request = mockAuthenticatedRequest(requestingUserId, {
      friendId: targetFriendId,
    });
    const reply = mockReply();

    mockFindOneBy
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(mockFriendWorker);
    mockFindOne.mockResolvedValue(null);
    mockSave.mockResolvedValue(new model.Friendship());

    await sendFriendRequest(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(mockFindOneBy).toHaveBeenCalledTimes(2);
    expect(mockFindOneBy).toHaveBeenNthCalledWith(1, {
      userId: requestingUserId,
    });
    expect(mockFindOneBy).toHaveBeenNthCalledWith(2, {
      userId: targetFriendId,
    });
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        user: mockUser,
        friend: mockFriendWorker,
        status: "pending",
      }),
    );
    expect(reply.status).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Barátkérelem sikeresen elküldve",
    });
  });

  it("400 ha magunknak küldünk kérelmet", async () => {
    const request = mockAuthenticatedRequest(requestingUserId, {
      friendId: requestingUserId,
    });
    const reply = mockReply();

    await sendFriendRequest(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Magadnak nem tudsz barátkérelmet küldeni",
    });

    expect(mockFindOneBy).not.toHaveBeenCalled();
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("404 ha a felhasználó vagy a barát nem található", async () => {
    const request = mockAuthenticatedRequest(requestingUserId, {
      friendId: 999,
    });
    const reply = mockReply();

    mockFindOneBy.mockResolvedValueOnce(mockUser).mockResolvedValueOnce(null);

    await sendFriendRequest(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(mockFindOneBy).toHaveBeenCalledTimes(2);
    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: "Nem található" });
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("400 ha kliensnek próbálunk kérelmet küldeni", async () => {
    const request = mockAuthenticatedRequest(requestingUserId, {
      friendId: targetClientId,
    });
    const reply = mockReply();

    mockFindOneBy
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(mockFriendClient);

    await sendFriendRequest(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(mockFindOneBy).toHaveBeenCalledTimes(2);
    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Nem küldhetsz egy kliensnek barátkérelmet",
    });
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("400 ha már létezik függőben lévő kérelem", async () => {
    const request = mockAuthenticatedRequest(requestingUserId, {
      friendId: targetFriendId,
    });
    const reply = mockReply();
    const existingRequest = new model.Friendship();
    existingRequest.status = "pending";

    mockFindOneBy
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(mockFriendWorker);
    mockFindOne.mockResolvedValue(existingRequest);

    await sendFriendRequest(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(mockFindOneBy).toHaveBeenCalledTimes(2);
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Barátkérelem létezik vagy függőben van",
    });
    expect(mockSave).not.toHaveBeenCalled();
  });
});