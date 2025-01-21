import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Spin, Card, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import api from '../api/axios';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  role: 'client' | 'hairdresser';
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleRegister = async (values: RegisterFormValues) => {
    setLoading(true); // Show loading spinner
    setErrorMessage(''); // Clear previous errors if any

    try {
      // Send the registration data to the API
      const response = await api.post('/register', {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      message.success('User registered successfully!');
    } catch (error: any) {
      // Capture the error message and display it
      const errMsg = error.response?.data?.message || 'Registration failed!';
      setErrorMessage(errMsg); // Set error to state to display on the UI
      message.error(errMsg);
    } finally {
      setLoading(false); // Hide loading spinner when done
    }
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
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>Register</h2>

        {/* Show error message if any */}
        {errorMessage && (
          <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>
            <Tooltip title={errorMessage}>
              <span>{errorMessage}</span>
            </Tooltip>
          </div>
        )}

        {/* Registration Form */}
        <Form
          name="register-form"
          onFinish={handleRegister}
          style={{ marginTop: '20px' }}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              placeholder="Enter your username"
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

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select
              style={{
                borderRadius: '8px',
                borderColor: '#ddd',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#40a9ff')}
              onBlur={(e) => (e.target.style.borderColor = '#ddd')}
            >
              <Select.Option value="client">Client</Select.Option>
              <Select.Option value="hairdresser">Hairdresser</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            {/* Show loading spinner while registering */}
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
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#1890ff')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#40a9ff')}
            >
              {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} /> : 'Register'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
