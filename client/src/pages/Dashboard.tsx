import React, { useEffect, useState } from 'react';
import { message, Card, Avatar, Button, Typography, Modal, List, Spin, Col, Row } from 'antd';
import { UserOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Add navigate for routing to chatrooms
import api from '../api/axios';

const { Title, Paragraph } = Typography;

interface ProfileData {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  birthday: string;
}

interface ChatroomData {
  id: string;
  name: string;
  user1: ProfileData;
  user2: ProfileData;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [friends, setFriends] = useState<ProfileData[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ProfileData[]>([]);
  const [chatrooms, setChatrooms] = useState<ChatroomData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingFriends, setLoadingFriends] = useState<boolean>(false);
  const [loadingPending, setLoadingPending] = useState<boolean>(false);
  const [loadingChatrooms, setLoadingChatrooms] = useState<boolean>(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState<boolean>(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState<boolean>(false);
  const [isChatroomsModalOpen, setIsChatroomsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return message.error('Not logged in');
      try {
        const { data } = await api.get('/profile', { headers: { Authorization: `Bearer ${token}` } });
        setUser(data.profileData);
      } catch (e) {
        message.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const fetchFriends = async () => {
    setLoadingFriends(true);
    const token = localStorage.getItem('token');
    if (!token) return message.error('Not logged in');
    try {
      const { data } = await api.get('/getFriends', { headers: { Authorization: `Bearer ${token}` } });
      setFriends(data.friends);
    } catch (e) {
      message.error('Failed to fetch friends');
    } finally {
      setLoadingFriends(false);
    }
  };

  const fetchPendingRequests = async () => {
    setLoadingPending(true);
    const token = localStorage.getItem('token');
    if (!token) return message.error('Not logged in');
    try {
      const { data } = await api.get('/checkFriendshipStatus', { headers: { Authorization: `Bearer ${token}` } });
      setPendingRequests(data.pendingFriends);
    } catch (e) {
      message.error('Failed to fetch pending requests');
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchChatrooms = async () => {
    setLoadingChatrooms(true);
    const token = localStorage.getItem('token');
    if (!token) return message.error('Not logged in');
    try {
      const { data } = await api.get('/chatrooms', { headers: { Authorization: `Bearer ${token}` } });
      setChatrooms(data.chatrooms);
    } catch (e) {
      message.error('Failed to fetch chatrooms');
    } finally {
      setLoadingChatrooms(false);
    }
  };

  const handleCreateChatroom = async (friendId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return message.error('Not logged in');
    try {
      const { data } = await api.post(
        '/createchatroom',
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Chat room created');
      fetchChatrooms(); // Fetch the updated chatrooms
      navigate(`/chat/${data.chatroomId}`); // Navigate to the new chatroom
    } catch (e) {
      message.error('Failed to create chat room');
    }
  };

  const handleDeleteFriend = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return message.error('Not logged in');
    try {
      await api.delete(`/deleteFriend/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      message.success('Friend deleted');
      fetchFriends();
    } catch (e) {
      message.error('Failed to delete friend');
    }
  };

  const showDeleteConfirm = () => {
    Modal.confirm({ title: 'Delete Account?', content: 'This action is irreversible.', onOk: handleDeleteAccount });
  };

  const handleChatroomClick = (chatroomId: string) => {
    navigate(`/chat/${chatroomId}`); // Redirect to the selected chatroom
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {loading ? <Spin size="large" /> : (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card cover={<Avatar src={user?.profilePic} size={100} icon={<UserOutlined />} />}>
              <Title level={3}>{user?.username}</Title>
              <Paragraph>{user?.firstName} {user?.lastName}</Paragraph>
              <Paragraph>Email: {user?.email}</Paragraph>
              <Paragraph>Birthday: {user?.birthday || 'Not provided'}</Paragraph>
              <Button type="primary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
              <Button onClick={() => { fetchFriends(); setIsFriendsModalOpen(true); }}>View Friends</Button>
              <Button onClick={() => { fetchPendingRequests(); setIsPendingModalOpen(true); }}>View Pending Requests</Button>
              <Button onClick={() => { fetchChatrooms(); setIsChatroomsModalOpen(true); }}>View Chatrooms</Button>
              <Button danger onClick={showDeleteConfirm}>Delete Account</Button>
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Card title="Account Overview">
              <Button type="link">Account Settings</Button>
              <Button type="link">Notifications</Button>
              <Button type="link">Log Out</Button>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal for Pending Friend Requests */}
      <Modal title="Pending Friend Requests" open={isPendingModalOpen} onCancel={() => setIsPendingModalOpen(false)} footer={null}>
        {loadingPending ? <Spin size="large" /> : (
          <List
            itemLayout="horizontal"
            dataSource={pendingRequests}
            renderItem={(request) => (
              <List.Item
                actions={[
                  <Button onClick={() => handleAcceptRequest(request.id)} icon={<CheckOutlined />} type="link">Accept</Button>,
                  <Button onClick={() => handleRejectRequest(request.id)} icon={<CloseOutlined />} type="link">Reject</Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={request.profilePic} />}
                  title={request.username}
                  description={`${request.firstName} ${request.lastName}`}
                />
              </List.Item>
            )}
          />
        )}
      </Modal>

      {/* Friends Modal */}
      <Modal title="Your Friends" open={isFriendsModalOpen} onCancel={() => setIsFriendsModalOpen(false)} footer={null}>
        {loadingFriends ? <Spin size="large" /> : (
          <List
            itemLayout="horizontal"
            dataSource={friends}
            renderItem={(friend) => (
              <List.Item
                actions={[
                  <MessageOutlined onClick={() => handleCreateChatroom(friend.id)} />,
                  <DeleteOutlined onClick={() => handleDeleteFriend(friend.id)} />
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={friend.profilePic} />}
                  title={friend.username}
                  description={`${friend.firstName} ${friend.lastName}`}
                />
              </List.Item>
            )}
          />
        )}
      </Modal>

      {/* Chatrooms Modal */}
      <Modal title="Your Chatrooms" open={isChatroomsModalOpen} onCancel={() => setIsChatroomsModalOpen(false)} footer={null}>
        {loadingChatrooms ? <Spin size="large" /> : (
          <List
            itemLayout="horizontal"
            dataSource={chatrooms}
            renderItem={(chatroom) => (
              <List.Item
                actions={[
                  <Button type="link" onClick={() => handleChatroomClick(chatroom.id)}>Enter Chatroom</Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={chatroom.user1.profilePic} />}
                  title={`${chatroom.user1.username} & ${chatroom.user2.username}`}
                  description={`Chatroom between ${chatroom.user1.firstName} ${chatroom.user1.lastName} and ${chatroom.user2.firstName} ${chatroom.user2.lastName}`}
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
