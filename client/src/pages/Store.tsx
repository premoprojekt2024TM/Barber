import React, { useState } from 'react';
import { Button, Form, Input, message, Spin, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface Store {
  name: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
}

const StorePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Using `useNavigate` hook for navigation

  // Handle store creation
  const handleCreateStore = async (values: Store) => {
    setLoading(true); // Show loading spinner while the POST request is being made
    try {
      const response = await axios.post('http://localhost:8080/api/v1/createStore', values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you're using token-based auth
        },
      });

      message.success('Store created successfully!');
      form.resetFields(); // Reset the form after successful submission
      // Optionally navigate to the store's page (you can replace `/store/:id` with your actual route)
      navigate(`/store/${response.data.store.id}`);
    } catch (err) {
      message.error('Failed to create store');
    } finally {
      setLoading(false); // Hide loading spinner after request completion
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Create Store</Title>

      {/* Store creation form */}
      <Form
        form={form}
        onFinish={handleCreateStore}
        layout="vertical"
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        <Form.Item
          label="Store Name"
          name="name"
          rules={[{ required: true, message: 'Please input the store name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the store description!' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please input the store address!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: 'Please input the city!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Postal Code"
          name="postalCode"
          rules={[{ required: true, message: 'Please input the postal code!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please input the phone number!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input the email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading ? 'Creating...' : 'Create Store'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StorePage;
