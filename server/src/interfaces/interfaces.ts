import { FastifyRequest } from "fastify/types/request";

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: number;
    email: string;
    role: 'client' | 'hairdresser';
    username: string;  
  };
}

export interface JwtPayload {
  id: number;
  email: string;
  role: 'client' | 'hairdresser';
  username: string; 
}

export interface GetUserParams {
  username: string; 
}

export interface ChatroomParams {
  chatroomId: string; 
}

export interface FriendRequestBody {
  friendId: number;
}

