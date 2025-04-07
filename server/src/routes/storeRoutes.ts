import { FastifyInstance, FastifyReply } from "fastify";
import {
  createStore,
  getAllStores,
  getStoreById,
  getStoreWorkerDetails,
  getStoreWorkersAndAppointments,
  deleteStore,
  exitStore,
  isConnectedToStore,
  isStoreOwner,
  updateStore,
} from "../controllers/storeController";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { authenticateJwt, authorizeRole } from "../middlewares/authMiddleware";

export const storeRoutes = async (fastify: FastifyInstance) => {
  const rateLimiter = new RateLimiterMemory({
    points: 100,
    duration: 10 * 60,
  });
  fastify.get("/store/:storeId", getStoreById);
  fastify.get("/Store", getAllStores);
  fastify.get(
    "/mystore",
    { preHandler: authenticateJwt },
    getStoreWorkerDetails,
  );
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
          .send({ message: "Túl sok lekérdezés próbáld meg később." });
      }
    },
  );
  fastify.get(
    "/stores",
    { preHandler: authenticateJwt },
    getStoreWorkersAndAppointments,
  );
  fastify.put("/updatestore", { preHandler: authenticateJwt }, updateStore);
  fastify.delete("/deletestore", { preHandler: authenticateJwt }, deleteStore);
  fastify.delete("/exitstore", { preHandler: authenticateJwt }, exitStore);
  fastify.get(
    "/isStoreOwner",
    { preHandler: [authenticateJwt, authorizeRole(["worker"])] },
    isStoreOwner,
  );
  fastify.get(
    "/is-connected-to-store",
    { preHandler: authenticateJwt },
    isConnectedToStore,
  );
};
