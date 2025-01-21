import { FastifyInstance } from 'fastify';
import { createChatroom, getChatHistory, getChatroomsForUser } from '../controllers/chatController';
import { authenticateJwt } from '../middlewares/authMiddleware';

export const chatRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/createchatroom', { preHandler: authenticateJwt }, createChatroom);
  fastify.get('/chatrooms', { preHandler: authenticateJwt }, getChatroomsForUser);
  fastify.get('/chat/:chatroomId', { preHandler: authenticateJwt }, getChatHistory);
};
