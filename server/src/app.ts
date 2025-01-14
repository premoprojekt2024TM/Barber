import Fastify from 'fastify';
import { userRoutes } from './routes/userRoutes'; 
import 'reflect-metadata';
import cors from '@fastify/cors';
import * as dotenv from 'dotenv';
dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  
});


fastify.register(userRoutes, { prefix: '/api' });

fastify.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
