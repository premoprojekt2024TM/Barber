import axios from 'axios';
import Cookies from 'js-cookie'; 

const axiosInstance1 = axios.create({
  baseURL: 'http://localhost:8080',  
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  
});

axiosInstance1.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token'); 
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance1;
