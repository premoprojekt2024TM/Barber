import { FastifyInstance } from "fastify";
import { authenticateJwt } from "../middlewares/authMiddleware";
import {
  createAvailability,
  getAvailabilitybyId,
  getMyAvailability,
} from "../controllers/availController";

export const availRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    "/createAvailability",
    { preHandler: authenticateJwt },
    createAvailability,
  );
  fastify.get(
    "/getAvailability/:id",
    { preHandler: authenticateJwt },
    getAvailabilitybyId,
  );
  fastify.get(
    "/getMyAvailability",
    { preHandler: authenticateJwt },
    getMyAvailability,
  );
};
