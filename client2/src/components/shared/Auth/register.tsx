import { useState, ChangeEvent } from "react";
import { ArrowRight, Scissors, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../utils/axiosinstance";
import {
  validateStep,
  validateFullForm,
  mapUserTypeToRole,
  type RegisterFormData,
} from "../../../../../server/src/shared/registervalidation";
import Snackbar from "../Snackbar";

type UserType = "kliens" | "fodrasz";
type SnackbarSeverity = "success" | "error" | "info" | "warning";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

export default function Register() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>("kliens");
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<RegisterFormData>>({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    agreedToTerms: false,
    userType: "kliens",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "error",
  });

  const validateName = (name: string, fieldName: string): string => {
    if (typeof name !== "string") {
      return `${fieldName} Csak szöveget tartalmazhat`;
    }
    if (!/^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]*$/.test(name)) {
      return `Csak betűt tartalmazhat`;
    }

    if (name.length < 5) {
      return `Minimum 5 karakteresnek kell lennie`;
    }

    if (name.length > 12) {
      return `Nem haladhatja meg a 12 karaktert`;
    }

    return "";
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    if ((name === "firstName" || name === "lastName") && type !== "checkbox") {
      const validationError = validateName(
        value,
        name === "firstName" ? "First name" : "Last name",
      );
      if (validationError) {
        setErrors({
          ...errors,
          [name]: validationError,
        });
      } else {
        const { [name]: _, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      const firstNameError = validateName(
        formData.firstName || "",
        "First name",
      );
      const lastNameError = validateName(formData.lastName || "", "Last name");

      if (firstNameError || lastNameError) {
        setErrors({
          ...errors,
          ...(firstNameError ? { firstName: firstNameError } : {}),
          ...(lastNameError ? { lastName: lastNameError } : {}),
        });
        showSnackbar("Name validation failed", "error");
        return;
      }
    }

    const validation = validateStep(currentStep, formData);

    if (!validation.success) {
      setErrors(validation.errors);
      showSnackbar("Minden mező kitöltése kötelező", "error");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(currentStep + 1);
    }, 1000);
  };

  const handleSubmit = async () => {
    const stepValidation = validateStep(currentStep, formData);
    if (!stepValidation.success) {
      setErrors(stepValidation.errors);
      showSnackbar("Minden mező kitöltése kötelező", "error");
      return;
    }

    const fullValidation = validateFullForm(formData as RegisterFormData);
    if (!fullValidation.success) {
      setErrors(fullValidation.errors);
      showSnackbar("Hiányos vagy érvénytelen adatok", "error");
      return;
    }

    setIsLoading(true);

    try {
      const role = mapUserTypeToRole(userType);

      const userData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: role,
      };
      // @ts-ignore
      const response = await axiosInstance.post("/api/v1/register", userData);

      showSnackbar("Sikeres regisztráció!", "success");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Hiba történt a regisztráció során";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      showSnackbar(errorMessage, "error");
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: SnackbarSeverity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    setFormData({
      ...formData,
      userType: type,
    });
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
        <div className="flex items-center gap-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 2C10.5 2 9.5 3 8.5 5C7.5 7 7 8 5 8.5C3 9 2 10 2 12C2 14 3 15 5 15.5C7 16 7.5 17 8.5 19C9.5 21 10.5 22 12.5 22C14.5 22 15.5 21 16.5 19C17.5 17 18 16 20 15.5C22 15 23 14 23 12C23 10 22 9 20 8.5C18 8 17.5 7 16.5 5C15.5 3 14.5 2 12.5 2Z"
              fill="#E02F2F"
            />
          </svg>
          <span className="text-xl font-semibold text-gray-900">
            Barber & Blade
          </span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md z-10 mx-4 md:mx-0 md:ml-16 lg:ml-32">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Kezdjük el</h1>
            <h2 className="text-xl text-gray-700">Fiók létrehozása</h2>
          </div>

          <div className="flex justify-between mb-2">
            <div className="flex space-x-2">
              <div
                className={`h-2 w-8 rounded-full ${currentStep >= 1 ? "bg-black" : "bg-gray-300"}`}
              ></div>
              <div
                className={`h-2 w-8 rounded-full ${currentStep >= 2 ? "bg-black" : "bg-gray-300"}`}
              ></div>
              <div
                className={`h-2 w-8 rounded-full ${currentStep >= 3 ? "bg-black" : "bg-gray-300"}`}
              ></div>
            </div>
            <span className="text-sm text-gray-500">
              {currentStep}. lépés a 3-ból
            </span>
          </div>

          <div className="space-y-4">
            {currentStep === 1 && (
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
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Add meg az email címed"
                  className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Teljes név
                  </label>
                  <div className="flex gap-2 mt-2">
                    <div className="w-1/2">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Vezetéknév"
                        className={`w-full px-3 py-2 border ${errors.lastName ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                    <div className="w-1/2">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Keresztnév (5-12 betű)"
                        className={`w-full px-3 py-2 border ${errors.firstName ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Felhasználónév
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Válassz egy felhasználónevet"
                    className={`w-full px-3 py-2 border ${errors.username ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
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
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Hozz létre egy jelszót"
                    className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`border-2 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
                        userType === "kliens"
                          ? "border-black bg-gray-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleUserTypeChange("kliens")}
                    >
                      <div className="p-4 flex flex-col items-center">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                            userType === "kliens"
                              ? "bg-gray-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <User
                            size={32}
                            className={
                              userType === "kliens"
                                ? "text-black"
                                : "text-gray-500"
                            }
                          />
                        </div>
                        <span
                          className={`font-medium text-lg ${
                            userType === "kliens"
                              ? "text-black"
                              : "text-gray-700"
                          }`}
                        >
                          Kliens
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          Szolgáltatásokat keres
                        </span>
                        {userType === "kliens" && (
                          <div className="w-full bg-black py-1 mt-3 -mb-4 text-center">
                            <span className="text-white text-xs font-medium">
                              Kiválasztva
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
                        userType === "fodrasz"
                          ? "border-black bg-gray-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleUserTypeChange("fodrasz")}
                    >
                      <div className="p-4 flex flex-col items-center">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                            userType === "fodrasz"
                              ? "bg-gray-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <Scissors
                            size={32}
                            className={
                              userType === "fodrasz"
                                ? "text-black"
                                : "text-gray-500"
                            }
                          />
                        </div>
                        <span
                          className={`font-medium text-lg ${
                            userType === "fodrasz"
                              ? "text-black"
                              : "text-gray-700"
                          }`}
                        >
                          Fodrász
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          Szolgáltatásokat kínál
                        </span>
                        {userType === "fodrasz" && (
                          <div className="w-full bg-black py-1 mt-3 -mb-4 text-center">
                            <span className="text-white text-xs font-medium">
                              Kiválasztva
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="agreedToTerms"
                    name="agreedToTerms"
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    className={`h-4 w-4 text-black focus:ring-black border-gray-300 rounded ${errors.agreedToTerms ? "border-red-500" : ""}`}
                  />
                  <label
                    htmlFor="agreedToTerms"
                    className={`ml-2 block text-sm ${errors.agreedToTerms ? "text-red-500" : "text-gray-700"}`}
                  >
                    Beleegyezem a{" "}
                    <a href="#" className="text-black hover:text-gray-800">
                      Szolgáltatási feltételekbe
                    </a>{" "}
                    és a{" "}
                    <a href="#" className="text-black hover:text-gray-800">
                      Adatvédelmi szabályzatba
                    </a>
                  </label>
                </div>
                {errors.agreedToTerms && (
                  <p className="text-red-500 text-xs">{errors.agreedToTerms}</p>
                )}
              </div>
            )}

            <div className="flex justify-between items-center">
              {currentStep === 1 ? (
                <div className="flex justify-between w-full">
                  <a
                    className="text-sm text-black hover:text-gray-800 cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Van már fiókod?
                  </a>
                  <button
                    onClick={handleNextStep}
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.819 3 7.749l3-2.458z"
                          ></path>
                        </svg>
                        Feldolgozás
                      </>
                    ) : (
                      <>
                        Tovább
                        <ArrowRight size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex justify-between w-full">
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    type="button"
                    className="text-black hover:text-gray-800"
                    disabled={isLoading}
                  >
                    Vissza
                  </button>
                  <button
                    onClick={currentStep < 3 ? handleNextStep : handleSubmit}
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.819 3 7.749l3-2.458z"
                          ></path>
                        </svg>
                        Feldolgozás
                      </>
                    ) : (
                      <>
                        {currentStep === 3 ? "Regisztráció" : "Tovább"}
                        <ArrowRight size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
}
