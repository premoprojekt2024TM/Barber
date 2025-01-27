import { FastifyReply } from 'fastify';
import { AppDataSource } from '../config/dbconfig';
import * as model from '../models/index'; 
import { AuthenticatedRequest,CreateAppointmentRequestBody } from '../interfaces/interfaces';  

export const createAppointment = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  const clientId = request.user?.id;  
  if (!clientId) {
    return reply.status(400).send({ message: 'User not authenticated' });
  }

  const { hairdresserId, day, timeSlot, notes } = request.body as CreateAppointmentRequestBody;

  const hairdresser = await AppDataSource.getRepository(model.User).findOne({ where: { id: hairdresserId, role: 'hairdresser' } });
  if (!hairdresser) {
    return reply.status(404).send({ message: 'Hairdresser not found' });
  }

  if (clientId === hairdresser.id) {
    return reply.status(400).send({ message: 'Client cannot be the same as the hairdresser' });
  }


  const timeSlotEntity = await AppDataSource.getRepository(model.AvailabilityTimes).findOne({
    where: { 
      user: { id: hairdresserId },
      day: day,
      time_slot: timeSlot,
      status: 'available'  
    }
  });

  if (!timeSlotEntity) {
    return reply.status(404).send({ message: 'Selected time slot is not available on the specified day' });
  }

  const newAppointment = new model.Appointment();
  newAppointment.client = { id: clientId } as any; 
  newAppointment.hairdresser = hairdresser; 
  newAppointment.timeSlot = timeSlotEntity;  
  newAppointment.status = 'confirmed';  
  newAppointment.notes = notes;  

  timeSlotEntity.status = 'accepted';


  try {
    await AppDataSource.getRepository(model.AvailabilityTimes).save(timeSlotEntity); 
    await AppDataSource.getRepository(model.Appointment).save(newAppointment);  

    return reply.status(201).send({
      message: 'Appointment created successfully',
      appointment: newAppointment,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return reply.status(500).send({
      message: 'Error creating appointment',
    });
  }
};


export const getAppointment = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  const clientId = request.user?.id;  
  if (!clientId) {
    return reply.status(400).send({ message: 'User not authenticated' });
  }

};