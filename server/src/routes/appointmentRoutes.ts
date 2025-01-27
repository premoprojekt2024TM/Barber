import { FastifyInstance } from 'fastify';
import { authenticateJwt } from '../middlewares/authMiddleware';
import { createAppointment, getAppointment } from '../controllers/appointmentController';


export const appointmentRoutes = async (fastify: FastifyInstance) => { 
 fastify.post('/createAppointment',{ preHandler: authenticateJwt }, createAppointment) 
 fastify.get('/getAppointment',{ preHandler: authenticateJwt },getAppointment)
};