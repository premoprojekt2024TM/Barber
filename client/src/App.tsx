import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import HairdresserPage from './pages/HairdresserPage';
import ClientPage from './pages/ClientPage';
import Finder from './pages/Finder';
import Store from './pages/Store';

const AuthPage = () => {
  return (
    <div>
      <Routes>
        <Route index element={<SignIn />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="dash" element={<Dashboard />} />
        <Route path="hair" element={<HairdresserPage />} />
        <Route path="client" element={<ClientPage />} />
        <Route path="finder" element={<Finder />} />
        <Route path="store" element={<Store />} />
        <Route path="*" element={<Navigate to="/auth/sign-in" />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/auth/sign-in" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
