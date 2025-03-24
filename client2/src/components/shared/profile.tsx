"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  User,
  Briefcase,
  Calendar,
  X,
  ChevronLeft,
  LogOut,
} from "lucide-react";

// Custom media query hook
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    media.addEventListener("change", listener);
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}

// Profile Button Component
export function ProfileButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
      >
        <User className="h-5 w-5" />
        <span className="sr-only">Profil</span>
      </button>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

// Main Profile Modal Component
function ProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [avatar, setAvatar] = useState("/placeholder.svg?height=100&width=100");
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    firstName: "János",
    lastName: "Kovács",
    username: "kovacs.janos",
    email: "kovacs.janos@example.com",
  });

  // Sample workplace data
  const [workplaces] = useState([
    {
      id: 1,
      name: "Barber & Blade",
      position: "Fodrász",
      address: "Budapest, Király utca 15.",
      isActive: true,
    },
    {
      id: 2,
      name: "Style Studio",
      position: "Stylist",
      address: "Budapest, Váci utca 10.",
      isActive: false,
    },
  ]);

  // Internal media query handling
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileContent, setShowMobileContent] = useState(false);

  // Handle window resize
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (!isMobile) {
      setShowMobileContent(false);
    }
  }, [isMobile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Save logic would go here
    onClose();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (isMobile) {
      setShowMobileContent(true);
    }
  };

  const handleBackToTabs = () => {
    setShowMobileContent(false);
  };

  const handleExitWorkplace = (id: number) => {
    // Logic to exit workplace would go here
    console.log(`Exiting workplace ${id}`);
  };

  if (!isOpen) return null;

  const tabTitles = {
    profile: "Profilom",
    workplace: "Munkahely",
    bookings: "Foglalásaim",
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95 overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          {isMobile && showMobileContent ? (
            <button
              onClick={handleBackToTabs}
              className="mr-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Vissza</span>
            </button>
          ) : null}

          <h2 className="text-xl md:text-2xl font-bold">
            {isMobile && showMobileContent
              ? tabTitles[activeTab as keyof typeof tabTitles]
              : "Profilom"}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Bezárás</span>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* Mobile view: Show either tabs or content */}
          {isMobile ? (
            !showMobileContent ? (
              <div className="p-4 flex-1 overflow-auto">
                <div className="grid gap-3">
                  <button
                    onClick={() => handleTabChange("profile")}
                    className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="bg-gray-100 p-2 rounded-full">
                      <User size={20} className="text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Profilom</h3>
                      <p className="text-sm text-gray-500">
                        Személyes adatok szerkesztése
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTabChange("workplace")}
                    className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Briefcase size={20} className="text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Munkahely</h3>
                      <p className="text-sm text-gray-500">
                        Munkahelyek kezelése
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTabChange("bookings")}
                    className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Calendar size={20} className="text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Foglalásaim</h3>
                      <p className="text-sm text-gray-500">
                        Foglalások kezelése
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-auto">
                {activeTab === "profile" && (
                  <div className="p-4 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <img
                          src={avatar || "/placeholder.svg"}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Profilkép módosítása
                      </button>
                    </div>

                    <div className="h-px w-full bg-gray-200 my-4"></div>

                    <div className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Keresztnév
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Vezetéknév
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                          />
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
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        />
                      </div>

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
                          value={formData.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">
                          Az email cím nem módosítható
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "workplace" && (
                  <div className="p-4 space-y-6">
                    <h3 className="text-lg font-medium">Munkahelyek</h3>

                    {workplaces.map((workplace) => (
                      <div
                        key={workplace.id}
                        className={`${workplace.isActive ? "bg-white" : "bg-gray-50"} border rounded-lg p-4 ${workplace.isActive ? "shadow-sm" : ""}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{workplace.name}</h4>
                              {workplace.isActive && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Aktív
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Pozíció: {workplace.position}
                            </p>
                            <p className="text-sm text-gray-600">
                              {workplace.address}
                            </p>
                          </div>
                          <button
                            className="self-start flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1 text-sm rounded-md"
                            onClick={() => handleExitWorkplace(workplace.id)}
                          >
                            <LogOut size={14} />
                            Kilépés
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4">
                      <button className="w-full border border-gray-300 rounded-md py-2 hover:bg-gray-50 transition-colors">
                        + Új munkahely hozzáadása
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "bookings" && (
                  <div className="p-4 space-y-6">
                    <h3 className="text-lg font-medium">Közelgő foglalások</h3>

                    {[1, 2, 3].map((booking) => (
                      <div
                        key={booking}
                        className="bg-white border rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div>
                            <h4 className="font-medium">
                              Hajvágás és szakállvágás
                            </h4>
                            <p className="text-sm text-gray-600">
                              2024. március {booking + 25}, 14:00
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Nagy Péter
                            </p>
                          </div>
                          <button className="self-start border border-gray-300 rounded-md px-3 py-1 text-sm hover:bg-gray-50 transition-colors">
                            Részletek
                          </button>
                        </div>
                      </div>
                    ))}

                    <h3 className="text-lg font-medium pt-4">
                      Korábbi foglalások
                    </h3>

                    {[1, 2].map((booking) => (
                      <div
                        key={booking}
                        className="bg-gray-50 border rounded-lg p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div>
                            <h4 className="font-medium">Hajvágás</h4>
                            <p className="text-sm text-gray-600">
                              2024. március {booking + 10}, 10:00
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Nagy Péter
                            </p>
                          </div>
                          <button className="self-start text-sm px-3 py-1 rounded-md hover:bg-gray-200 transition-colors">
                            Részletek
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          ) : (
            // Desktop view: Show tabs and content side by side
            <div className="flex-1 flex">
              <div className="border-r w-64 p-4">
                <div className="flex flex-col w-full h-auto space-y-2">
                  <button
                    onClick={() => handleTabChange("profile")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-left ${
                      activeTab === "profile"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <User size={16} />
                    <span>Profilom</span>
                  </button>
                  <button
                    onClick={() => handleTabChange("workplace")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-left ${
                      activeTab === "workplace"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Briefcase size={16} />
                    <span>Munkahely</span>
                  </button>
                  <button
                    onClick={() => handleTabChange("bookings")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-left ${
                      activeTab === "bookings"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Calendar size={16} />
                    <span>Foglalásaim</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {activeTab === "profile" && (
                  <div className="p-6 h-full">
                    <div className="space-y-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          <img
                            src={avatar || "/placeholder.svg"}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          Profilkép módosítása
                        </button>
                      </div>

                      <div className="h-px w-full bg-gray-200 my-4"></div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Keresztnév
                            </label>
                            <input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Vezetéknév
                            </label>
                            <input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                            />
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
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                          />
                        </div>

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
                            value={formData.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          />
                          <p className="text-xs text-gray-500">
                            Az email cím nem módosítható
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "workplace" && (
                  <div className="p-6 h-full">
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">Munkahelyek</h3>

                      {workplaces.map((workplace) => (
                        <div
                          key={workplace.id}
                          className={`${workplace.isActive ? "bg-white" : "bg-gray-50"} border rounded-lg p-4 ${workplace.isActive ? "shadow-sm" : ""}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">
                                  {workplace.name}
                                </h4>
                                {workplace.isActive && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Aktív
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Pozíció: {workplace.position}
                              </p>
                              <p className="text-sm text-gray-600">
                                {workplace.address}
                              </p>
                            </div>
                            <button
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1 text-sm rounded-md"
                              onClick={() => handleExitWorkplace(workplace.id)}
                            >
                              <LogOut size={14} />
                              Kilépés
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="pt-4">
                        <button className="w-full border border-gray-300 rounded-md py-2 hover:bg-gray-50 transition-colors">
                          + Új munkahely hozzáadása
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "bookings" && (
                  <div className="p-6 h-full">
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">
                        Közelgő foglalások
                      </h3>

                      {[1, 2, 3].map((booking) => (
                        <div
                          key={booking}
                          className="bg-white border rounded-lg p-4 shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                Hajvágás és szakállvágás
                              </h4>
                              <p className="text-sm text-gray-600">
                                2024. március {booking + 25}, 14:00
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Nagy Péter
                              </p>
                            </div>
                            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm hover:bg-gray-50 transition-colors">
                              Részletek
                            </button>
                          </div>
                        </div>
                      ))}

                      <h3 className="text-lg font-medium pt-4">
                        Korábbi foglalások
                      </h3>

                      {[1, 2].map((booking) => (
                        <div
                          key={booking}
                          className="bg-gray-50 border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">Hajvágás</h4>
                              <p className="text-sm text-gray-600">
                                2024. március {booking + 10}, 10:00
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Nagy Péter
                              </p>
                            </div>
                            <button className="text-sm px-3 py-1 rounded-md hover:bg-gray-200 transition-colors">
                              Részletek
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 border-t">
          <div className="flex gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Mégsem
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Mentés
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileButton;
