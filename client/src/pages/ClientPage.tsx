/* eslint-disable */
import { useState, useEffect } from 'react';
import axiosInstance1 from '../axios/auth'; 
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ClientPage = () => {
  const [message, setMessage] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('auth_token');
    
 
    if (!token) {
      setMessage('No token found. Please log in.');
      setLoading(false);
      return;
    }

   
    axiosInstance1.get('/api/client', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.data.isValid) {

          if (response.data.role !== 'client') {
            setMessage('You do not have permission to access this page.');
            setTimeout(() => navigate('/auth/sign-in'), 3000); 
          } else {
            setMessage('Welcome to the Client Page!');
          }
        } else {
          setMessage('Invalid token. Please log in again.');
          setTimeout(() => window.location.href = '/auth/sign-in', 3000);  
        }
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, [navigate]);

  const handleError = (error: any) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          setMessage('Session expired. Please log in again.');
          setTimeout(() => window.location.href = '/auth/sign-in', 3000); 
          break;
        case 403:
          setMessage('Invalid or expired token.');
          break;
        default:
          setMessage('An error occurred. Please try again.');
          break;
      }
    } else {
      setMessage('Network error. Please check your connection.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Client Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>{message}</p> 
      )}
    </div>
  );
};

export default ClientPage;
