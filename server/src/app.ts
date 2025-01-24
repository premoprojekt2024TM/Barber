
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import * as dotenv from 'dotenv';
import Fastify from 'fastify';
import 'reflect-metadata';
import { chatController } from './controllers/chatController';
import { userRoutes } from './routes/userRoutes';
import { chatRoutes } from './routes/chatRoutes';
import { friendRoutes } from './routes/friendRoutes';
import { storeRoutes } from './routes/storeRoutes';
import { detectFaces } from './microservice/detectFaces'; 
import fetch from 'node-fetch'; 




dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.register(websocket, {
  options: { maxPayload: 1048576 }  
});


fastify.register(cors, {
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  
});





fastify.register(chatController);
fastify.register(userRoutes, { prefix: '/api/v1' });
fastify.register(chatRoutes, { prefix: '/api/v1' });
fastify.register(storeRoutes, { prefix: '/api/v1' });
fastify.register(friendRoutes, { prefix: '/api/v1' });


fastify.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
