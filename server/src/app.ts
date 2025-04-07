import cors from "@fastify/cors";
import * as dotenv from "dotenv";
import Fastify from "fastify";
import "reflect-metadata";
import { userRoutes } from "./routes/userRoutes";
import { friendRoutes } from "./routes/friendRoutes";
import { storeRoutes } from "./routes/storeRoutes";
import { availRoutes } from "./routes/availRoutes";
import { appointmentRoutes } from "./routes/appointmentRoutes";

dotenv.config();
const fastify = Fastify();

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

const routes = [
  userRoutes,
  friendRoutes,
  storeRoutes,
  availRoutes,
  appointmentRoutes,
];

routes.forEach((route) => fastify.register(route, { prefix: "/api/v1" }));

fastify.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Szerver az alábbi porton fut: ${address}`);
});
