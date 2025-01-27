import { FastifyRequest, FastifyReply } from 'fastify';
import * as model from '../models/index'; 
import { AppDataSource } from '../config/dbconfig'; 
import { AuthenticatedRequest,StoreRequestBody } from '../interfaces/interfaces';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config(); 

export const createStore = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  const userId = request.user?.id;
  
  const { name, description, address, city, postalCode, phone, email, images} = request.body as StoreRequestBody;

  try {
    const creator = await AppDataSource.getRepository(model.User).findOne({ where: { id: userId } });

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
    store.createdBy = creator;
    store.latitude = lat;
    store.longitude = lng;

    await AppDataSource.getRepository(model.Store).save(store);

    if (images && images.length > 0) {
         const storePictures = new model.StorePictures();
         storePictures.store = store;
   
         if (images[0]) storePictures.coverimage = images[0];
         if (images[1]) storePictures.coverimage2 = images[1];
         if (images[2]) storePictures.coverimage3 = images[2];
         if (images[3]) storePictures.coverimage4 = images[3];
   
         await AppDataSource.getRepository(model.StorePictures).save(storePictures);
       }
    
    return reply.status(201).send({ message: 'Store created successfully', store });
  } catch (error) {
    console.error('Error during store creation:', error);
    return reply.status(500).send({ message: 'An error occurred while creating the store' });
  }
};

const geocodeAddress = async (address: string): Promise<{ lat: number, lng: number } | null> => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
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

export const getAllStores = async (request: FastifyRequest, reply: FastifyReply) => {
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
  const userId = request.user?.id;
  const { storeId, workerId } = request.body as { storeId: number; workerId: number };

  try {
    const store = await AppDataSource.getRepository(model.Store).findOne({
      where: { id: storeId },
      relations: ['createdBy'],
    });

    if (!store) {
      return reply.status(404).send({ message: 'Store not found' });
    }

    const worker = await AppDataSource.getRepository(model.User).findOneBy({ id: workerId });
    if (!worker) {
      return reply.status(404).send({ message: 'Worker not found' });
    }

    if (worker.id === store.createdBy.id) {
      return reply.status(400).send({ message: 'Owner cannot be added as worker' });
    }

    const friendship = await AppDataSource.getRepository(model.Friendship).findOne({
      where: [
        { user: { id: userId }, friend: { id: workerId }, status: 'accepted' },
        { user: { id: workerId }, friend: { id: userId }, status: 'accepted' },
      ],
    });
    if (!friendship) {
      return reply.status(400).send({ message: 'Worker must be a friend' });
    }

    const storeWorkersRepo = AppDataSource.getRepository(model.StoreWorkers);
    let storeWorkers = await storeWorkersRepo.findOne({
      where: { store: { id: storeId } },
      relations: ['worker1', 'worker2', 'worker3', 'worker4'],
    });

    if (!storeWorkers) {
      storeWorkers = storeWorkersRepo.create({
        store,
        owner: store.createdBy
      });
      await storeWorkersRepo.save(storeWorkers);
    }


    const existingWorkers = [
      storeWorkers.worker1?.id ?? null,
      storeWorkers.worker2?.id ?? null,
      storeWorkers.worker3?.id ?? null,
      storeWorkers.worker4?.id ?? null
    ];

    if (existingWorkers.includes(workerId)) {
      return reply.status(400).send({ message: 'Worker already assigned' });
    }

    const availableSlots: {
      field: keyof model.StoreWorkers;
      value: model.User | null;
    }[] = [
      { field: 'worker1', value: storeWorkers.worker1 ?? null },
      { field: 'worker2', value: storeWorkers.worker2 ?? null },
      { field: 'worker3', value: storeWorkers.worker3 ?? null },
      { field: 'worker4', value: storeWorkers.worker4 ?? null }
    ];

    const availableSlot = availableSlots.find(slot => !slot.value);
    if (!availableSlot) {
      return reply.status(400).send({ message: 'No available slots' });
    }

    type WorkerFields = 'worker1' | 'worker2' | 'worker3' | 'worker4';
    storeWorkers[availableSlot.field as WorkerFields] = worker;
    await storeWorkersRepo.save(storeWorkers);

    return reply.status(200).send({ message: 'Worker added successfully' });

  } catch (error) {
    console.error('Error adding worker:', error);
    return reply.status(500).send({ message: 'Internal server error' });
  }
};

