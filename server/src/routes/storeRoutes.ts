import { FastifyInstance, FastifyReply } from "fastify";
import {
  createStore,
  getAllStores,
  getStoreById,
} from "../controllers/storeController";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { authenticateJwt } from "../middlewares/authMiddleware";

export const storeRoutes = async (fastify: FastifyInstance) => {
  const rateLimiter = new RateLimiterMemory({
    points: 100,
    duration: 10 * 60,
  });
  fastify.get("/store/:storeId", getStoreById);
  fastify.get("/Store", getAllStores);
  fastify.post(
    "/createStore",
    { preHandler: authenticateJwt },
    async (request, reply) => {
      try {
        await rateLimiter.consume(request.ip);
        return createStore(request, reply);
      } catch (error) {
        reply
          .status(429)
          .send({ message: "Too many requests, please try again later." });
      }
    },
  );
};
