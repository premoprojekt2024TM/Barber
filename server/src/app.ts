import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import * as dotenv from "dotenv";
import Fastify from "fastify";
import "reflect-metadata";
import { chatController } from "./controllers/chatController";
import { userRoutes } from "./routes/userRoutes";
import { chatRoutes } from "./routes/chatRoutes";
import { friendRoutes } from "./routes/friendRoutes";
import { storeRoutes } from "./routes/storeRoutes";
import { availRoutes } from "./routes/availRoutes";
import { appointmentRoutes } from "./routes/appointmentRoutes";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.register(websocket, {
  options: { maxPayload: 1048576 },
});

fastify.register(cors, {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Ensure credentials (cookies, auth headers) are sent with requests
});

const routes = [
  userRoutes,
  chatRoutes,
  friendRoutes,
  storeRoutes,
  availRoutes,
  appointmentRoutes,
];

routes.forEach((route) => fastify.register(route, { prefix: "/api/v1" }));

fastify.register(chatController);

fastify.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Szerver az alábbi porton fut: ${address}`);
});
