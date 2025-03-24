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

// Add Authorization Header if Token Exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getJWTToken();
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error), // No console.log here
);

// Handle Unauthorized Responses (401/403)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      Cookies.remove("jwt_token");
    }
    return Promise.reject(error); // No console.log here
  },
);

export const getJWTToken = () => Cookies.get("jwt_token");

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
    } catch {
      return null; // No error logging
    }
  }
  return null;
};

export const isClientAuthenticated = () => {
  const token = getJWTToken();
  if (token) {
    try {
      return jwtDecode(token).role === "client";
    } catch {
      return false; // No error logging
    }
  }
  return false;
};

export const isWorkerAuthenticated = () => {
  const token = getJWTToken();
  if (token) {
    try {
      return jwtDecode(token).role === "worker";
    } catch {
      return false; // No error logging
    }
  }
  return false;
};

export const checkClientAccess = async () => {
  try {
    if (!isClientAuthenticated()) {
      return { status: 403, data: { message: "Not authenticated as client" } };
    }
    const response = await axiosInstance.get("/api/v1/client");
    return { status: 200, data: response.data };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: "Server error" },
    };
  }
};

export const checkWorkerAccess = async () => {
  try {
    if (!isWorkerAuthenticated()) {
      return { status: 403, data: { message: "Not authenticated as worker" } };
    }
    const response = await axiosInstance.get("/api/v1/hair");
    return { status: 200, data: response.data };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: "Server error" },
    };
  }
};
