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

// Add request interceptor to include JWT token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getJWTToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Check for 401/403 responses and handle them
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Handle unauthorized access - could redirect to login or clear token
      Cookies.remove("jwt_token");
    }
    return Promise.reject(error);
  },
);

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
  if (token && token !== "") {
    try {
      const decoded = jwtDecode(token);
      return decoded.role === "client";
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return false;
    }
  }
  return false;
};

export const isWorkerAuthenticated = () => {
  const token = getJWTToken();
  if (token && token !== "") {
    try {
      const decoded = jwtDecode(token);
      return decoded.role === "worker";
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return false;
    }
  }
  return false;
};

// Check authentication and role, then make specific API calls
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
