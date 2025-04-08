import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtToken {
  userId?: string;
  email?: string;
  role?: string;
  username?: string;
  profilePic?: string;
  [key: string]: any;
}

interface TokenInfo {
  userId: string | null;
  email: string | null;
  role: string | null;
  username: string | null;
  profilePic: string | null;
}

interface ApiResponse {
  status: number;
  data: any;
}

interface StoreOwnerResponse {
  isStoreOwner: boolean;
  storeId: string | null;
  storeName: string | null;
}

interface StoreConnectionResponse {
  isConnectedToStore: boolean;
  store: any | null;
  role: string | null;
}

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getJWTToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      Cookies.remove("jwt_token");
    }
    return Promise.reject(error);
  },
);

export const getJWTToken = (): string | undefined => Cookies.get("jwt_token");

export const getInfoFromToken = (): TokenInfo | null => {
  const token = getJWTToken();
  if (token) {
    try {
      const decoded = jwtDecode<JwtToken>(token);
      return {
        userId: decoded.userId || null,
        email: decoded.email || null,
        role: decoded.role || null,
        username: decoded.username || null,
        profilePic: decoded.profilePic || null,
      };
    } catch {
      return null;
    }
  }
  return null;
};

export const isClientAuthenticated = (): boolean => {
  const token = getJWTToken();
  if (token) {
    try {
      const decoded = jwtDecode<JwtToken>(token);
      return decoded.role === "client";
    } catch {
      return false;
    }
  }
  return false;
};

export const isWorkerAuthenticated = (): boolean => {
  const token = getJWTToken();
  if (token) {
    try {
      const decoded = jwtDecode<JwtToken>(token);
      return decoded.role === "worker";
    } catch {
      return false;
    }
  }
  return false;
};

export const checkClientAccess = async (): Promise<ApiResponse> => {
  try {
    if (!isClientAuthenticated()) {
      return { status: 403, data: { message: "Not authenticated as client" } };
    }
    const response = await axiosInstance.get("/api/v1/client");
    return { status: 200, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      status: axiosError.response?.status || 500,
      data: axiosError.response?.data || { message: "Server error" },
    };
  }
};

export const checkStoreOwner = async (): Promise<StoreOwnerResponse> => {
  try {
    const response = await axiosInstance.get("/api/v1/isStoreOwner");
    return {
      isStoreOwner: response.data.isStoreOwner,
      storeId: response.data.storeId || null,
      storeName: response.data.storeName || null,
    };
  } catch (error) {
    console.error("Error checking store owner:", error);
    return {
      isStoreOwner: false,
      storeId: null,
      storeName: null,
    };
  }
};

export const checkStoreConnection =
  async (): Promise<StoreConnectionResponse> => {
    try {
      const response = await axiosInstance.get("/api/v1/is-connected-to-store");
      return {
        isConnectedToStore: response.data.isConnectedToStore,
        store: response.data.store,
        role: response.data.role,
      };
    } catch (error) {
      return {
        isConnectedToStore: false,
        store: null,
        role: null,
      };
    }
  };

export const checkWorkerAccess = async (): Promise<ApiResponse> => {
  try {
    if (!isWorkerAuthenticated()) {
      return { status: 403, data: { message: "Not authenticated as worker" } };
    }
    const response = await axiosInstance.get("/api/v1/hair");
    return { status: 200, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      status: axiosError.response?.status || 500,
      data: axiosError.response?.data || { message: "Server error" },
    };
  }
};
