import { FastifyRequest, FastifyReply } from 'fastify';
import * as model from '../models/index'; 
import { AppDataSource } from '../config/dbconfig'; 
import { AuthenticatedRequest} from '../interfaces/interfaces';
import {storeSchema,addStoreWorkerSchema} from '../shared/validation/userValidation'
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config(); 

export const createStore = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  const userId = request.user?.userId;
  const parseResult = storeSchema.safeParse(request.body);
  if (!parseResult.success) {
    return reply.status(400).send({ message: 'Invalid input', errors: parseResult.error.errors });
  }

  const { name, description, address, city, postalCode, phone, email, images } = parseResult.data;

  if (!userId) {
    return reply.status(401).send({ message: 'User not authenticated' });
  }

  try {
    const creator = await AppDataSource.getRepository(model.User).findOne({ where: { userId } });

    if (!creator) {
      return reply.status(404).send({ message: 'User not found' });
    }

    const fullAddress = `${address}, ${city}, ${postalCode}`;
    const coordinates = await geocodeAddress(fullAddress);

    if (!coordinates) {
      return reply.status(400).send({ message: 'Unable to geocode address' });
    }

    const { lat, lng } = coordinates;

    const store = new model.Store();
    store.name = name;
    store.description = description;
    store.address = address;
    store.city = city;
    store.postalCode = postalCode;
    store.phone = phone;
    store.email = email;
    store.latitude = lat;
    store.longitude = lng;

    await AppDataSource.getRepository(model.Store).save(store);

    const storeWorker = new model.StoreWorker();
    storeWorker.store = store;
    storeWorker.user = creator;
    storeWorker.role = 'owner';
    await AppDataSource.getRepository(model.StoreWorker).save(storeWorker);

    if (images && images.length > 0) {
      const storePicturesList: model.StorePictures[] = [];

      images.forEach((image, index) => {
        const storePicture = new model.StorePictures();
        storePicture.store = store;
        storePicture.imageUrl = image;
        
        storePicture.imageType = index === 0 ? 'cover_image' : 'basic_image';
        storePicturesList.push(storePicture);
      });

      await AppDataSource.getRepository(model.StorePictures).save(storePicturesList);
    }

    return reply.status(201).send({ message: 'Store created successfully', store });
  } catch (error) {
    console.error('Error during store creation:', error);
    return reply.status(500).send({ message: 'An error occurred while creating the store' });
  }
};

const geocodeAddress = async (address: string): Promise<{ lat: number, lng: number } | null> => {
  try {
    const apiKey = "AIzaSyCSJN2Qzyjhv-AFd1I2LVLD30hX7-lZhRE";
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await axios.get(geocodeUrl);
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      console.error(`Geocoding failed for address: ${address}`);
      return null;
    }
  } catch (error) {
    console.error('Error during geocoding request:', error);
    return null;
  }
};

export const getAllStores = async (request:FastifyRequest,reply: FastifyReply) => {
  try {
    const stores = await AppDataSource.getRepository(model.Store).find();

    return reply.status(200).send({
      message: 'Stores retrieved successfully',
      stores: stores,
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return reply.status(500).send({ message: 'An error occurred while retrieving stores' });
  }
};

export const addStoreWorker = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  const userId = request.user?.userId;
  

  const validatedData = addStoreWorkerSchema.parse(request.body);
  const { storeId, workerId } = validatedData;


  try {
    const store = await AppDataSource.getRepository(model.Store).findOne({
      where: { storeId: storeId },
      relations: ['storeWorkers', 'storeWorkers.user'],  
    });
    

    if (!store) {
      return reply.status(404).send({ message: 'Store not found' });
    }

    const worker = await AppDataSource.getRepository(model.User).findOneBy({ userId: workerId });
    if (!worker) {
      return reply.status(404).send({ message: 'Worker not found' });
    }

    const existingWorker = store.storeWorkers.find(storeWorker => storeWorker.user.userId === workerId);
    if (existingWorker) {
      return reply.status(400).send({ message: 'Worker already assigned to this store' });
    }

    if (userId === workerId) {
      return reply.status(400).send({ message: 'Cannot add yourself as a worker' });
    }

    const friendship = await AppDataSource.getRepository(model.Friendship).findOne({
      where: [
        { user: { userId: userId }, friend: { userId: workerId }, status: 'accepted' },
        { user: { userId: workerId }, friend: { userId: userId }, status: 'accepted' },
      ],
    });

    if (!friendship) {
      return reply.status(400).send({ message: 'Worker must be a friend' });
    }

    const storeWorkersRepo = AppDataSource.getRepository(model.StoreWorker);
    const storeWorkersCount = await storeWorkersRepo.count({ where: { store: { storeId } } });

    if (storeWorkersCount >= 4) {
      return reply.status(400).send({ message: 'Store already has the maximum number of workers' });
    }

    const newStoreWorker = new model.StoreWorker();
    newStoreWorker.store = store;
    newStoreWorker.user = worker;
    newStoreWorker.role = 'worker';


    await storeWorkersRepo.save(newStoreWorker);

    return reply.status(200).send({ message: 'Worker added successfully' });

  } catch (error) {
    console.error('Error adding worker:', error);
    return reply.status(500).send({ message: 'Internal server error' });
  }
};

