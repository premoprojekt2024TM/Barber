import { FastifyInstance, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import * as model from '../models/index'; 
import { AppDataSource } from '../config/dbconfig';
import { JwtPayload, ChatroomParams } from '../interfaces/interfaces';

export async function chatController(fastify: FastifyInstance) {
  const clients: Map<string, Set<any>> = new Map();  
  const authenticateSocket = async (socket: any, req: any) => {
    const token = req.query.token;

    if (!token) {
      socket.close();
      return null;
    }

    try {
      const decoded = jwt.verify(token, "process.env.JWT_SECRET") as JwtPayload;
      
      socket.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        username: decoded.username,
      };

      return socket.user;
    } catch (error) {
      socket.close(); 
      console.error('Invalid token:', error);
      return null;
    }
  };

  const saveMessage = async (chatroomId: string, senderId: number, content: string) => {
    try {
      const chatRoom = await AppDataSource.getRepository(model.ChatRoom).findOne({
        where: { id: chatroomId }
      });
      const sender = await AppDataSource.getRepository(model.User).findOne({
        where: { id: senderId }
      });

      if (!chatRoom || !sender) {
        throw new Error('ChatRoom or User not found');
      }

      const message = new model.Message();
      message.chatRoom = chatRoom;
      message.sender = sender;
      message.content = content;

      await AppDataSource.getRepository(model.Message).save(message);
      console.log('Message saved successfully');
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  fastify.get('/chat/:chatroomId', { websocket: true }, async (socket, req) => {
    const { chatroomId } = req.params as ChatroomParams; 
    const user = await authenticateSocket(socket, req);

    if (!user) return;  

    const chatRoom = await AppDataSource.getRepository(model.ChatRoom).findOne({
      where: [
        { id: chatroomId, user1: { id: user.id } },
        { id: chatroomId, user2: { id: user.id } },
      ],
    });

    if (!chatRoom) {
      socket.close();  
      console.log(`Unauthorized access attempt to chatroom ${chatroomId} by ${user.username}`);
      return;
    }

    console.log(`New WebSocket connection from ${user.username} to chatroom ${chatroomId}`);
    if (!clients.has(chatroomId)) {
      clients.set(chatroomId, new Set());
    }
    clients.get(chatroomId)!.add(socket);

    socket.on('message', async (message: string) => {
      console.log(`Received message from ${user.username} in chatroom ${chatroomId}: ${message.toString()}`);

      await saveMessage(chatroomId, user.id, message.toString());

      for (let client of clients.get(chatroomId) || []) {
        if (client !== socket && client.readyState === client.OPEN) {
          client.send(JSON.stringify({
            userName: user.username,
            userRole: user.role,
            message: message.toString(),
          }));
        }
      }
    });

    socket.on('close', () => {
      clients.get(chatroomId)?.delete(socket);
      console.log(`WebSocket connection from ${user.username} to chatroom ${chatroomId} closed.`);
    });
  });
}

export const createChatroom = async (request: any, reply: FastifyReply) => {
  const userId = request.user?.id;
  const { friendId } = request.body as { friendId: number };

  if (userId === friendId) {
    return reply.status(400).send({ message: 'You cannot create a chatroom with yourself' });
  }

  try {
    const user = await AppDataSource.getRepository(model.User).findOneBy({ id: userId });
    const friend = await AppDataSource.getRepository(model.User).findOneBy({ id: friendId });

    if (!user || !friend) {
      return reply.status(404).send({ message: 'User or Friend not found' });
    }

    const existingChatRoom = await AppDataSource.getRepository(model.ChatRoom).findOne({
      where: [
        { user1: user, user2: friend },
        { user1: friend, user2: user }
      ],
    });

    if (existingChatRoom) {
      return reply.status(400).send({ message: 'A chatroom already exists between these users' });
    }

    const chatRoom = new model.ChatRoom();
    chatRoom.user1 = user;
    chatRoom.user2 = friend;
    chatRoom.name = `${user.username} & ${friend.username}`;

    await AppDataSource.getRepository(model.ChatRoom).save(chatRoom);

    return reply.status(201).send({ message: 'Chat room created successfully', chatRoom });
  } catch (error) {
    console.error('Error creating chatroom:', error);
    return reply.status(500).send({ message: 'An error occurred while creating the chat room' });
  }
};

export const getChatroomsForUser = async (request: any, reply: FastifyReply) => {
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(400).send({ message: 'User not authenticated' });
  }

  try {
    const chatrooms = await AppDataSource.getRepository(model.ChatRoom).find({
      where: [
        { user1: { id: userId } },
        { user2: { id: userId } }
      ],
    });

    if (chatrooms.length === 0) {
      return reply.status(404).send({ message: 'No chatrooms found for the user' });
    }

    return reply.status(200).send({ chatrooms });
  } catch (error) {
    console.error('Error fetching chatrooms for user:', error);
    return reply.status(500).send({ message: 'An error occurred while fetching chatrooms' });
  }
};

export const getChatHistory = async (request: any, reply: FastifyReply) => {
  const userId = request.user?.id;
  const { chatroomId } = request.params as { chatroomId: string };

  if (!userId) {
    return reply.status(400).send({ message: 'User not authenticated' });
  }

  try {
    const chatRoom = await AppDataSource.getRepository(model.ChatRoom).findOne({
      where: { id: chatroomId },
      relations: ['user1', 'user2'],
    });

    if (!chatRoom) {
      return reply.status(404).send({ message: 'Chatroom not found' });
    }

    if (chatRoom.user1.id !== userId && chatRoom.user2.id !== userId) {
      return reply.status(403).send({ message: 'You do not have permission to view this chat history' });
    }

    const messages = await AppDataSource.getRepository(model.Message).find({
      where: { chatRoom: { id: chatRoom.id } },
      order: { createdAt: 'ASC' },  
      relations: ['sender'],
    });

    return reply.status(200).send({ messages, chatroomId: chatRoom.id });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return reply.status(500).send({ message: 'An error occurred while fetching the chat history' });
  }
};
