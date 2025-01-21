import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Tooltip, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    setErrorMessage(''); 

    try {
      const response = await api.post('/login', {
        email: values.email,
        password: values.password,
      });

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      message.success('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Login failed!';
      setErrorMessage(errMsg);
      message.error(errMsg);
    }

    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card
        hoverable
        style={{
          width: '100%',
          maxWidth: 400,
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>Login</h2>
        
        {errorMessage && (
          <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>
            <Tooltip title={errorMessage}>
              <span>{errorMessage}</span>
            </Tooltip>
          </div>
        )}

        {/* Login Form */}
        <Form name="login-form" onFinish={handleLogin} style={{ marginTop: '20px' }} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input
              placeholder="Enter your email"
              style={{
                borderRadius: '8px',
                borderColor: '#ddd',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#40a9ff')}
              onBlur={(e) => (e.target.style.borderColor = '#ddd')}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder="Enter your password"
              style={{
                borderRadius: '8px',
                borderColor: '#ddd',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#40a9ff')}
              onBlur={(e) => (e.target.style.borderColor = '#ddd')}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                borderRadius: '8px',
                backgroundColor: '#40a9ff',
                borderColor: '#40a9ff',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease',
              }}
            >
              {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} /> : 'Login'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
