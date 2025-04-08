import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource } from "../config/dbconfig";
import * as model from "../models/index";
import {
  createAvailability,
  getAvailabilitybyId,
} from "../controllers/availController";
import {
  AuthenticatedRequest,
  AvailabilityRequest,
} from "../interfaces/interfaces";

const mockSave = jest.fn();
const mockFindOneBy = jest.fn();
const mockFindOne = jest.fn();
const mockFind = jest.fn();
const mockRemove = jest.fn();

const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
  getOne: jest.fn(),
};

jest.mock("../config/dbconfig", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      return {
        findOneBy: mockFindOneBy,
        findOne: mockFindOne,
        find: mockFind,
        save: mockSave,
        remove: mockRemove,
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      };
    }),
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

const mockRequestWithParams = (params: any): Partial<FastifyRequest> => ({
  params,
});

const mockReply = (): Partial<FastifyReply> => {
  const reply: any = {};
  reply.status = jest.fn().mockReturnThis();
  reply.send = jest.fn().mockReturnThis();
  return reply as FastifyReply;
};

describe("Rendelkezésre Állás Vezérlő - createAvailability", () => {
  const userId = 1;
  const validAvailabilityData: AvailabilityRequest = {
    monday: ["09:00", "10:00"],
    tuesday: [],
    wednesday: ["14:00"],
  };

  const mockExistingDbSlots: model.AvailabilityTimes[] = [
    {
      timeSlotId: 1, 
      user: { userId } as model.User,
      day: "monday",
      timeSlot: "09:00",
      status: "available",
      appointments: [], 
    },
    {
      timeSlotId: 2, 
      user: { userId } as model.User,
      day: "monday",
      timeSlot: "11:00",
      status: "available",
      appointments: [],
    },
    {
      timeSlotId: 3, 
      user: { userId } as model.User,
      day: "friday",
      timeSlot: "15:00",
      status: "available",
      appointments: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFind.mockReset();
    mockRemove.mockReset();
    mockFindOne.mockReset();
    mockSave.mockReset();
  });

  it("Sikeres időpont létrehozás/frissítés (új, meglévő, törölt)", async () => {
    const request = mockAuthenticatedRequest(userId, validAvailabilityData);
    const reply = mockReply();

    mockFind.mockResolvedValue(mockExistingDbSlots);
    mockFindOne
      .mockResolvedValueOnce(mockExistingDbSlots[0])
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    await createAvailability(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenCalledWith({
      where: { user: { userId: userId } },
    });

    expect(mockRemove).toHaveBeenCalledTimes(2);
    expect(mockRemove).toHaveBeenCalledWith(mockExistingDbSlots[1]);
    expect(mockRemove).toHaveBeenCalledWith(mockExistingDbSlots[2]);

    expect(mockFindOne).toHaveBeenCalledTimes(3);
    expect(mockFindOne).toHaveBeenNthCalledWith(1, {
      where: { user: { userId: userId }, day: "monday", timeSlot: "09:00" },
    });
    expect(mockFindOne).toHaveBeenNthCalledWith(2, {
      where: { user: { userId: userId }, day: "monday", timeSlot: "10:00" },
    });
    expect(mockFindOne).toHaveBeenNthCalledWith(3, {
      where: { user: { userId: userId }, day: "wednesday", timeSlot: "14:00" },
    });

    expect(mockSave).toHaveBeenCalledTimes(2);
    expect(mockSave).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        user: { userId: userId },
        day: "monday",
        timeSlot: "10:00",
        status: "available",
      }),
    );
    expect(mockSave).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        user: { userId: userId },
        day: "wednesday",
        timeSlot: "14:00",
        status: "available",
      }),
    );

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Időpont sikeresen létrehozva.",
    });
  });

  it("400 ha a felhasználó nincs autentikálva", async () => {
    const request = mockAuthenticatedRequest(undefined, validAvailabilityData);
    const reply = mockReply();

    await createAvailability(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Felhasználó nincs autentikálva",
    });
    expect(mockFind).not.toHaveBeenCalled();
    expect(mockRemove).not.toHaveBeenCalled();
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockSave).not.toHaveBeenCalled();
  });
});

describe("Rendelkezésre Állás Vezérlő - getAvailabilitybyId", () => {
  const targetUserId = 5;
  const mockAvailabilities: Partial<model.AvailabilityTimes>[] = [
    {
      timeSlotId: 10,
      user: { userId: targetUserId } as model.User,
      day: "monday",
      timeSlot: "10:00",
      status: "available",
    },
    {
      timeSlotId: 11,
      user: { userId: targetUserId } as model.User,
      day: "monday",
      timeSlot: "11:00",
      status: "available",
    }, 
    {
      timeSlotId: 12,
      user: { userId: targetUserId } as model.User,
      day: "wednesday",
      timeSlot: "15:00",
      status: "available",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryBuilder.leftJoinAndSelect.mockClear();
    mockQueryBuilder.where.mockClear();
    mockQueryBuilder.getMany.mockReset();
    (AppDataSource.getRepository as jest.Mock).mockClear();
  });

  it("200 üres eredménnyel, ha nincs időpont a felhasználóhoz", async () => {
    const request = mockRequestWithParams({ id: targetUserId.toString() });
    const reply = mockReply();

    mockQueryBuilder.getMany.mockResolvedValue([]);

    await getAvailabilitybyId(request as FastifyRequest, reply as FastifyReply);

    expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Nincs időpont ehhez a felhasználóhoz.",
    });
  });
});