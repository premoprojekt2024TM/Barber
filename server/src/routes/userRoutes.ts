import { FastifyInstance } from 'fastify';
import { registerUser, loginUser, deleteUser, updateUser, profile } from '../controllers/authController';
import { createStore,getAllStores } from '../controllers/storeController';
import { authenticateJwt, checkRole } from '../middlewares/authMiddleware';

export const userRoutes = async (fastify: FastifyInstance) => {
  //Publicly available to all user 
  fastify.post('/register', registerUser);
  fastify.post('/login', loginUser);
  fastify.get('/Store',getAllStores); 
  
  //Available only to user whom logged in 
  fastify.delete('/delete', { preHandler: authenticateJwt }, deleteUser);
  fastify.put('/new', { preHandler: authenticateJwt }, updateUser);
  fastify.get('/profile', { preHandler: authenticateJwt }, profile);
  fastify.get('/dashboard', { preHandler: authenticateJwt }, async (request, reply) => 
  {
    return reply.send({ message: 'Welcome to your dashboard!' });
  });
  
  //Avilable only to hairdressers
  fastify.get('/hairdresser', { preHandler: [authenticateJwt, checkRole('hairdresser')] }, async (request, reply) => {
    return reply.send({ message: 'Welcome Hairdresser!' });
  });
  fastify.post('/createStore', { preHandler: [authenticateJwt, checkRole('hairdresser')] } ,createStore); 

  //Available only to client
  fastify.get('/client', { preHandler: [authenticateJwt, checkRole('client')] }, async (request, reply) => {
      return reply.send({ message: 'Welcome Client!' });
    });
  
};
