import { FastifyRequest } from "fastify/types/request";

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    userId: number;
    email: string;
    role: "client" | "worker";
    username: string;
    profilePic?: string;
  };
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: "client" | "worker";
  username: string;
  profilePic?: string;
}

export interface GetUserParams {
  username: string;
}

export interface ChatroomParams {
  chatroomId: number;
}

export interface FriendRequestBody {
  friendId: number;
}

export interface StoreRequestBody {
  name: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  images: string[];
  workers: string;
}

export interface AvailabilityRequest {
  monday?: string[];
  tuesday?: string[];
  wednesday?: string[];
  thursday?: string[];
  friday?: string[];
  saturday?: string[];
  sunday?: string[];
}

export interface GetIdParams {
  id: string;
}

export interface GetStoreId {
  storeId: number;
}

export interface CreateAppointmentRequestBody {
  availabilityId: number;
  workerId: number;
  storeworkerId: number;
  timeSlot: string;
  notes?: string;
  day: string;
}
