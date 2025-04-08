import { FastifyReply } from "fastify";
import { AppDataSource } from "../config/dbconfig";
import * as model from "../models/index";
import { AuthenticatedRequest } from "../interfaces/interfaces";
import {
  createAppointment,
  getAppointment,
  getWorkerStore,
  getAppointmentsByWorker,
} from "../controllers/appointmentController";

const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockFindOneBy = jest.fn();
const mockFind = jest.fn();
const mockCreateQueryBuilder = jest.fn();

jest.mock("../config/dbconfig", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation(() => ({
      findOne: mockFindOne,
      findOneBy: mockFindOneBy,
      find: mockFind,
      save: mockSave,
      createQueryBuilder: mockCreateQueryBuilder,
    })),
  },
}));

const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
};

describe("appointmentController - Időpont létrehozása", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFindOne.mockReset();
    mockFindOneBy.mockReset();
    mockSave.mockReset();
    mockFind.mockReset();
    mockCreateQueryBuilder.mockReset();
    mockCreateQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.leftJoinAndSelect.mockReturnThis();
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.getMany.mockReset();
  });

  const mockRequest = (
    body: any,
    user: any,
  ): Partial<AuthenticatedRequest> => ({
    body,
    user,
    params: {},
  });

  const mockReply = (): Partial<FastifyReply> => {
    const reply: any = {};
    reply.status = jest.fn().mockReturnThis();
    reply.send = jest.fn().mockReturnThis();
    return reply as FastifyReply;
  };

  it("400 ha a felhasználó nincs hitelesítve", async () => {
    const request = mockRequest({ workerId: 1, availabilityId: 2 }, undefined);
    const reply = mockReply();

    await createAppointment(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Felhasználó nincs hitelesitve",
    });
    expect(mockFindOne).not.toHaveBeenCalled();
  });

  it("404 ha a szakember nem található", async () => {
    const request = mockRequest(
      { workerId: 123, availabilityId: 2 },
      { userId: 1 },
    );
    const reply = mockReply();

    mockFindOne.mockResolvedValueOnce(null);

    await createAppointment(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.User);
    expect(mockFindOne).toHaveBeenCalledWith({
      where: {
        userId: 123,
        role: "worker",
      },
    });
    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Szakember nem található",
    });
  });

  it("400 ha a kliens és szakember ugyanaz", async () => {
    const workerId = 2;
    const request = mockRequest(
      { workerId, availabilityId: 3 },
      { userId: workerId },
    );
    const reply = mockReply();

    const mockStoreworker = {
      userId: workerId,
      role: "worker",
    };

    mockFindOne.mockResolvedValueOnce(mockStoreworker);

    await createAppointment(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.User);
    expect(mockFindOne).toHaveBeenCalledWith({
      where: {
        userId: workerId,
        role: "worker",
      },
    });
    expect(reply.status).toHaveBeenCalledWith(400);
  });

  it("404 ha az időpont nem található vagy nem elérhető", async () => {
    const request = mockRequest(
      { workerId: 2, availabilityId: 3 },
      { userId: 1 },
    );
    const reply = mockReply();

    const mockStoreworker = {
      userId: 2,
      role: "worker",
    };

    mockFindOne.mockResolvedValueOnce(mockStoreworker);
    mockFindOne.mockResolvedValueOnce(null);

    await createAppointment(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.User);
    expect(mockFindOne).toHaveBeenCalledWith({
      where: {
        userId: 2,
        role: "worker",
      },
    });
    expect(AppDataSource.getRepository).toHaveBeenCalledWith(
      model.AvailabilityTimes,
    );
    expect(mockFindOne).toHaveBeenCalledWith({
      where: {
        timeSlotId: 3,
        user: { userId: 2 },
        status: "available",
      },
      relations: ["user"],
    });
    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({
      message: "A kiválasztott időpont nem választható",
    });
  });

  it("Sikeres foglalás létrehozása", async () => {
    const clientId = 1;
    const workerId = 2;
    const availabilityId = 3;

    const request = mockRequest(
      { workerId, availabilityId },
      { userId: clientId },
    );
    const reply = mockReply();

    const mockStoreworker = {
      userId: workerId,
      firstName: "Test",
      lastName: "Worker",
      role: "worker",
    };

    const mockTimeSlot = {
      timeSlotId: availabilityId,
      user: mockStoreworker,
      status: "available",
      day: "2025-04-15",
      timeSlot: "10:00-11:00",
    };

    const mockSavedAppointment = {
      appointmentId: 1,
      client: { userId: clientId },
      worker: mockStoreworker,
      timeSlot: mockTimeSlot,
      status: "confirmed",
      notes: "",
    };

    mockFindOne.mockResolvedValueOnce(mockStoreworker);
    mockFindOne.mockResolvedValueOnce(mockTimeSlot);
    mockSave.mockResolvedValueOnce(mockTimeSlot);
    mockSave.mockResolvedValueOnce(mockSavedAppointment);

    await createAppointment(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.User);
    expect(mockFindOne).toHaveBeenCalledWith({
      where: {
        userId: workerId,
        role: "worker",
      },
    });

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(
      model.AvailabilityTimes,
    );
    expect(mockFindOne).toHaveBeenCalledWith({
      where: {
        timeSlotId: availabilityId,
        user: { userId: workerId },
        status: "available",
      },
      relations: ["user"],
    });

    expect(mockTimeSlot.status).toBe("accepted");
    expect(mockSave).toHaveBeenCalledWith(mockTimeSlot);

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.Appointment);
    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        client: { userId: clientId },
        worker: mockStoreworker,
        timeSlot: mockTimeSlot,
        status: "confirmed",
        notes: "",
      }),
    );

    expect(reply.status).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Időpont sikeresen lefoglalva",
      appointment: expect.objectContaining({
        worker: {
          userId: workerId,
          firstName: "Test",
          lastName: "Worker",
        },
      }),
    });
  });
});

