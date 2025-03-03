import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import FinderWithSidebar from './components/StoreUpload/Store';
import Finder from './components/Finder/Finder';
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import Addd from './components/Availability/Add';
import MainPage from './components/MainPage/MainPage'
function App() {
  return (
    <div>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/store" element={<FinderWithSidebar />} />
        <Route path="/finder" element={<Finder />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/add" element={<Addd />} />
        <Route path="/main" element={<MainPage />} />
        

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </div>
  );
}

export default App;
