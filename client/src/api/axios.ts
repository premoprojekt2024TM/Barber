import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',  // Your backend URL
  headers: {
    'Content-Type': 'application/json',  // Default content type
  },
});

// Interceptor for adding Authorization header if the user is authenticated
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Or get from sessionStorage or cookies
    if (token) {
      // Add token to headers if it exists
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
