import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Spin, Row, Col, Button, message } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const { Title, Text } = Typography;

interface User {
  id: number;
  username: string;
  profilePic: string;
}

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // `id` from the URL
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to handle sending friend request
  const sendFriendRequest = async () => {
    try {
      // Get the JWT token (assuming it's stored in localStorage)
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('You need to be logged in to send a friend request.');
        return;
      }

      // Make a POST request to the server to send a friend request
      const response = await axios.post(
        'http://localhost:8080/api/v1/sendFriendRequest',
        { userId: id },  // Pass the target user ID (the one you are sending the request to)
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Send JWT token in Authorization header
          },
        }
      );

      // Handle success response
      message.success('Friend request sent successfully!');
    } catch (err) {
      // Handle error
      message.error('Failed to send friend request');
    }
  };

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8080/api/v1/user/${id}`);
          setUserData(response.data.user);
        } catch (err) {
          setError('Failed to fetch user data');
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [id]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Row justify="center" style={{ marginTop: '50px' }}>
      <Col span={12}>
        <Card
          hoverable
          cover={<Avatar src={userData?.profilePic} size={200} shape="circle" />}
        >
          <Title level={2}>{userData?.username}</Title>
          <Text>Profile ID: {userData?.id}</Text>
          <div style={{ marginTop: '20px' }}>
            <Button type="primary" onClick={sendFriendRequest}>
              Send Friend Request
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default UserProfile;
