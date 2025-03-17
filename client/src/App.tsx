import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import StoreUpload from "./components/StoreUpload/Store";
import Finder from "./components/Finder/Finder";
import SignUp from "./components/Auth/SignUp";
import SignIn from "./components/Auth/SignIn";
import Addd from "./components/Availability/Add";
import MainPage from "./components/MainPage/MainPage";
import SearchPage from "./components/SearchFriends/SearchPage";
import BookingSystem from "./components/Booking/Booking";
import {
  isClientAuthenticated,
  isWorkerAuthenticated,
} from "./utils/axiosInstance";

const WorkerRoute = ({ children }) => {
  const isWorker = isWorkerAuthenticated();

  if (!isWorker) {
    return (
      <Navigate to="/login" state={{ message: "Worker access required" }} />
    );
  }

  return children;
};

const ClientRoute = ({ children }) => {
  const isClient = isClientAuthenticated();

  if (!isClient) {
    // Redirect to login with a message
    return (
      <Navigate to="/login" state={{ message: "Client access required" }} />
    );
  }

  return children;
};

// Protected route for any authenticated user
const AuthRoute = ({ children }) => {
  const isAuthenticated = isClientAuthenticated() || isWorkerAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login with a message
    return (
      <Navigate to="/login" state={{ message: "Please login to continue" }} />
    );
  }

  return children;
};

function App() {
  return (
    <div>
      <Routes>
        {/* Worker-only routes */}
        <Route
          path="/dashboard"
          element={
            <WorkerRoute>
              <Dashboard />
            </WorkerRoute>
          }
        />

        {/* Client-only routes */}
        <Route
          path="/search"
          element={
            <WorkerRoute>
              <SearchPage />
            </WorkerRoute>
          }
        />

        {/* Routes for any authenticated user (worker or client) */}
        <Route
          path="/store"
          element={
            <AuthRoute>
              <StoreUpload />
            </AuthRoute>
          }
        />

        <Route path="/booking" element={<BookingSystem />} />

        <Route path="/finder" element={<Finder />} />

        <Route
          path="/add"
          element={
            <AuthRoute>
              <Addd />
            </AuthRoute>
          }
        />

        {/* Public routes */}
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/" element={<Navigate to="/main" />} />
        <Route path="*" element={<Navigate to="/main" />} />
      </Routes>
    </div>
  );
}

export default App;
