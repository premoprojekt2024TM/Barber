import { FastifyInstance } from 'fastify';
import { registerUser, loginUser, deleteUser, updateUser, profile, getUserByUsername } from '../controllers/authController';
import { authenticateJwt } from '../middlewares/authMiddleware';

export const userRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/register', registerUser);
  fastify.post('/login', loginUser);
  fastify.delete('/delete', { preHandler: authenticateJwt }, deleteUser);
  fastify.get('/profile', { preHandler: authenticateJwt }, profile);
  fastify.get('/user/:username', getUserByUsername);
  fastify.put('/new', { preHandler: authenticateJwt }, updateUser);
};