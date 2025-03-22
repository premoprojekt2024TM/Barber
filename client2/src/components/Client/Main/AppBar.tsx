import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  getInfoFromToken,
  isClientAuthenticated,
  isWorkerAuthenticated,
} from "../../../utils/axiosinstance";
import { UserInfo, MenuState } from "./MainTypes";
import { Menu, X, LogOut } from "lucide-react";
import Cookies from "js-cookie";

export default function AppBar() {
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [menuState, setMenuState] = useState<MenuState>({
    anchorEl: null,
    open: false,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      const isAuth = isClientAuthenticated() || isWorkerAuthenticated();
      setIsAuthenticated(isAuth);

      if (isAuth) {
        const userInformation = getInfoFromToken();
        setUserInfo(userInformation);
      } else {
        setUserInfo(null);
      }
    };

    checkAuthentication();

    const handleStorageChange = () => {
      checkAuthentication();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuState({
      anchorEl: event.currentTarget,
      open: true,
    });
  };

  const handleMenuClose = () => {
    setMenuState({
      ...menuState,
      open: false,
    });
  };

  const handleLogout = () => {
    Cookies.remove("jwt_token", { path: "/" });
    setIsAuthenticated(false);
    setUserInfo(null);
    setMenuState({
      ...menuState,
      open: false,
    });
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-6">
      <div className="container mx-auto">
        <div
          className={`flex flex-col backdrop-blur-md bg-white/40 border border-gray-200 rounded-lg shadow-md px-4 py-2 transition-all duration-300 ${open ? "rounded-b-none" : ""}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ScrollLink
                to="Main"
                smooth={true}
                duration={500}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  <img
                    src="https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/logocircle.svg"
                    alt="Logo"
                    className="h-10 w-10 mr-3 transition-all duration-300 hover:invert"
                  />
                </div>
              </ScrollLink>

              <div className="hidden md:flex items-center space-x-1 ml-4">
                <ScrollLink
                  to="features"
                  smooth={true}
                  duration={500}
                  className="cursor-pointer"
                >
                  <button className="px-3 py-1.5 text-gray-800 font-medium text-sm rounded-md hover:bg-gray-100 transition-colors duration-200">
                    Szolgáltatások
                  </button>
                </ScrollLink>
                <ScrollLink
                  to="popular"
                  smooth={true}
                  duration={500}
                  className="cursor-pointer"
                >
                  <button className="px-3 py-1.5 text-gray-800 font-medium text-sm rounded-md hover:bg-gray-100 transition-colors duration-200">
                    Népszerű
                  </button>
                </ScrollLink>
                <ScrollLink
                  to="faq"
                  smooth={true}
                  duration={500}
                  className="cursor-pointer"
                >
                  <button className="px-3 py-1.5 text-gray-800 font-medium text-sm rounded-md hover:bg-gray-100 transition-colors duration-200">
                    GyIK
                  </button>
                </ScrollLink>
              </div>
            </div>

            <div className="flex items-center">
              <div className="hidden md:flex items-center space-x-3">
                {!isAuthenticated ? (
                  <>
                    <RouterLink to="/login">
                      <button className="px-4 py-1.5 text-gray-800 font-medium text-sm hover:text-black transition-colors duration-200">
                        Bejelentkezés
                      </button>
                    </RouterLink>
                    <RouterLink to="/register">
                      <button className="px-4 py-1.5 bg-black text-white font-medium text-sm rounded-full hover:bg-black transition-colors duration-200 shadow-sm">
                        Regisztráció
                      </button>
                    </RouterLink>
                  </>
                ) : (
                  <div className="relative">
                    <button
                      onClick={handleAvatarClick}
                      className="flex items-center space-x-2 focus:outline-none"
                    >
                      <img
                        src={
                          userInfo?.profilePic ||
                          "https://via.placeholder.com/40"
                        }
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </button>

                    {menuState.open && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                        <RouterLink to="/profile" onClick={handleMenuClose}>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Profil
                          </button>
                        </RouterLink>
                        <RouterLink to="/account" onClick={handleMenuClose}>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Fiókom
                          </button>
                        </RouterLink>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span>Kijelentkezés</span>
                          <LogOut className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={toggleDrawer}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                {open ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {open && (
            <div className="md:hidden mt-4 border-t border-gray-100 pt-2 overflow-hidden transition-all duration-300 ease-in-out animate-in slide-in-from-top">
              <ScrollLink
                to="features"
                smooth={true}
                duration={500}
                className="block py-3 text-gray-800 hover:text-black border-b border-gray-100"
                onClick={toggleDrawer}
              >
                Szolgáltatások
              </ScrollLink>
              <ScrollLink
                to="popular"
                smooth={true}
                duration={500}
                className="block py-3 text-gray-800 hover:text-black border-b border-gray-100"
                onClick={toggleDrawer}
              >
                Népszerű
              </ScrollLink>
              <ScrollLink
                to="faq"
                smooth={true}
                duration={500}
                className="block py-3 text-gray-800 hover:text-black border-b border-gray-100"
                onClick={toggleDrawer}
              >
                GyIK
              </ScrollLink>

              {!isAuthenticated ? (
                <div className="py-4 space-y-3">
                  <RouterLink to="/login" onClick={toggleDrawer}>
                    <button className="w-full py-2 text-center border border-black text-black rounded-full hover:bg-indigo-50 transition-colors duration-200">
                      Bejelentkezés
                    </button>
                  </RouterLink>
                  <RouterLink to="/register" onClick={toggleDrawer}>
                    <button className="w-full py-2 text-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200">
                      Regisztráció
                    </button>
                  </RouterLink>
                </div>
              ) : (
                <div className="py-4 space-y-2">
                  <div className="flex items-center space-x-3 pb-2">
                    <img
                      src={
                        userInfo?.profilePic || "https://via.placeholder.com/40"
                      }
                      alt="User Avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{userInfo?.username}</div>
                      <div className="text-sm text-gray-500">
                        {userInfo?.email}
                      </div>
                    </div>
                  </div>
                  <RouterLink to="/profile" onClick={toggleDrawer}>
                    <button className="w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md">
                      Profil
                    </button>
                  </RouterLink>
                  <RouterLink to="/account" onClick={toggleDrawer}>
                    <button className="w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md">
                      Fiókom
                    </button>
                  </RouterLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleDrawer();
                    }}
                    className="w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-md flex items-center"
                  >
                    <span>Kijelentkezés</span>
                    <LogOut className="h-4 w-4 ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {open && (
          <div className="container mx-auto md:hidden">
            <div className="backdrop-blur-md bg-white/40 border border-gray-200 border-t-0 rounded-b-lg shadow-md mx-4"></div>
          </div>
        )}
      </div>
    </div>
  );
}