describe("appointmentController - Időpont lekérdezése", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFind.mockReset();
  });

  const mockRequest = (user: any): Partial<AuthenticatedRequest> => ({
    user,
    params: {},
  });

  const mockReply = (): Partial<FastifyReply> => {
    const reply: any = {};
    reply.status = jest.fn().mockReturnThis();
    reply.send = jest.fn().mockReturnThis();
    return reply as FastifyReply;
  };

  it("Sikeres foglalások lekérdezése", async () => {
    const clientId = 1;
    const request = mockRequest({ userId: clientId });
    const reply = mockReply();

    const mockAppointments = [
      {
        appointmentId: 1,
        client: { userId: clientId },
        worker: {
          userId: 2,
          firstName: "Test",
          lastName: "Worker",
          storeWorkers: [{ store: { storeId: 5, name: "Test Store" } }],
        },
        timeSlot: { day: "2025-04-15", timeSlot: "10:00-11:00" },
        status: "confirmed",
        notes: "",
      },
    ];

    mockFind.mockResolvedValueOnce(mockAppointments);

    await getAppointment(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.Appointment);
    expect(mockFind).toHaveBeenCalledWith({
      where: { client: { userId: clientId } },
      relations: [
        "worker",
        "timeSlot",
        "worker.storeWorkers",
        "worker.storeWorkers.store",
      ],
    });

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Időpontok sikeresen lekérdezve",
      appointments: mockAppointments,
    });
  });
});

