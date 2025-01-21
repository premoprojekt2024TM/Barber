import bcrypt from 'bcryptjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AppDataSource } from '../config/dbconfig';
import { generateToken } from '../middlewares/authMiddleware';
import * as model from '../models/index'; 
import { loginSchema, registerSchema, updateSchema } from '../shared/validation/userValidation';
import { AuthenticatedRequest , GetUserParams } from '../interfaces/interfaces';



export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const result = registerSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({ message: 'Validation failed', errors: result.error.errors });
  }

  const { username, email, password, role } = result.data;

  if (role !== 'client' && role !== 'hairdresser') {
    return reply.status(400).send({ message: 'Invalid role. Must be either "client" or "hairdresser".' });
  }

  const existingUser = await AppDataSource.getRepository(model.User).findOneBy({ email });
  if (existingUser) {
    return reply.status(400).send({ message: 'User already exists' });
  }

  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new model.User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.role = role;  

    await AppDataSource.getRepository(model.User).save(newUser);

    const newExtendedUser = new model.ExtendedUser();
    newExtendedUser.user = newUser;
    newExtendedUser.firstName = '';
    newExtendedUser.lastName = '';
    newExtendedUser.birthday = undefined;
    newExtendedUser.profilePic = 'https://place-hold.it/300';
    
    await AppDataSource.getRepository(model.ExtendedUser).save(newExtendedUser);

    return reply.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    return reply.status(500).send({ message: 'Error creating user' });
  }
};

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const result = loginSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({ message: 'Validation failed', errors: result.error.errors });
  }

  const { email, password } = result.data;

  try {
    const user = await AppDataSource.getRepository(model.User).findOneBy({ email });

    if (!user) {
      return reply.status(400).send({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.status(400).send({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    return reply.send({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    return reply.status(500).send({ message: 'An error occurred during login' });
  }
};

export const updateUser = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(400).send({ message: 'User ID is missing' });
  }

  const result = updateSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({ message: 'Validation failed', errors: result.error.errors });
  }

  const { username, email, password } = result.data;

  try {
    const userRepository = AppDataSource.getRepository(model.User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    }

    await userRepository.save(user);
    return reply.send({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error during user update:', error);
    return reply.status(500).send({ message: 'An error occurred while updating user' });
  }
};

export const deleteUser = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(400).send({ message: 'User ID is missing' });
  }
  try {
    const userRepository = AppDataSource.getRepository(model.User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    await userRepository.remove(user);
    return reply.send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error during user deletion:', error);
    return reply.status(500).send({ message: 'An error occurred while deleting user' });
  }
};


export const profile = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(400).send({ message: 'User ID is missing' });
  }

  try {
    const userRepository = AppDataSource.getRepository(model.User);
    const extendedUserRepository = AppDataSource.getRepository(model.ExtendedUser);

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    const extendedUser = await extendedUserRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'], 
    });

    if (!extendedUser) {
      return reply.status(404).send({ message: 'Extended user not found' });
    }

    const profileData = {
      userId: user.id,
      username: user.username,
      email: user.email,
      firstName: extendedUser.firstName,
      lastName: extendedUser.lastName,
      birthday: extendedUser.birthday,
      profilePic: extendedUser.profilePic,
    };

    return reply.send({ message: 'Profile data fetched successfully', profileData });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return reply.status(500).send({ message: 'An error occurred while fetching profile data' });
  }
};

export const getUserByUsername = async (request: FastifyRequest<{ Params: GetUserParams }>, reply: FastifyReply) => {
  const { username } = request.params;

  if (!username || typeof username !== 'string') {
    return reply.status(400).send({ message: 'Invalid username' });
  }

  try {
    const userRepository = AppDataSource.getRepository(model.User);
    const extendedUserRepository = AppDataSource.getRepository(model.ExtendedUser);

    
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    const extendedUser = await extendedUserRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user'], 
    });

    if (!extendedUser) {
      return reply.status(404).send({ message: 'Extended user not found' });
    }

    return reply.send({
      message: 'User fetched successfully',
      user: {
        id: user.id,
        username: user.username,
        profilePic: extendedUser.profilePic, 
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return reply.status(500).send({ message: 'An error occurred while fetching user data' });
  }
};