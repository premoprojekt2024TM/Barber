import bcrypt from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource } from "../config/dbconfig";
import { generateToken } from "../middlewares/authMiddleware";
import * as model from "../models/index";
import { uploadProfilePicture } from "../config/awsconfig";
import {
  loginSchema,
  registerSchema,
  updateSchema,
} from "../shared/validation/userValidation";
import { AuthenticatedRequest } from "../interfaces/interfaces";


//regisztráció
export const registerUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const result = registerSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400);
  }

  const { username, email, password, role, firstName, lastName } = result.data;

  if (role !== "client" && role !== "worker") {
    return reply
      .status(400)
      .send({ message: 'Érvénytelen szerep. A szerepnek „client” vagy „worker” kell lennie.' });
  }

  const existingEmail = await AppDataSource.getRepository(model.User).findOneBy(
    {
      email,
    },
  );
  if (existingEmail) {
    return reply.status(400).send({ message: "Ez az email cím már létezik" });
  }

  const existingUser = await AppDataSource.getRepository(model.User).findOneBy({
    username,
  });
  if (existingUser) {
    return reply
      .status(400)
      .send({ message: "Ez a felhasználónév már létezik" });
  }


  //profilekép
  const generateProfilepic = `https://ui-avatars.com/api/?name=${username[0]}&size=128`;


  //adatbázisba beillesztés
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new model.User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.role = role;
    newUser.profilePic = generateProfilepic;
    newUser.lastName = lastName;
    newUser.firstName = firstName;
    await AppDataSource.getRepository(model.User).save(newUser);
    return reply
      .status(201)
      .send({ message: "Felhasználó sikeresen létrehozva." });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt Felhasználó létrehozása közben" });
  }
};



//bejelentkezés
export const loginUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const result = loginSchema.safeParse(request.body);
  if (!result.success) {
    return reply
      .status(400)
      .send({ message: "Sikertelen validáció"});
  }

  const { email, password } = result.data;

  try {
    const user = await AppDataSource.getRepository(model.User).findOneBy({
      email,
    });

    if (!user) {
      return reply.status(401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply
        .status(400)
        .send({ message: "Érvénytelen hitelesítő adatok" });
    }

    const token = generateToken(user);

    return reply.send({ message: "Sikeres bejelentkezés", token });
  } catch (error) {
    return reply.status(500).send({ message: "Hiba történt bejelentkezéskor" });
  }
};

//frissités
export const updateUser = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(400).send({ message: "Hiányzó Felhasználó ID" });
  }

  const result = updateSchema.safeParse(request.body);
  if (!result.success) {
    return reply
      .status(400)
      .send({ message: "Sikertelen validáció" });
  }

  const { username, email, password, firstName, lastName, profilePic } =
    result.data;

  try {
    const userRepository = AppDataSource.getRepository(model.User);
    const user = await userRepository.findOneBy({ userId });

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    // Ellenőrizze, hogy a felhasználónév már foglalt-e (csak ha frissítés történik)
    if (username && username !== user.username) {
      const checkUsername = await userRepository.findOneBy({ username });
      if (checkUsername) {
        return reply.status(400).send({ message: "Ez a felhasználónév már létezik!" });
      }
    }

    let profilePictureUrl: string | undefined;
    if (profilePic) {
      try {
        profilePictureUrl = await uploadProfilePicture(
          profilePic, 
          `${userId}-${Date.now()}.png`, 
          "image/png", 
        );
      } catch (uploadError) {
        return reply
          .status(500)
          .send({ message: "Nem sikerült feltölteni a profilképet." });
      }
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profilePictureUrl) user.profilePic = profilePictureUrl;

    if (password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    }

    await userRepository.save(user);
    
    const { password: removedPassword, ...userWithoutPassword } = user;

    return reply.send({
      message: "Sikeres Felhasználói profil frissités",
      user: userWithoutPassword,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba lépett fel frissités közben" });
  }
};

//Törlés
export const deleteUser = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  if (!userId) {
    return reply.status(400).send({ message: "Hiányzó Felhasználó ID." });
  }

  try {
    const userRepository = AppDataSource.getRepository(model.User);
    const user = await userRepository.findOneBy({ userId: userId });

    if (!user) {
      return reply.status(404).send({ message: "Nem található felhasználó." });
    }

    const storeWorker = await AppDataSource.getRepository(
      model.StoreWorker,
    ).findOne({
      where: { user: { userId }, role: "owner" },
      relations: ["store"],
    });

    if (storeWorker && storeWorker.store) {
      const storeId = storeWorker.store.storeId;

      const storeWorkers = await AppDataSource.getRepository(
        model.StoreWorker,
      ).find({
        where: { store: { storeId } },
        relations: ["user"],
      });

      for (const worker of storeWorkers) {
        const workerId = worker.user.userId;

        await AppDataSource.getRepository(model.Appointment).delete({
          worker: { userId: workerId },
        });

        await AppDataSource.getRepository(model.AvailabilityTimes).delete({
          user: { userId: workerId },
        });
      }

      await AppDataSource.getRepository(model.StoreWorker).delete({
        store: { storeId },
      });

      await AppDataSource.getRepository(model.Store).delete({ storeId });
    }

    const appointments = await AppDataSource.getRepository(
      model.Appointment,
    ).find({
      where: [{ client: { userId } }, { worker: { userId } }],
      relations: ["timeSlot"],
    });

    for (const appointment of appointments) {
      if (appointment.timeSlot) {
        appointment.timeSlot.status = "available";
        await AppDataSource.getRepository(model.AvailabilityTimes).save(
          appointment.timeSlot,
        );
      }
    }

    await AppDataSource.getRepository(model.Appointment).delete({
      client: { userId },
    });

    await AppDataSource.getRepository(model.Appointment).delete({
      worker: { userId },
    });

    await AppDataSource.getRepository(model.AvailabilityTimes).delete({
      user: { userId },
    });

    const friendships = await AppDataSource.getRepository(
      model.Friendship,
    ).find({
      where: [{ user: { userId } }, { friend: { userId } }],
    });

    for (const friendship of friendships) {
      await AppDataSource.getRepository(model.Friendship).remove(friendship);
    }

    await userRepository.remove(user);

    return reply.send({
      message: "Fiók és adatai sikeresen törölve",
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt a fiók törlése közben" });
  }
};

export const getCurrentUser = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  if (!userId) {
    return reply.status(400).send({ message: "Hiányzó Felhasználó ID." });
  }

  try {
    const userRepository = AppDataSource.getRepository(model.User);

    //Felhasználói profil keresése ID alapján
    const user = await userRepository.findOne({
      where: { userId },
      select: [
        "userId",
        "username",
        "email",
        "firstName",
        "lastName",
        "profilePic",
      ],
    });

    if (!user) {
      return reply.status(404).send({ message: "Felhasználói profil nem található" });
    }

    // Return the user data
    return reply.send(user);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt a felhasználói adatok lekérése közben." });
  }
};
