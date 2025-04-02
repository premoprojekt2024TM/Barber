import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState, ReactNode } from "react";
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
import { EditStore } from "./components/Worker/Store/Edit/EditStore";
import NoEditRightsPage from "./components/Worker/404/noedit";
import NotInStorePage from "./components/Worker/404/nointhestore";
import AppointmentCalendar from "./components/Worker/Calendar/Calendar";
import {
  isClientAuthenticated,
  isWorkerAuthenticated,
  checkClientAccess,
  checkWorkerAccess,
  checkStoreConnection,
  checkStoreOwner,
} from "./utils/axiosinstance";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface WorkerStoreRouteProps {
  children: ReactNode;
  routePath?: string;
}

const ClientRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticatedResult = isClientAuthenticated();
      setIsAuthenticated(isAuthenticatedResult);

      if (isAuthenticatedResult) {
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
    return <div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return authorized ? <>{children}</> : <Navigate to="/login" />;
};

const WorkerStoreRoute = ({
  children,
  routePath = "",
}: WorkerStoreRouteProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [checksFinished, setChecksFinished] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const workerResult = await checkWorkerAccess();
      if (workerResult.status === 200) {
        setAuthorized(true);

        const storeConnection = await checkStoreConnection();
        setIsConnected(storeConnection.isConnectedToStore);

        if (storeConnection.isConnectedToStore) {
          const ownerCheck = await checkStoreOwner();
          setIsOwner(ownerCheck.isStoreOwner);
        } else {
          setIsOwner(false);
        }
      } else {
        setAuthorized(false);
        setIsOwner(false);
        setIsConnected(false);
      }

      setLoading(false);
      setChecksFinished(true);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div></div>;
  }

  if (routePath === "/search" && authorized) {
    return <>{children}</>;
  }

  if (
    checksFinished &&
    authorized &&
    isConnected &&
    !isOwner &&
    routePath === "/store"
  ) {
    return <Navigate to="/noedit" />;
  }

  // New condition: Redirect store owners from /store to /edit
  if (
    checksFinished &&
    authorized &&
    isConnected &&
    isOwner &&
    routePath === "/store"
  ) {
    return <Navigate to="/edit" />;
  }

  if (checksFinished && authorized && !isConnected && routePath !== "/store") {
    return <Navigate to="/nostore" />;
  }

  if (checksFinished && !authorized) {
    return <Navigate to="/nostore" />;
  }

  return authorized ? <>{children}</> : <Navigate to="/nostore" />;
};

const PublicOnlyRoute = ({ children }: ProtectedRouteProps) => {
  if (isClientAuthenticated()) {
    return <Navigate to="/main" />;
  }
  if (isWorkerAuthenticated()) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const PublicOrClientRoute = ({ children }: ProtectedRouteProps) => {
  if (isWorkerAuthenticated()) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
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
        <Route
          path="/booking/:storeId"
          element={
            <ClientRoute>
              <BookingSystem />
            </ClientRoute>
          }
        />
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
        <Route path="/edit" element={<EditStore />} />
        <Route path="/noedit" element={<NoEditRightsPage />} />
        <Route path="/nostore" element={<NotInStorePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
