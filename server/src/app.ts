
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


fastify.register(require('@fastify/swagger'), {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Barber-finder swagger',
      description: 'Testing the Barber-finder Fastify APIs',
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'user', description: 'User related end-points' },
      { name: 'code', description: 'Code related end-points' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
});


fastify.register(import('@fastify/swagger-ui'), {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
}),









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
