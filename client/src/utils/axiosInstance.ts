import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getJWTToken = () => {
  return Cookies.get("jwt_token");
};

export const getInfoFromToken = () => {
  const token = getJWTToken();
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return {
        userId: decoded.userId || null,
        email: decoded.email || null,
        role: decoded.role || null,
        username: decoded.username || null,
        profilePic: decoded.profilePic || null,
      };
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  }
  return null;
};

export const isClientAuthenticated = () => {
  const token = getJWTToken();
  return token && token !== "";
};

export const isWorkerAuthenticated = () => {
  const token = getJWTToken();
  return token && token !== "";
};
