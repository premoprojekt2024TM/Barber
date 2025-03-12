import { FastifyInstance } from "fastify";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getPendingFriendRequests,
  deleteFriendship,
  getSentFriendRequests,
} from "../controllers/friendController";
import { authenticateJwt } from "../middlewares/authMiddleware";

export const friendRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    "/sendFriendRequest",
    { preHandler: authenticateJwt },
    sendFriendRequest,
  );
  fastify.post(
    "/acceptFriendRequest",
    { preHandler: authenticateJwt },
    acceptFriendRequest,
  );
  fastify.post(
    "/rejectFriendRequest",
    { preHandler: authenticateJwt },
    rejectFriendRequest,
  );
  fastify.get(
    "/getSentFriendRequests",
    { preHandler: authenticateJwt },
    getSentFriendRequests,
  );
  fastify.delete(
    "/deleteFriendship",
    { preHandler: authenticateJwt },
    deleteFriendship,
  );
  fastify.get("/getFriends", { preHandler: authenticateJwt }, getFriends);
  fastify.get(
    "/checkFriendshipStatus",
    { preHandler: authenticateJwt },
    getPendingFriendRequests,
  );
};
