import React, { useState, useEffect, useCallback, useRef } from "react";
import { User, Briefcase, Calendar, X, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Profile from "./Profile";
import Workplace from "./Workplace";
import Bookings from "./Booking";
import { FormData } from "./types";
import {
  axiosInstance,
  isClientAuthenticated,
  isWorkerAuthenticated,
} from "../../../utils/axiosinstance";

interface ProfileModalProps {
  onClose: () => void;
}

interface StoreData {
  storeId: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  picture: string;
}

interface MyStoreResponse {
  message: string;
  store: StoreData | null;
  role: string | null;
}

interface IsStoreOwnerResponse {
  isStoreOwner: boolean;
  storeId: number;
  storeName: string;
}

export function ProfileModal({ onClose }: ProfileModalProps) {
  const [avatar, setAvatar] = useState("/placeholder.svg?height=100&width=100");
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });

  const [isMobile, setIsMobile] = useState(false);
  const [showMobileContent, setShowMobileContent] = useState(false);
  const [myStore, setMyStore] = useState<StoreData | null>(null);
  const [myRole, setMyRole] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [deleteStoreError, setDeleteStoreError] = useState<string | null>(null); // For error messages

  const navigate = useNavigate();

  const [avatarChanged, setAvatarChanged] = useState(false);
  const initialAvatar = useRef("/placeholder.svg?height=100&width=100");

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/v1/me");
      const userData = response.data;

      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
      });

      setAvatar(userData.profilePic);
      initialAvatar.current = userData.profilePic;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  const fetchMyStoreData = useCallback(async () => {
    try {
      const response =
        await axiosInstance.get<MyStoreResponse>("/api/v1/mystore");
      setMyStore(response.data.store);
      setMyRole(response.data.role);
    } catch (error) {
      setMyStore(null);
      setMyRole(null);
    }
  }, []);

  const fetchIsStoreOwner = useCallback(async () => {
    try {
      const response = await axiosInstance.get<IsStoreOwnerResponse>(
        "/api/v1/isStoreOwner",
      ); //explicitly type
      setIsOwner(response.data.isStoreOwner);
    } catch (error) {
      setIsOwner(false);
    }
  }, []);

  const fetchBookingData = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/v1/getAppointment");
      const appointments = response.data.appointments;

      const bookingsTransformed = appointments.map((appointment: any) => {
        const workerName = `${appointment.worker.firstName} ${appointment.worker.lastName}`;
        const appointmentDate = appointment.timeSlot.day;
        const appointmentTime = appointment.timeSlot.timeSlot;
        const store = appointment.worker.storeWorkers?.[0]?.store;

        return {
          id: appointment.appointmentId,
          type: `${workerName}`,
          date: appointmentDate,
          time: appointmentTime,
          customer: appointment.worker.email,
          address: store?.address,
          cityName: store?.city,
          storeName: store?.name,
        };
      });

      setBookings(bookingsTransformed);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  }, []);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (isClientAuthenticated()) {
      setUserRole("client");
    } else if (isWorkerAuthenticated()) {
      setUserRole("worker");
    }

    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (userRole === "worker") {
      fetchMyStoreData();
      fetchIsStoreOwner();
    } else if (userRole === "client") {
      fetchBookingData();
    }
  }, [userRole, fetchMyStoreData, fetchIsStoreOwner, fetchBookingData]);

  useEffect(() => {
    if (!isMobile) {
      setShowMobileContent(false);
    }
  }, [isMobile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "avatar") {
      setAvatar(value);
      setAvatarChanged(true);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      //@ts-ignore
      const { avatar, firstName, lastName, username, email } = formData;

      let payload: any = { avatar, firstName, lastName, username, email };

      if (avatarChanged) {
        payload.profilePic = avatar;
      }

      const response = await axiosInstance.put(
        "/api/v1/update",
        JSON.stringify(payload),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      await fetchUserData();
      const response2 = await axiosInstance.get("/api/v1/me");
      const userData = response2.data;
      setAvatar(userData.profilePic);
      initialAvatar.current = userData.profilePic;
      Cookies.remove("jwt_token");
      navigate("/login");
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExitWorkplace = async () => {
    await axiosInstance.delete("/api/v1/exitstore");
    window.location.reload();
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

  const getTabConfiguration = () => {
    if (userRole === "client") {
      return {
        profile: { label: "Profilom", icon: User },
        bookings: { label: "Foglalásaim", icon: Calendar },
      };
    } else if (userRole === "worker") {
      return {
        profile: { label: "Profilom", icon: User },
        workplace: { label: "Munkahely", icon: Briefcase },
      };
    }
    return {
      profile: { label: "Profilom", icon: User },
      workplace: { label: "Munkahely", icon: Briefcase },
      bookings: { label: "Foglalásaim", icon: Calendar },
    };
  };

  const tabConfig = getTabConfiguration();

  const renderTabs = () => {
    return Object.entries(tabConfig).map(([key, { label, icon: Icon }]) => (
      <button
        key={key}
        onClick={() => setActiveTab(key)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-left ${
          activeTab === key
            ? "bg-gray-100 text-gray-900"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <Icon size={16} />
        <span>{label}</span>
      </button>
    ));
  };

  const handleDeleteStore = async () => {
    setIsDeleting(true);
    setDeleteStoreError(null);
    try {
      if (!myStore) {
        throw new Error("No store to delete.");
      }
      console.log("Deleting store with ID:", myStore.storeId);

      // Call delete store API
      await axiosInstance.delete(`/api/v1/deletestore`);

      // Force full page refresh to reset application state
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting store:", error);
      setDeleteStoreError(
        error.response?.data?.message || "Failed to delete store.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <Profile
            formData={formData}
            avatar={avatar}
            handleChange={handleChange}
          />
        );
      case "workplace":
        return (
          <Workplace
            store={myStore}
            handleExitWorkplace={handleExitWorkplace}
            handleDeleteStore={isOwner ? handleDeleteStore : undefined}
          />
        );
      case "bookings":
        return <Bookings bookings={bookings} />;
      default:
        return null;
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete("/api/v1/delete");
      Cookies.remove("jwt_token");
      navigate("/login");
      onClose();
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
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
              ? //@ts-ignore
                tabConfig[activeTab as keyof typeof tabConfig].label
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

        <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
          {isMobile ? (
            !showMobileContent ? (
              <div className="p-4 flex-1 overflow-auto">
                <div className="grid gap-3">
                  {Object.entries(tabConfig).map(
                    ([key, { label, icon: Icon }]) => (
                      <button
                        key={key}
                        onClick={() => handleTabChange(key)}
                        className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Icon size={20} className="text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-medium">{label}</h3>
                          <p className="text-sm text-gray-500">
                            {key === "profile"
                              ? "Személyes adatok szerkesztése"
                              : key === "workplace"
                                ? "Munkahelyek kezelése"
                                : "Foglalások kezelése"}
                          </p>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-auto">{renderContent()}</div>
            )
          ) : (
            <div className="flex-1 flex">
              <div className="border-r w-64 p-4">
                <div className="flex flex-col w-full h-auto space-y-2">
                  {renderTabs()}
                </div>
              </div>

              <div className="flex-1 overflow-auto">{renderContent()}</div>
            </div>
          )}
        </div>
        {deleteStoreError && (
          <div className="text-red-500 p-4">Error: {deleteStoreError}</div>
        )}

        <div className="p-4 md:p-6 border-t">
          <div className="flex justify-between">
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className={`px-4 py-2 text-red-600 border border-red-400 rounded-md hover:bg-red-50 transition-colors ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDeleting ? "Fiók törlése..." : "Fiók törlése"}
            </button>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Mégsem
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Mentés..." : "Mentés"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
