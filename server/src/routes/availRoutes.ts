import { FastifyInstance } from 'fastify';
import { authenticateJwt } from '../middlewares/authMiddleware';
import { createAvailability,getAvailability } from '../controllers/availController';
import { createAppointment } from '../controllers/appointmentController';


export const availRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/createAvailability',{ preHandler: authenticateJwt }, createAvailability)
  fastify.get('/getAvailability/:id', { preHandler: authenticateJwt }, getAvailability); 
 fastify.post('/createAppointment',{ preHandler: authenticateJwt }, createAppointment) 
};