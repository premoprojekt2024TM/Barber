import { FastifyInstance } from 'fastify';
import { createStore, getAllStores } from '../controllers/storeController';

export const storeRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/Store', getAllStores);
  fastify.post('/createStore', createStore);
};
