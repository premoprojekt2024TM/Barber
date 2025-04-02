import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../utils/axiosinstance";
import Cookies from "js-cookie";
import Snackbar from "../Snackbar";
import { AxiosError } from "axios";
interface ErrorResponse {
  message: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  const handleNextClick = () => {
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSnackbar({
        open: true,
        message: "Kérjük, adjon meg egy érvényes e-mail címet",
        severity: "error",
      });
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      setShowPassword(true);
    }, 1000);
  };

  const handleLoginSubmit = async () => {
    if (!showPassword) {
      handleNextClick();
      return;
    }
    if (!password) {
      setSnackbar({
        open: true,
        message: "A jelszó mező nem lehet üres",
        severity: "error",
      });
      return;
    }

    if (password.length < 6) {
      setSnackbar({
        open: true,
        message: "A jelszónak legalább 6 karakter hosszúnak kell lennie",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/v1/login", {
        email,
        password,
      });

      const { token } = response.data;

      Cookies.set("jwt_token", token, { expires: 7 });

      setSnackbar({
        open: true,
        message: "Sikeres bejelentkezés!",
        severity: "success",
      });

      const userInfo = response.data.user || {};
      setTimeout(() => {
        if (userInfo.role === "client") {
          navigate("/");
        } else if (userInfo.role === "worker") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);

      const axiosError = error as AxiosError<ErrorResponse>;
      setSnackbar({
        open: true,
        message:
          axiosError.response?.data?.message || "Bejelentkezési hiba történt",
        severity: "error",
      });

      setIsLoading(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center md:justify-start relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/authbg.png"
          alt="Gradient Background"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="absolute top-10 left-10 z-10">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/logo.svg"
            alt="Barber & Blade Logo"
            width="32"
            height="32"
          />
          <span className="text-xl font-semibold text-gray-900">
            Barber & Blade
          </span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md z-10 mx-4 md:mx-0 md:ml-16 lg:ml-32">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Üdv, újra</h1>
            <h2 className="text-xl text-gray-700">Bejelentkezés</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            {showPassword && (
              <div className="space-y-2 animate-fadeIn">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Jelszó
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Jelszó"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
                <div className="text-xs text-gray-500">
                  A jelszónak legalább 6 karakter hosszúnak kell lennie
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              {!showPassword ? (
                <a
                  className="text-sm text-black hover:text-gray-800 cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Nincs még fiókod?
                </a>
              ) : null}
              <div className={showPassword ? "ml-auto" : "ml-auto"}>
                <button
                  onClick={showPassword ? handleLoginSubmit : handleNextClick}
                  type="button"
                  className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Feldolgozás
                    </>
                  ) : (
                    <>
                      {showPassword ? "Bejelentkezés" : "Tovább"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity as "success" | "error" | "warning" | "info"}
        onClose={closeSnackbar}
      />
    </div>
  );
}
