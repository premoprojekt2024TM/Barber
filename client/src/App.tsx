import { Routes, Route } from 'react-router-dom';
import Dashboard from './layouts/Dashboard';
import VerificationPage from './layouts/Verification';
import FinderWithSidebar from './layouts/Store';
import Finder from './layouts/Finder';
import SignUp from './layouts/SignUp';
import SignInSide from './layouts/SignInSide';
import AddPage from './pages/add';
import Addd from './layouts/Add';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/store" element={<FinderWithSidebar />} />
        <Route path="/finder" element={<Finder />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignInSide />} />
        <Route path="/add" element={<Addd />} />
      </Routes>
    </div>
  );
}

export default App;
