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
import AppointmentCalendar from "./components/Worker/Calendar/Calendar";
import {
  isClientAuthenticated,
  isWorkerAuthenticated,
  checkClientAccess,
  checkWorkerAccess,
  checkStoreConnection,
  checkStoreOwner, // Import the new function
} from "./utils/axiosinstance";

// Protected route for clients
const ClientRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track synchronous auth

  useEffect(() => {
    const checkAuth = async () => {
      // First, check synchronous authentication
      const isAuthenticatedResult = isClientAuthenticated();
      setIsAuthenticated(isAuthenticatedResult); // Set isAuhenticated immediately

      if (isAuthenticatedResult) {
        // Only if synchronously authenticated, check API endpoint
        const result = await checkClientAccess();
        setAuthorized(result.status === 200);
      } else {
        setAuthorized(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Betöltés...</div>;
  }

  if (!isAuthenticated) {
    // Redirect if not synchronously authenticated
    return <Navigate to="/login" />;
  }

  return authorized ? children : <Navigate to="/login" />;
};

// Enhanced WorkerStoreRoute to check both store connection and owner status
const WorkerStoreRoute = ({ children, routePath = "" }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // State to track owner status
  const [isConnected, setIsConnected] = useState(false);
  const [checksFinished, setChecksFinished] = useState(false); // New state variable

  useEffect(() => {
    const checkAuth = async () => {
      // First check worker authentication
      const workerResult = await checkWorkerAccess();

      // If worker is authenticated, decide access based on `allowWithoutStore`
      if (workerResult.status === 200) {
        setAuthorized(true); // Set authorized to true if worker is authenticated

        const storeConnection = await checkStoreConnection();
        setIsConnected(storeConnection.isConnectedToStore);

        if (storeConnection.isConnectedToStore) {
          const ownerCheck = await checkStoreOwner();
          setIsOwner(ownerCheck.isStoreOwner); // Update isOwner state
        } else {
          setIsOwner(false);
        }
      } else {
        setAuthorized(false);
        setIsOwner(false); // Not authenticated, so definitely not an owner
        setIsConnected(false);
      }

      setLoading(false);
      setChecksFinished(true); //Mark it finished when everything completed
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Betöltés...</div>;
  }

  // Allow access to /search if worker is authenticated, regardless of store connection
  if (routePath === "/search" && authorized) {
    return <>{children}</>; // Render the children if it's the /search route and authorized
  }

  // Redirect to /noedit if connected to a store but NOT an owner and the route is /store
  if (
    checksFinished &&
    authorized &&
    isConnected &&
    !isOwner &&
    routePath === "/store"
  ) {
    return <Navigate to="/noedit" />;
  }

  //Redirect to nostore if not connected to store
  if (checksFinished && authorized && !isConnected && routePath !== "/store") {
    return <Navigate to="/nostore" />;
  }

  //Redirect to nostore if not connected to store or authorized
  if (checksFinished && !authorized) {
    return <Navigate to="/nostore" />;
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
            <WorkerStoreRoute routePath="/dashboard">
              <BarberShopDashboard />
            </WorkerStoreRoute>
          }
        />
        <Route
          path="/sidebar"
          element={
            <WorkerStoreRoute routePath="/sidebar">
              <Sidebar />
            </WorkerStoreRoute>
          }
        />
        {/* Allow access to /store and /search even without a store */}
        <Route
          path="/store"
          element={
            <WorkerStoreRoute routePath="/store">
              <Store />
            </WorkerStoreRoute>
          }
        />
        <Route
          path="/search"
          element={
            <WorkerStoreRoute routePath="/search">
              <FriendsPage />
            </WorkerStoreRoute>
          }
        />
        {/* Routes requiring store connection */}
        <Route
          path="/add"
          element={
            <WorkerStoreRoute routePath="/add">
              <AvailabilityPage />
            </WorkerStoreRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <WorkerStoreRoute>
              <AppointmentCalendar />
            </WorkerStoreRoute>
          }
        />

        {/* Error and special routes */}
        <Route path="/noedit" element={<NoEditRightsPage />} />
        <Route path="/nostore" element={<NotInStorePage />} />
        {/* Catch-all redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
