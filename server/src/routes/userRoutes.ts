import { FastifyInstance } from 'fastify';
import { registerUser, loginUser, deleteUser, updateUser, profile, getUserByUsername } from '../controllers/authController';
import { authenticateJwt } from '../middlewares/authMiddleware';

export const userRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/register', {
     schema: {
       description: 'Register a new user',
       tags: ['user'],  
       body: {
         type: 'object',
         properties: {
           username: { type: 'string' },
           email: { type: 'string', format: 'email' },
           password: { type: 'string' },
         },
         required: ['username', 'email', 'password'], 
       },
       response: {
         201: {
           description: 'User successfully registered',
           type: 'object',
           properties: {
             message: { type: 'string' },
           },
         },
         400: {
           description: 'Bad request',
         },
       },
     },
     handler: registerUser, 
   });
  
  fastify.post('/login', loginUser);

  fastify.delete('/delete', { preHandler: authenticateJwt }, deleteUser);
  fastify.put('/new', { preHandler: authenticateJwt }, updateUser);
  fastify.get('/profile', { preHandler: authenticateJwt }, profile);
  fastify.get('/user/:username', getUserByUsername);
};