import { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  Search,
  CirclePlus,
  X,
  ChevronRight,
  ChevronLeft,
  LogOut,
  ChevronDown,
  Store,
} from "lucide-react";
import {
  getInfoFromToken,
  isWorkerAuthenticated,
} from "../../utils/axiosinstance";

type UserInfo = {
  username: string;
  email: string;
  profilePic?: string;
};

type MenuItem = {
  name: string;
  icon: any;
  path: string;
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isWorker, setIsWorker] = useState(false);

  // Define menuItems outside the useEffect but inside the component
  const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Add", icon: CirclePlus, path: "/add" },
    { name: "Appointments", icon: Calendar, path: "/appointments" },
    { name: "Search", icon: Search, path: "/search" },
    { name: "Store", icon: Store, path: "/store" },
  ];

  useEffect(() => {
    const info = getInfoFromToken();
    setUserInfo(info);

    const workerAuth = isWorkerAuthenticated();
    setIsWorker(workerAuth);

    // Set active item based on current path
    const path = window.location.pathname;
    const currentItem = menuItems.find((item) => path.includes(item.path));
    if (currentItem) {
      setActiveItem(currentItem.name);
    }

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  if (!isWorker) {
    return null;
  }

  const getUserInitials = () => {
    if (!userInfo || !userInfo.username) return "?";
    const nameParts = userInfo.username.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return userInfo.username.substring(0, 2).toUpperCase();
  };

  const handleNavigation = (path: string, name: string) => {
    setActiveItem(name);
    window.location.href = path;
  };

  const handleLogout = () => {
    document.cookie =
      "jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  if (isMobile) {
    return (
      <>
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-10">
          <div className="flex justify-around items-center h-16">
            {menuItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path, item.name)}
                  className={`flex flex-col items-center justify-center p-2 ${
                    activeItem === item.name ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1">{item.name}</span>
                </button>
              );
            })}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center justify-center p-2 text-gray-500"
            >
              {userInfo?.profilePic ? (
                <img
                  src={userInfo.profilePic}
                  alt="Profile"
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-xs">
                  {getUserInitials()}
                </div>
              )}
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-300 mx-auto mb-4 rounded-full"></div>

              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                {userInfo?.profilePic ? (
                  <img
                    src={userInfo.profilePic}
                    alt="Profile"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                    {getUserInitials()}
                  </div>
                )}
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-900">
                    {userInfo?.username || "Guest User"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {userInfo?.email || "No email"}
                  </p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="ml-auto"
                >
                  <X size={20} />
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full p-4 text-red-600"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } h-screen sticky top-0 bg-white shadow-lg transition-all duration-300 flex flex-col z-10`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 bg-black text-white rounded-full p-1 shadow-md z-10"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <svg
          width={isCollapsed ? "24" : "32"}
          height={isCollapsed ? "24" : "32"}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 2C10.5 2 9.5 3 8.5 5C7.5 7 7 8 5 8.5C3 9 2 10 2 12C2 14 3 15 5 15.5C7 16 7.5 17 8.5 19C9.5 21 10.5 22 12.5 22C14.5 22 15.5 21 16.5 19C17.5 17 18 16 20 15.5C22 15 23 14 23 12C23 10 22 9 20 8.5C18 8 17.5 7 16.5 5C15.5 3 14.5 2 12.5 2Z"
            fill="#E02F2F"
          />
        </svg>
        {!isCollapsed && (
          <span className="text-xl font-semibold text-gray-900">
            Barber & Blade
          </span>
        )}
      </div>

      <nav className="flex-grow mt-6 px-2 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <button
                  onClick={() => handleNavigation(item.path, item.name)}
                  className={`flex items-center w-full rounded-md p-2 transition-colors duration-200 ${
                    activeItem === item.name
                      ? "bg-gray-100 text-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className={`${isCollapsed ? "mx-auto" : ""}`}>
                    <Icon size={20} />
                  </div>
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-100 mt-auto">
        {!isCollapsed ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 w-full p-4 hover:bg-gray-50 transition-colors"
            >
              {userInfo?.profilePic ? (
                <img
                  src={userInfo.profilePic}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                  {getUserInitials()}
                </div>
              )}
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-900">
                  {userInfo?.username || "Guest User"}
                </h3>
                <p className="text-xs text-gray-500">
                  {userInfo?.email || "No email"}
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`ml-auto text-gray-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
              />
            </button>
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg rounded-t-md overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full p-3 text-red-600 hover:bg-gray-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center p-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 text-red-600 hover:bg-gray-50 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
