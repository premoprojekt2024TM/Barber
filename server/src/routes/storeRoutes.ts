import { FastifyInstance, FastifyReply } from 'fastify';
import { createStore, getAllStores,addStoreWorker} from '../controllers/storeController';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { authenticateJwt } from '../middlewares/authMiddleware';


export const storeRoutes = async (fastify: FastifyInstance) => {
  const rateLimiter = new RateLimiterMemory({
    points: 100, 
    duration: 10 * 60,
  });


  fastify.get('/Store', { preHandler: authenticateJwt }, getAllStores);
  fastify.post('/createStore', { preHandler: authenticateJwt } , async (request,reply) => {
    try {
      await rateLimiter.consume(request.ip);
      return createStore(request, reply);
    }
    catch(error) {
        reply.status(429).send({ message: 'Too many requests, please try again later.' });
    }
  });
  fastify.post('/addStoreWorker', { preHandler: authenticateJwt }, addStoreWorker)
};
