import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Bubble from "./components/Client/BubbleView/bubblepage";
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
  checkStoreConnection,
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

// Protected route for workers, allowing access to certain pages even without a store connection
const WorkerStoreRoute = ({ children, allowWithoutStore = false }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // First check worker authentication
      const workerResult = await checkWorkerAccess();

      // If worker is authenticated, decide access based on `allowWithoutStore`
      if (workerResult.status === 200) {
        if (allowWithoutStore) {
          setAuthorized(true); // Allow access even without a store
        } else {
          const storeConnection = await checkStoreConnection();
          setAuthorized(storeConnection.isConnectedToStore);
        }
      } else {
        setAuthorized(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authorized ? children : <Navigate to="/nostore" />;
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
  if (isWorkerAuthenticated()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
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

        {/* Public or Client routes */}
        <Route
          path="/"
          element={
            <PublicOrClientRoute>
              <MainPage />
            </PublicOrClientRoute>
          }
        />
        <Route
          path="/map"
          element={
            <PublicOrClientRoute>
              <Map />
            </PublicOrClientRoute>
          }
        />
        <Route
          path="/bubble"
          element={
            <PublicOrClientRoute>
              <Bubble />
            </PublicOrClientRoute>
          }
        />

        {/* Client-specific routes */}
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
            <WorkerStoreRoute>
              <BarberShopDashboard />
            </WorkerStoreRoute>
          }
        />
        <Route
          path="/sidebar"
          element={
            <WorkerStoreRoute>
              <Sidebar />
            </WorkerStoreRoute>
          }
        />

        {/* Allow access to /store and /search even without a store */}
        <Route
          path="/store"
          element={
            <WorkerStoreRoute allowWithoutStore={true}>
              <Store />
            </WorkerStoreRoute>
          }
        />
        <Route
          path="/search"
          element={
            <WorkerStoreRoute allowWithoutStore={true}>
              <FriendsPage />
            </WorkerStoreRoute>
          }
        />

        {/* Routes requiring store connection */}
        <Route
          path="/add"
          element={
            <WorkerStoreRoute>
              <AvailabilityPage />
            </WorkerStoreRoute>
          }
        />

        {/* Error and special routes */}
        <Route
          path="/noedit"
          element={
            <WorkerStoreRoute>
              <NoEditRightsPage />
            </WorkerStoreRoute>
          }
        />
        <Route path="/nostore" element={<NotInStorePage />} />

        {/* Catch-all redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