describe("appointmentController - szakemberhez tartozó bolt lekérdezése", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFindOne.mockReset();
  });

  const mockRequest = (params: any): Partial<AuthenticatedRequest> => ({
    params,
    //@ts-ignore
    user: { userId: 1 },
  });

  const mockReply = (): Partial<FastifyReply> => {
    const reply: any = {};
    reply.status = jest.fn().mockReturnThis();
    reply.send = jest.fn().mockReturnThis();
    return reply as FastifyReply;
  };

  it("404 ha nem található bolt a dolgozóhoz", async () => {
    const request = mockRequest({ workerId: "2" });
    const reply = mockReply();

    mockFindOne.mockResolvedValueOnce(null);

    await getWorkerStore(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.StoreWorker);
    expect(mockFindOne).toHaveBeenCalledWith({
      where: { user: { userId: 2 } },
      relations: ["store", "user"],
    });

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Nem található bolt a megadott dolgozóhoz.",
    });
  });

  it("Sikeres bolt és dolgozó lekérdezése", async () => {
    const workerId = "2";
    const request = mockRequest({ workerId });
    const reply = mockReply();

    const mockStore = { storeId: 5, name: "Test Store" };
    const mockUser = { userId: 2, firstName: "Test", lastName: "Worker" };
    const mockStoreWorker = {
      store: mockStore,
      user: mockUser,
    };

    mockFindOne.mockResolvedValueOnce(mockStoreWorker);

    await getWorkerStore(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.StoreWorker);
    expect(mockFindOne).toHaveBeenCalledWith({
      where: { user: { userId: parseInt(workerId) } },
      relations: ["store", "user"],
    });

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      store: mockStore,
      worker: mockUser,
    });
  });
});

describe("appointmentController - Szakemberhez tartozó Időpont lekérdezése", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateQueryBuilder.mockReset();
    mockQueryBuilder.getMany.mockReset();
  });

  const mockRequest = (user: any): Partial<AuthenticatedRequest> => ({
    user,
    params: {},
  });

  const mockReply = (): Partial<FastifyReply> => {
    const reply: any = {};
    reply.status = jest.fn().mockReturnThis();
    reply.send = jest.fn().mockReturnThis();
    return reply as FastifyReply;
  };

  it("401 ha a felhasználó nincs hitelesítve", async () => {
    const request = mockRequest(undefined);
    const reply = mockReply();

    await getAppointmentsByWorker(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Nincsen jogod megtekinteni",
    });
    expect(mockCreateQueryBuilder).not.toHaveBeenCalled();
  });

  it("200 ha nincsenek foglalások a szakemberhez", async () => {
    const workerId = 2;
    const request = mockRequest({ userId: workerId });
    const reply = mockReply();

    mockCreateQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.getMany.mockResolvedValueOnce([]);

    await getAppointmentsByWorker(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.Appointment);
    expect(mockCreateQueryBuilder).toHaveBeenCalledWith("appointment");
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      "appointment.client",
      "client",
    );
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      "appointment.worker",
      "worker",
    );
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      "appointment.timeSlot",
      "timeSlot",
    );
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      "worker.userId = :workerId",
      { workerId },
    );
    expect(mockQueryBuilder.getMany).toHaveBeenCalled();

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Nem található foglalás ehhez a szakemberhez.",
      appointments: [],
    });
  });

  it("Sikeres foglalások lekérdezése szakemberhez", async () => {
    const workerId = 2;
    const request = mockRequest({ userId: workerId });
    const reply = mockReply();

    const mockAppointments = [
      {
        appointmentId: 1,
        client: {
          userId: 3,
          username: "client1",
          firstName: "Client",
          lastName: "One",
          profilePic: "profile.jpg",
        },
        worker: { userId: workerId },
        timeSlot: { day: "2025-04-15", timeSlot: "10:00-11:00" },
        status: "confirmed",
        notes: "Test note",
      },
    ];

    mockCreateQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.getMany.mockResolvedValueOnce(mockAppointments);

    await getAppointmentsByWorker(
      request as AuthenticatedRequest,
      reply as FastifyReply,
    );

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(model.Appointment);
    expect(mockCreateQueryBuilder).toHaveBeenCalledWith("appointment");
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      "appointment.client",
      "client",
    );
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      "appointment.worker",
      "worker",
    );
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      "appointment.timeSlot",
      "timeSlot",
    );
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      "worker.userId = :workerId",
      { workerId },
    );
    expect(mockQueryBuilder.getMany).toHaveBeenCalled();

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Szakember foglalásai sikeresen lekérdezve.",
      appointments: [
        {
          appointmentId: 1,
          client: {
            userId: 3,
            username: "client1",
            firstName: "Client",
            lastName: "One",
            profilePic: "profile.jpg",
          },
          timeSlot: {
            day: "2025-04-15",
            timeSlot: "10:00-11:00",
          },
          status: "confirmed",
          notes: "Test note",
        },
      ],
    });
  });
});
