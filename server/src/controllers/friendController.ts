import { FastifyReply } from "fastify";
import { AppDataSource } from "../config/dbconfig";
import * as model from "../models/index";
import {
  AuthenticatedRequest,
  FriendRequestBody,
} from "../interfaces/interfaces";

export const sendFriendRequest = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { friendId } = request.body as { friendId: number };

  if (userId === friendId) {
    return reply
      .status(400)
      .send({ message: "You cannot send a friend request to yourself" });
  }

  try {
    const user = await AppDataSource.getRepository(model.User).findOneBy({
      userId: userId,
    });
    const friend = await AppDataSource.getRepository(model.User).findOneBy({
      userId: friendId,
    });

    if (!user || !friend) {
      return reply.status(404).send({ message: "User or Friend not found" });
    }

    if (friend.role === "client") {
      return reply
        .status(400)
        .send({ message: "You cannot send a friend request to a client" });
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
        .send({ message: "Friendship request already exists or is pending" });
    }

    const friendRequest = new model.Friendship();
    friendRequest.user = user;
    friendRequest.friend = friend;
    friendRequest.status = "pending";

    await AppDataSource.getRepository(model.Friendship).save(friendRequest);

    return reply
      .status(201)
      .send({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while sending friend request" });
  }
};

export const acceptFriendRequest = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const userId = request.user?.userId;
  const { friendId } = request.body as FriendRequestBody;

  if (userId === friendId) {
    return reply
      .status(400)
      .send({ message: "You cannot accept a friend request from yourself" });
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

    return reply.status(200).send({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred while accepting friend request" });
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
    const friendships = await AppDataSource.getRepository(
      model.Friendship,
    ).find({
      where: [
        { user: { userId: userId }, status: "accepted" },
        { friend: { userId: userId }, status: "accepted" },
      ],
    });

    if (friendships.length === 0) {
      return reply.status(404).send({ message: "You have no friends" });
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
    return reply
      .status(500)
      .send({
        message: "An error occurred while fetching sent friend requests",
      });
  }
};
