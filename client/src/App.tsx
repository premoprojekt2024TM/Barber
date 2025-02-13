import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './layouts/Dashboard';
import VerificationPage from './layouts/Verification';
import FinderWithSidebar from './layouts/Store';
import Finder from './layouts/Finder';
import SignUp from './layouts/SignUp';
import SignInSide from './layouts/SignInSide';
import Addd from './layouts/Add';
import MarketingPage from './pages/MarketingPage'

function App() {
  return (
    <div>
      <Routes>
        {/* Define your routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/store" element={<FinderWithSidebar />} />
        <Route path="/finder" element={<Finder />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignInSide />} />
        <Route path="/add" element={<Addd />} />
        <Route path="/main" element={<MarketingPage />} />

        {/* Redirect from the root (/) to /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
