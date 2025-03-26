import { FastifyInstance } from "fastify";
import { authenticateJwt } from "../middlewares/authMiddleware";
import {
  createAppointment,
  getAppointment,
  getWorkerStore,
} from "../controllers/appointmentController";

export const appointmentRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    "/createAppointment",
    { preHandler: authenticateJwt },
    createAppointment,
  );
  fastify.get(
    "/getAppointment",
    { preHandler: authenticateJwt },
    getAppointment,
  );
  fastify.get("/worker/:workerId/store", getWorkerStore);
};
