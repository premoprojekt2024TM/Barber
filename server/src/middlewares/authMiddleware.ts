import jwt from "jsonwebtoken";
import { FastifyReply } from "fastify";
import { AuthenticatedRequest, JwtPayload } from "../interfaces/interfaces";
import * as dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET nincs deklarálva a környezeti változoban.");
}

export const generateToken = (user: {
  userId: number;
  email: string;
  role: "client" | "worker";
  username: string;
  profilePic?: string;
}) => {
  const payload = {
    userId: user.userId,
    email: user.email,
    role: user.role,
    username: user.username,
    profilePic: user.profilePic,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  return token;
};

export const authenticateJwt = async (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => {
  const authHeader = request.headers["authorization"];

  if (!authHeader) {
    return reply.status(401).send({ message: "Autentikációs kulcs kötelező!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    request.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      username: decoded.username,
      profilePic: decoded.profilePic,
    };
    return true;
  } catch (error) {
    return reply.status(403).send({ message: "Hibás vagy lejárt kulcs." });
  }
};

export const authorizeRole = (allowedRoles: ("client" | "worker")[]) => {
  return async (request: AuthenticatedRequest, reply: FastifyReply) => {
    const user = request.user;
    if (!user) {
      return reply
        .status(401)
        .send({ message: "Felhasználó nincs autentikálva." });
    }

    const { role } = user;

    if (!allowedRoles.includes(role)) {
      return reply.status(403).send({
        message: "Hozzáférés megtagadva: Nincs meg a szükséges jogosultságod.",
      });
    }

    return true;
  };
};
