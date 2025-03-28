import { FastifyInstance } from "fastify";
import {
  deleteUser,
  loginUser,
  registerUser,
  updateUser,
  isConnectedToStore,
  getCurrentUser,
  isStoreOwner,
} from "../controllers/authController";
import { authenticateJwt, authorizeRole } from "../middlewares/authMiddleware";

export const userRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/register", registerUser);
  fastify.post("/login", loginUser);
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
  fastify.delete("/delete", { preHandler: authenticateJwt }, deleteUser);
  //fastify.get("/profile", { preHandler: authenticateJwt }, profile);
  //fastify.get('/user/:username', getUserByUsername);
  fastify.put("/update", { preHandler: authenticateJwt }, updateUser);
  fastify.get("/me", { preHandler: authenticateJwt }, getCurrentUser);
  //test routes
  fastify.get(
    "/client",
    { preHandler: [authenticateJwt, authorizeRole(["client"])] },
    async (request, reply) => {
      return { message: "Welcome, Client!" };
    },
  );

  fastify.get(
    "/hair",
    { preHandler: [authenticateJwt, authorizeRole(["worker"])] },
    async (request, reply) => {
      return { message: "Welcome, Hair!" };
    },
  );
};
