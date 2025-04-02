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

export const rejectFriendRequest = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { friendId } = request.body as FriendRequestBody;

  if (userId === friendId) {
    return reply
      .status(400)
      .send({ message: "You cannot reject a friend request from yourself" });
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
        .send({ message: "No pending friend request found" });
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

    return reply.status(200).send({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while rejecting friend request" });
  }
};

export const getFriends = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  try {
    // First, get all friendships
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
      return reply.status(200).send({ message: "You have no friends" });
    }

    // Extract friend IDs
    const friendIds = friendships.map((friendship) => {
      return friendship.user.userId === userId
        ? friendship.friend.userId
        : friendship.user.userId;
    });

    // Get all storeWorkers that have any of these friends as users
    const storeWorkers = await AppDataSource.getRepository(
      model.StoreWorker,
    ).find({
      where: {
        user: { userId: In(friendIds) },
      },
      relations: ["user"],
    });

    // Create a Set of user IDs who are store workers
    const storeWorkerUserIds = new Set(
      storeWorkers.map((worker) => worker.user.userId),
    );

    // Filter friends to only include those who are not store workers
    const friends = friendships
      .map((friendship) => {
        const friendData =
          friendship.user.userId === userId
            ? friendship.friend
            : friendship.user;
        // Remove password from friend data
        const { password, ...friendWithoutPassword } = friendData;
        return friendWithoutPassword;
      })
      .filter((friend) => !storeWorkerUserIds.has(friend.userId));

    if (friends.length === 0) {
      return reply
        .status(200)
        .send({ message: "You have no friends who aren't store workers" });
    }

    return reply.status(200).send({ friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while fetching friends" });
  }
};

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
      return reply.status(404).send({ message: "No pending friend requests" });
    }

    const pendingFriends = pendingRequests.map((request) => request.user);

    return reply.status(200).send({ pendingFriends });
  } catch (error) {
    console.error("Error fetching pending friend requests:", error);
    return reply.status(500).send({
      message: "An error occurred while fetching pending friend requests",
    });
  }
};

export const deleteFriendship = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { friendId } = request.body as FriendRequestBody;

  if (userId === friendId) {
    return reply
      .status(400)
      .send({ message: "You cannot delete a friendship with yourself" });
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
      return reply.status(404).send({ message: "Friendship not found" });
    }

    await AppDataSource.getRepository(model.Friendship).remove(friendships);

    return reply
      .status(200)
      .send({ message: "Friendship deleted successfully" });
  } catch (error) {
    console.error("Error deleting friendship:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while deleting the friendship" });
  }
};

export const getSentFriendRequests = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;

  try {
    // Find all friend requests where the user sent the request and the status is "pending"
    const sentRequests = await AppDataSource.getRepository(
      model.Friendship,
    ).find({
      where: {
        user: { userId: userId },
        status: "pending",
      },
      relations: ["friend"], // Ensure that you get the friend details
    });

    if (sentRequests.length === 0) {
      return reply.status(404).send({ message: "No sent friend requests" });
    }

    // Extract only the friend IDs from the requests
    const friendIds = sentRequests.map((request) => request.friend.userId);

    return reply.status(200).send({ sentFriendRequestIds: friendIds });
  } catch (error) {
    console.error("Error fetching sent friend requests:", error);
    return reply.status(500).send({
      message: "An error occurred while fetching sent friend requests",
    });
  }
};

export const listAllWorkers = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  try {
    const currentUserId = request.user?.userId;
    const userRepository = AppDataSource.getRepository(model.User);
    const friendshipRepository = AppDataSource.getRepository(model.Friendship);

    // Get all workers except the current user
    const workers = await userRepository.find({
      where: {
        role: "worker",
        ...(currentUserId ? { userId: Not(currentUserId) } : {}),
      },
      select: ["userId", "username", "profilePic", "firstName", "lastName"],
    });

    if (!workers || workers.length === 0) {
      return reply.status(404).send({ message: "No workers found" });
    }

    // Get all friendships involving the current user
    const friendships = await friendshipRepository.find({
      where: [
        { user: { userId: currentUserId } },
        { friend: { userId: currentUserId } },
      ],
      relations: ["user", "friend"],
    });

    // Add friendship status to each worker
    const workersWithStatus = workers.map((worker) => {
      // Find friendship where current user and this worker are involved
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
          // Check if current user sent the request or received it
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
      message: "Workers retrieved successfully",
      data: workersWithStatus,
    });
  } catch (error) {
    console.error("Error fetching workers:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while fetching workers" });
  }
};

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
      return reply.status(200).send({ message: "You have no friends" });
    }

    const friends = friendships.map((friendship) => {
      return friendship.user.userId === userId
        ? friendship.friend
        : friendship.user;
    });

    return reply.status(200).send({ friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while fetching friends" });
  }
};
