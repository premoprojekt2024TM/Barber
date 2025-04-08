import { FastifyReply } from "fastify";
import { AppDataSource } from "../config/dbconfig";
import * as model from "../models/index";
import { Not, In } from "typeorm";
import {
  AuthenticatedRequest,
  FriendRequestBody,
} from "../interfaces/interfaces";

//barátkérelem küldése
export const sendFriendRequest = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { friendId } = request.body as { friendId: number };

  if (userId === friendId) {
    return reply
      .status(400)
      .send({ message: "Magadnak nem tudsz barátkérelmet küldeni" });
  }

  try {
    const user = await AppDataSource.getRepository(model.User).findOneBy({
      userId: userId,
    });
    const friend = await AppDataSource.getRepository(model.User).findOneBy({
      userId: friendId,
    });

    if (!user || !friend) {
      return reply.status(404).send({ message: "Nem található" });
    }

    if (friend.role === "client") {
      return reply
        .status(400)
        .send({ message: "Nem küldhetsz egy kliensnek barátkérelmet" });
    }

    const existingFriendRequest = await AppDataSource.getRepository(
      model.Friendship,
    ).findOne({
      where: [
        {
          user: { userId: userId },
          friend: { userId: friendId },
          status: "pending",
        },
        {
          user: { userId: friendId },
          friend: { userId: userId },
          status: "pending",
        },
      ],
    });

    if (existingFriendRequest) {
      return reply
        .status(400)
        .send({ message: "Barátkérelem létezik vagy függőben van" });
    }

    const friendRequest = new model.Friendship();
    friendRequest.user = user;
    friendRequest.friend = friend;
    friendRequest.status = "pending";

    await AppDataSource.getRepository(model.Friendship).save(friendRequest);

    return reply
      .status(201)
      .send({ message: "Barátkérelem sikeresen elküldve" });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt barátkérelem elküldése folyamán" });
  }
};

//barátkérelem elfogadása
export const acceptFriendRequest = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { friendId } = request.body as FriendRequestBody;

  if (userId === friendId) {
    return reply.status(400).send({
      message: "Nem tudod a saját magad elküldött barátkérelmet elfogadni",
    });
  }

  try {
    const friendRequest = await AppDataSource.getRepository(
      model.Friendship,
    ).findOne({
      where: [
        {
          user: { userId: userId },
          friend: { userId: friendId },
          status: "pending",
        },
        {
          user: { userId: friendId },
          friend: { userId: userId },
          status: "pending",
        },
      ],
    });

    if (!friendRequest) {
      return reply
        .status(404)
        .send({ message: "Nem található elküldött barátkérelem" });
    }

    friendRequest.status = "accepted";
    await AppDataSource.getRepository(model.Friendship).save(friendRequest);

    const reciprocalRequest = await AppDataSource.getRepository(
      model.Friendship,
    ).findOne({
      where: [
        {
          user: { userId: friendId },
          friend: { userId: userId },
          status: "pending",
        },
        {
          user: { userId: userId },
          friend: { userId: friendId },
          status: "pending",
        },
      ],
    });

    if (reciprocalRequest) {
      reciprocalRequest.status = "accepted";
      await AppDataSource.getRepository(model.Friendship).save(
        reciprocalRequest,
      );
    }
    return reply.status(200).send({ message: "Barátkérelem elfogadva" });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt barátkérelem elfogadása közben" });
  }
};

//barátkérelem elutasítva
export const rejectFriendRequest = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { friendId } = request.body as FriendRequestBody;

  if (userId === friendId) {
    return reply
      .status(400)
      .send({ message: "Nem tudod elutasítani a saját barátkérelmed." });
  }

  try {
    const friendRequest = await AppDataSource.getRepository(
      model.Friendship,
    ).findOne({
      where: [
        {
          user: { userId: userId },
          friend: { userId: friendId },
          status: "pending",
        },
        {
          user: { userId: friendId },
          friend: { userId: userId },
          status: "pending",
        },
      ],
    });

    if (!friendRequest) {
      return reply.status(404).send({ message: "Nincs ilyen barátkérelem" });
    }

    friendRequest.status = "rejected";
    await AppDataSource.getRepository(model.Friendship).save(friendRequest);

    const reciprocalRequest = await AppDataSource.getRepository(
      model.Friendship,
    ).findOne({
      where: [
        {
          user: { userId: friendId },
          friend: { userId: userId },
          status: "pending",
        },
        {
          user: { userId: userId },
          friend: { userId: friendId },
          status: "pending",
        },
      ],
    });

    if (reciprocalRequest) {
      reciprocalRequest.status = "rejected";
      await AppDataSource.getRepository(model.Friendship).save(
        reciprocalRequest,
      );
    }

    return reply.status(200).send({ message: "Barátkérelem elutasítva" });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba lépett fel barátkérelem elutasítása közben." });
  }
};

//összes barát megjelenítése
export const getFriends = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  try {
    const friendships = await AppDataSource.getRepository(
      model.Friendship,
    ).find({
      where: [
        { user: { userId }, status: "accepted" },
        { friend: { userId }, status: "accepted" },
      ],
      relations: ["user", "friend"],
    });

    if (friendships.length === 0) {
      return reply.status(200).send({ message: "Nincsen ismerösőd." });
    }
    const friendIds = friendships.map((friendship) => {
      return friendship.user.userId === userId
        ? friendship.friend.userId
        : friendship.user.userId;
    });

    const storeWorkers = await AppDataSource.getRepository(
      model.StoreWorker,
    ).find({
      where: {
        user: { userId: In(friendIds) },
      },
      relations: ["user"],
    });

    const storeWorkerUserIds = new Set(
      storeWorkers.map((worker) => worker.user.userId),
    );

    const friends = friendships
      .map((friendship) => {
        const friendData =
          friendship.user.userId === userId
            ? friendship.friend
            : friendship.user;
        const { password, ...friendWithoutPassword } = friendData;
        return friendWithoutPassword;
      })
      .filter((friend) => !storeWorkerUserIds.has(friend.userId));

    if (friends.length === 0) {
      return reply
        .status(200)
        .send({ message: "Nincsen olyan ismerösőd aki nem dolgozna." });
    }

    return reply.status(200).send({ friends });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt az ismerősök lekérdezése közben." });
  }
};

