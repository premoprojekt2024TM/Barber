import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Register from "./components/shared/Auth/register";
import BookingSystem from "./components/Client/Booking/Booking";
import MainPage from "./components/Client/Main/MainPage";
import Map from "./components/Client/Map/Map";
import AvailabilityPage from "./components/Worker/Availability/avpage";
import BarberShopDashboard from "./components/Worker/Dashboard/Dashboard";
import FriendsPage from "./components/Worker/Friend/friendpage";
import Sidebar from "./components/Worker/sidebar";
import { Store } from "./components/Worker/Store/Store";
import Login from "./components/shared/Auth/Login";
import NoEditRightsPage from "./components/Worker/404/noedit";
import NotInStorePage from "./components/Worker/404/nointhestore";
import {
  isClientAuthenticated,
  isWorkerAuthenticated,
  checkClientAccess,
  checkWorkerAccess,
} from "./utils/axiosinstance";
// Protected route for clients
const ClientRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await checkClientAccess();
      setAuthorized(result.status === 200);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authorized ? children : <Navigate to="/login" />;
};

// Protected route for workers
const WorkerRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await checkWorkerAccess();
      setAuthorized(result.status === 200);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authorized ? children : <Navigate to="/login" />;
};

// Route accessible to authenticated users of any role
const AuthenticatedRoute = ({ children }) => {
  const isAuthenticated = isClientAuthenticated() || isWorkerAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Route that redirects authenticated users to their appropriate dashboard
const PublicOnlyRoute = ({ children }) => {
  if (isClientAuthenticated()) {
    return <Navigate to="/main" />;
  }
  if (isWorkerAuthenticated()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const PublicOrClientRoute = ({ children }) => {
  // If user is a worker, redirect them to worker dashboard
  if (isWorkerAuthenticated()) {
    return <Navigate to="/dashboard" />;
  }

  // Allow access if user is not authenticated (public) or is a client
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes - accessible to everyone */}

        {/* Public only routes - redirect authenticated users */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/"
          element={
            <PublicOrClientRoute>
              <MainPage />
            </PublicOrClientRoute>
          }
        />

        {/* Client routes */}
        <Route
          path="/"
          element={
            <ClientRoute>
              <MainPage />
            </ClientRoute>
          }
        />
        <Route
          path="/Map"
          element={
            <PublicOrClientRoute>
              <Map />
            </PublicOrClientRoute>
          }
        />
        <Route
          path="/booking/:storeId"
          element={
            <ClientRoute>
              <BookingSystem />
            </ClientRoute>
          }
        />

        {/* Worker routes */}
        <Route
          path="/dashboard"
          element={
            <WorkerRoute>
              <BarberShopDashboard />
            </WorkerRoute>
          }
        />
        <Route
          path="/sidebar"
          element={
            <WorkerRoute>
              <Sidebar />
            </WorkerRoute>
          }
        />
        <Route
          path="/store"
          element={
            <WorkerRoute>
              <Store />
            </WorkerRoute>
          }
        />
        <Route
          path="/add"
          element={
            <WorkerRoute>
              <AvailabilityPage />
            </WorkerRoute>
          }
        />
        <Route
          path="/search"
          element={
            <WorkerRoute>
              <FriendsPage />
            </WorkerRoute>
          }
        />

        <Route
          path="/noedit"
          element={
            <WorkerRoute>
              <NoEditRightsPage />
            </WorkerRoute>
          }
        />

        <Route
          path="/nostore"
          element={
            <WorkerRoute>
              <NotInStorePage />
            </WorkerRoute>
          }
        />

        {/* Route for any authenticated user */}
        <Route
          path="/search"
          element={
            <WorkerRoute>
              <FriendsPage />
            </WorkerRoute>
          }
        />

        {/* Catch-all redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
