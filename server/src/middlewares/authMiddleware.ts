import jwt from 'jsonwebtoken';
import { FastifyReply } from 'fastify';
import { AuthenticatedRequest, JwtPayload } from '../interfaces/interfaces';

const JWT_SECRET = "process.env.JWT_SECRET"; 


export const generateToken = (user: { id: number; email: string; role: 'client' | 'hairdresser'; username: string }) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username, 
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
    request.user = { 
      id: decoded.id, 
      email: decoded.email, 
      role: decoded.role, 
      username: decoded.username  
    };
    return true;
  } catch (error) {
    console.error('Invalid token:', error);
    return reply.status(403).send({ message: 'Invalid or expired token' });
  }
};