//elküldött barátkérelem megjelenítése
export const getPendingFriendRequests = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  try {
    const pendingRequests = await AppDataSource.getRepository(
      model.Friendship,
    ).find({
      where: {
        friend: { userId: userId },
        status: "pending",
      },
    });

    if (pendingRequests.length === 0) {
      return reply
        .status(404)
        .send({ message: "Nincsen függőben lévő barétkérelmed." });
    }

    const pendingFriends = pendingRequests.map((request) => request.user);

    return reply.status(200).send({ pendingFriends });
  } catch (error) {
    return reply.status(500).send({
      message: "Hiba lépett fel lekérdezés közben.",
    });
  }
};

//barátság törlése
export const deleteFriendship = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { friendId } = request.body as FriendRequestBody;

  if (userId === friendId) {
    return reply.status(400);
  }

  try {
    const friendships = await AppDataSource.getRepository(
      model.Friendship,
    ).find({
      where: [
        { user: { userId: userId }, friend: { userId: friendId } },
        { user: { userId: friendId }, friend: { userId: userId } },
      ],
    });

    if (friendships.length === 0) {
      return reply.status(404).send({ message: "Barátság nem található." });
    }

    await AppDataSource.getRepository(model.Friendship).remove(friendships);

    return reply.status(200).send({ message: "Barátság sikeresen törölve" });
  } catch (error) {
    return reply.status(500).send({ message: "Hiba történt" });
  }
};

//elküldött barátság megjelenítése
export const getSentFriendRequests = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  try {
    const sentRequests = await AppDataSource.getRepository(
      model.Friendship,
    ).find({
      where: {
        user: { userId: userId },
        status: "pending",
      },
      relations: ["friend"],
    });

    if (sentRequests.length === 0) {
      return reply
        .status(404)
        .send({ message: "Nincs elküldött ismeröskérelmed." });
    }

    const friendIds = sentRequests.map((request) => request.friend.userId);

    return reply.status(200).send({ sentFriendRequestIds: friendIds });
  } catch (error) {
    return reply.status(500).send({
      message: "Hiba történt a lekérdezésben.",
    });
  }
};

//összes szakember megjelenítése
export const listAllWorkers = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  try {
    const currentUserId = request.user?.userId;
    const userRepository = AppDataSource.getRepository(model.User);
    const friendshipRepository = AppDataSource.getRepository(model.Friendship);

    const workers = await userRepository.find({
      where: {
        role: "worker",
        ...(currentUserId ? { userId: Not(currentUserId) } : {}),
      },
      select: ["userId", "username", "profilePic", "firstName", "lastName"],
    });

    if (!workers || workers.length === 0) {
      return reply.status(404).send({ message: "Nem található szakember." });
    }
    const friendships = await friendshipRepository.find({
      where: [
        { user: { userId: currentUserId } },
        { friend: { userId: currentUserId } },
      ],
      relations: ["user", "friend"],
    });

    const workersWithStatus = workers.map((worker) => {
      const friendship = friendships.find(
        (fs) =>
          (fs.user.userId === currentUserId &&
            fs.friend.userId === worker.userId) ||
          (fs.user.userId === worker.userId &&
            fs.friend.userId === currentUserId),
      );

      let friendshipStatus:
        | "none"
        | "pending_sent"
        | "pending_received"
        | "accepted"
        | "rejected" = "none";

      if (friendship) {
        if (friendship.status === "accepted") {
          friendshipStatus = "accepted";
        } else if (friendship.status === "rejected") {
          friendshipStatus = "rejected";
        } else if (friendship.status === "pending") {
          friendshipStatus =
            friendship.user.userId === currentUserId
              ? "pending_sent"
              : "pending_received";
        }
      }

      return {
        ...worker,
        friendshipStatus,
      };
    });

    return reply.status(200).send({
      message: "Siker.",
      data: workersWithStatus,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt a szakemberek lekérdezése során." });
  }
};

//szakember megjelenítése aki nem dolgozik jelenleg
export const getFriendsv2 = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  try {
    const friendships = await AppDataSource.getRepository(
      model.Friendship,
    ).find({
      where: [
        { user: { userId }, status: "accepted" },
        { friend: { userId }, status: "accepted" },
      ],
      relations: ["user", "friend"],
    });

    if (friendships.length === 0) {
      return reply.status(200).send({ message: "Nincsen ismerösőd" });
    }

    const allFriends = friendships.map((friendship) => {
      return friendship.user.userId === userId
        ? friendship.friend
        : friendship.user;
    });

    const storeWorkerUserIds = await AppDataSource.getRepository(
      model.StoreWorker,
    )
      .createQueryBuilder("storeWorker")
      .select("storeWorker.user_id")
      .getRawMany()
      .then((results) => results.map((result) => result.user_id));

    const nonStoreWorkerFriends = allFriends.filter(
      (friend) => !storeWorkerUserIds.includes(friend.userId),
    );

    return reply.status(200).send({ friends: nonStoreWorkerFriends });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Hiba történt a barátok megjelenítése során" });
  }
};
