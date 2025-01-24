import { FastifyRequest, FastifyReply } from 'fastify';
import * as model from '../models/index'; 
import { AppDataSource } from '../config/dbconfig'; 
import { AuthenticatedRequest } from '../interfaces/interfaces';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

export const createStore = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  const userId = request.user?.id;

  const { name, description, address, city, postalCode, phone, email } = request.body as model.Store;

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


