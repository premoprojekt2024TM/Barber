import { useState, useEffect, useRef, useCallback } from "react";
import {
  Home,
  Calendar,
  Search,
  CirclePlus,
  X,
  LogOut,
  Store,
  User,
} from "lucide-react";
import {
  getInfoFromToken,
  isWorkerAuthenticated,
} from "../../utils/axiosinstance";
import ProfileModal from "../shared/Profile/ProfileModal";

type MenuItem = {
  name: string;
  icon: any;
  path: string;
};

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isWorker, setIsWorker] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const menuItems: MenuItem[] = [
    { name: "Irányítópult", icon: Home, path: "/dashboard" },
    { name: "Időpont hozzáadása", icon: CirclePlus, path: "/add" },
    { name: "Naptár", icon: Calendar, path: "/calendar" },
    { name: "Keresés", icon: Search, path: "/search" },
    { name: "Üzlet", icon: Store, path: "/store" },
  ];

  const calculateTooltipPosition = useCallback(() => {
    if (!sidebarRef.current || !tooltipRef.current || !hoveredItem) {
      return;
    }

    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const listItem = Array.from(sidebarRef.current.querySelectorAll("li")).find(
      (li) => li.textContent?.trim() === hoveredItem,
    );

    if (!listItem) return;

    const listItemRect = listItem.getBoundingClientRect();
    const top =
      listItemRect.top +
      listItemRect.height / 2 -
      tooltipRef.current.offsetHeight / 2;
    const left = sidebarRect.right + 8;

    setTooltipPosition({ top, left });
  }, [hoveredItem]);

  useEffect(() => {
    const info = getInfoFromToken();
    setUserInfo(info);

    const workerAuth = isWorkerAuthenticated();
    setIsWorker(workerAuth);

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

    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    calculateTooltipPosition();
  }, [hoveredItem, calculateTooltipPosition]);

  if (!isWorker) {
    return null;
  }

  const renderAvatar = () => {
    if (userInfo?.profilePic) {
      return (
        <img
          src={userInfo.profilePic}
          className="h-8 w-8 rounded-full object-cover"
        />
      );
    }
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

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
    setAccountMenuOpen(false);
  };

  const toggleAccountMenu = () => {
    setAccountMenuOpen(!accountMenuOpen);
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
              onClick={toggleAccountMenu}
              className="flex flex-col items-center justify-center p-2 text-gray-500"
            >
              {renderAvatar()}
            </button>
          </div>
        </div>

        {accountMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setAccountMenuOpen(false)}
          >
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-300 mx-auto mb-4 rounded-full"></div>

              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                {renderAvatar()}
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-900">
                    {userInfo?.username}
                  </h3>
                  <p className="text-xs text-gray-500">{userInfo?.email}</p>
                </div>
                <button
                  onClick={() => setAccountMenuOpen(false)}
                  className="ml-auto"
                >
                  <X size={20} />
                </button>
              </div>

              <button
                onClick={handleOpenProfileModal}
                className="flex items-center gap-2 w-full p-4"
              >
                <User size={20} />
                <span className="text-sm font-medium">Profilom</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full p-4 text-red-600"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Kijelentkezés</span>
              </button>
            </div>
          </div>
        )}
        {isProfileModalOpen && (
          <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
        )}
      </>
    );
  }

  return (
    <div
      className="w-16 h-screen sticky top-0 bg-white shadow-lg flex flex-col z-10"
      ref={sidebarRef}
    >
      <div className="flex justify-center p-4 border-b border-gray-100">
        <img
          src="https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/logo.svg"
          alt="Barber & Blade Logo"
          width="24"
          height="24"
        />
      </div>

      <nav className="flex-grow mt-6 px-2 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name} className="relative">
                <button
                  onClick={() => handleNavigation(item.path, item.name)}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex items-center justify-center w-full rounded-md p-2 transition-colors duration-200 ${
                    activeItem === item.name
                      ? "bg-gray-100 text-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="mx-auto">
                    <Icon size={20} />
                  </div>
                </button>
                {hoveredItem === item.name && sidebarRef.current && (
                  <div
                    className="fixed bg-gray-800 text-white text-xs py-1 px-2 rounded z-30 whitespace-nowrap"
                    style={{
                      top: `${tooltipPosition.top}px`,
                      left: `${tooltipPosition.left}px`,
                    }}
                    ref={tooltipRef}
                  >
                    {item.name}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-100 mt-auto" ref={accountMenuRef}>
        <div className="relative flex justify-center p-4">
          <button
            onClick={toggleAccountMenu}
            onMouseEnter={() => setHoveredItem("Account")}
            onMouseLeave={() => setHoveredItem(null)}
            className="flex items-center justify-center text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
          >
            {renderAvatar()}
          </button>
          {hoveredItem === "Account" &&
            !accountMenuOpen &&
            sidebarRef.current && (
              <div
                className="fixed bg-gray-800 text-white text-xs py-1 px-2 rounded z-30 whitespace-nowrap"
                style={{
                  top: `${sidebarRef.current.getBoundingClientRect().bottom - 44}px`,
                  left: `${sidebarRef.current.offsetLeft + sidebarRef.current.offsetWidth + 8}px`, // Added 8px margin
                }}
              >
                Fiók
              </div>
            )}
        </div>

        {accountMenuOpen && (
          <div className="absolute bottom-16 left-16 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-30">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={userInfo.profilePic}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{userInfo?.username}</p>
                  <p className="text-xs text-gray-500 truncate max-w-40">
                    {userInfo?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button
                onClick={handleOpenProfileModal}
                className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50"
              >
                <User size={18} className="mr-3" />
                <span>Profilom</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-gray-50"
              >
                <LogOut size={18} className="mr-3" />
                <span>Kijelentkezés</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {isProfileModalOpen && (
        <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}
    </div>
  );
}
