import React from 'react';
import { Layout, Menu, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  return (
    <Sider width={240} style={{ background: '#fff', height: '100vh', padding: '16px 8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar size={64} icon={<UserOutlined />} style={{ marginBottom: '16px' }} />
        <h3 style={{ marginBottom: '24px' }}>Hello, User!</h3>

        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ width: '100%', backgroundColor: 'transparent' }}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />} onClick={() => navigate('/profile')}>
            Profile
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />} onClick={() => navigate('/settings')}>
            Settings
          </Menu.Item>
        </Menu>

        <Button
          type="primary"
          icon={<LogoutOutlined />}
          style={{ marginTop: '20px' }}
          block
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;
