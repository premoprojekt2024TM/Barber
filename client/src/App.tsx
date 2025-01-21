import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/Dashboard'; 
import ChatPage from './pages/chatPage';
import UserProfile from './pages/userPage';
import StorePage from './pages/Store';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat/:chatroomId" element={<ChatPage />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/stores" element={<StorePage />} />
      </Routes>
    </Router>
  );
};

export default App;
