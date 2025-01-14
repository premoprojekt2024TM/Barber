import jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = "process.env.JWT_SECRET";


export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: number;
    email: string;
    role: 'client' | 'hairdresser'; 
  };
}



interface JwtPayload {
  id: number;
  email: string;
  role: 'client' | 'hairdresser'; 
}

export const generateToken = (user: { id: number; email: string; role: 'client' | 'hairdresser' }) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role, 
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  return token;
};

export const authenticateJwt = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  const authHeader = request.headers['authorization'];

  if (!authHeader) {
    return reply.status(401).send({ message: 'Authorization token is required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    request.user = { id: decoded.id, email: decoded.email, role: decoded.role }; 
    return true;
  } catch (error) {
    console.error('Invalid token:', error);
    return reply.status(403).send({ message: 'Invalid or expired token' });
  }
};

export const checkRole = (role: 'client' | 'hairdresser') => {
  return (request: AuthenticatedRequest, reply: FastifyReply) => {
    if (request.user?.role !== role) {
      return reply.status(403).send({ message: 'You do not have permission to access this resource' });
    }
  };
};
