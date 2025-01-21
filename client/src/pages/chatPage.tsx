import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Spin, Card, notification, Typography, Row, Col } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const { Text } = Typography;

interface WebSocketMessage {
  user: string;
  message: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]); // Initialize as an empty array
  const [newMessage, setNewMessage] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<string>('Connecting...');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { chatroomId } = useParams(); // Get chatroomId from the URL

  const wsRef = useRef<WebSocket | null>(null);

  // Step 1: Get the user info from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.username, role: payload.role });
      } catch (error) {
        console.error('Invalid token', error);
        setError('Invalid token');
      }
    } else {
      setError('No JWT token found in localStorage');
    }
  }, []);

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>{error}</h2>
      </div>
    );
  }

  // Step 2: Fetch chat history
  useEffect(() => {
    if (!chatroomId) return;

    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/chat/${chatroomId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Check if messages is an array
          if (Array.isArray(data.messages)) {
            // Parse messages
            const parsedMessages = data.messages.map((msg) => {
              const parsedContent = JSON.parse(msg.content); // Parse the JSON string
              return {
                user: parsedContent.user,
                message: parsedContent.message,
                timestamp: parsedContent.timestamp,
              };
            });
            setMessages(parsedMessages);
          } else {
            console.error('Messages is not an array:', data.messages);
          }
        } else {
          console.error('Failed to fetch chat history');
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [chatroomId]);

  // Step 3: WebSocket initialization and handling
  useEffect(() => {
    if (!user || !chatroomId) return;

    const socketUrl = `ws://localhost:8080/chat/${chatroomId}?token=${localStorage.getItem('token')}`;
    const socket = new WebSocket(socketUrl);
    wsRef.current = socket;
    setWs(socket);

    socket.onopen = () => {
      setStatus('Connected');
      setIsConnected(true);
    };

    socket.onclose = () => {
      setStatus('Disconnected');
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setStatus('Error occurred');
      setIsConnected(false);
    };

    socket.onmessage = (event) => {
      try {
        const messageData: WebSocketMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, messageData]);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [user, chatroomId]);

  // Step 4: Sending message
  const sendMessage = () => {
    if (ws && isConnected && newMessage.trim()) {
      if (ws.readyState === WebSocket.OPEN) {
        const messagePayload: WebSocketMessage = {
          user: user?.username || 'Unknown',
          message: newMessage,
          timestamp: new Date().toISOString(),
        };
        
        setMessages((prevMessages) => [...prevMessages, messagePayload]);
        ws.send(JSON.stringify(messagePayload));
        setNewMessage('');
      } else {
        notification.warning({
          message: 'WebSocket is not open.',
          description: 'Unable to send message at the moment.',
        });
      }
    } else {
      notification.warning({
        message: 'Message is empty or WebSocket is not connected.',
        description: 'Please type a message and make sure the connection is active.',
      });
    }
  };

  return (
    <Row justify="center" style={{ padding: '30px' }}>
      <Col span={24} xs={22} sm={20} md={18} lg={16}>
        <Card bordered={false}>
          <div style={{ marginBottom: '20px' }}>
            <Text strong style={{ fontSize: '20px' }}>Chat Room</Text>
            <div>Status: <strong>{status}</strong></div>
            {status === 'Connecting...' && <Spin size="small" />}
          </div>

          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '15px',
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: '15px',
            }}
          >
            {messages.length === 0 ? (
              <Text type="secondary">No messages yet...</Text>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: '10px' }}>
                  <strong>{msg.user}</strong>: <span>{msg.message}</span>
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Input.TextArea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              disabled={!newMessage.trim() || !isConnected}
            >
              Send
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ChatPage;
