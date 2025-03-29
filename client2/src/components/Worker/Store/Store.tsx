"use client";

import { useState } from "react";
import Sidebar from "../sidebar";
import { AddImage } from "./AddImage";
import { AddWorker } from "./AddWorker";
import { StoreInformationSection } from "./StoreInformationSection";
import { axiosInstance } from "../../../utils/axiosinstance";

// Define interface for location object
interface LocationType {
  label: string;
  // Add any other properties your location object might have
  [key: string]: any;
}

// Define the store data interface
interface StoreDataType {
  name: string;
  phone: string;
  email: string;
  location: LocationType | null;
  workerId: number | null;
  imageBase64: string | null;
  imagePreviewUrl: string | null;
}

// Define alert state interface
interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

export const Store = () => {
  // Store form state
  const [storeData, setStoreData] = useState<StoreDataType>({
    name: "",
    phone: "",
    email: "",
    location: null,
    workerId: null,
    imageBase64: null,
    imagePreviewUrl: null,
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleImageChange = (
    base64Image: string | null,
    previewUrl: string | null,
  ): void => {
    setStoreData((prev) => ({
      ...prev,
      imageBase64: base64Image,
      imagePreviewUrl: previewUrl,
    }));
  };

  const handleWorkerSelect = (workerId: number): void => {
    setStoreData((prev) => ({ ...prev, workerId }));
  };

  const handleStoreInfoChange = (
    name: string,
    phone: string,
    email: string,
    location: LocationType,
  ): void => {
    setStoreData((prev) => ({
      ...prev,
      name,
      phone,
      email,
      location,
    }));
  };

  const handleCloseAlert = (): void => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  // Form validation and submission
  const handleSubmit = async (): Promise<void> => {
    // Validate required fields
    const { name, phone, email, location, workerId, imageBase64 } = storeData;
    const missingFields: string[] = [];

    if (!name) missingFields.push("Bolt neve");
    if (!phone) missingFields.push("Telefonszám");
    if (!email) missingFields.push("Email");
    if (!location) missingFields.push("Cím");
    if (!workerId) missingFields.push("Munkatárs");
    if (!imageBase64) missingFields.push("Kép");

    if (missingFields.length > 0) {
      setAlert({
        open: true,
        message: `Kérem töltse ki a kitöltetlen mezőket: ${missingFields.join(", ")}`,
        severity: "warning",
      });
      return;
    }

    // Create payload
    const payload = {
      name,
      address: location?.label || "",
      phone,
      email,
      workerId: workerId?.toString() || "",
      image: imageBase64,
    };

    setIsSubmitting(true);

    try {
      await axiosInstance.post("/api/v1/createStore", payload);

      // Show success message
      setAlert({
        open: true,
        message: "Bolt sikeresen létrehozva!",
        severity: "success",
      });

      // Optional: Clear form after successful submission
      setStoreData({
        name: "",
        phone: "",
        email: "",
        location: null,
        workerId: null,
        imageBase64: null,
        imagePreviewUrl: null,
      });
    } catch (error: unknown) {
      // Handle error with proper type checking
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as any)?.response?.data?.message ||
            "Hiba történt a bolt létrehozása közben.";

      // Show error message
      setAlert({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div
        className="flex-1 min-h-screen bg-cover bg-center bg-no-repeat p-6"
        style={{
          backgroundImage:
            "url(https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/authbg.png)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Új bolt létrehozása
            </h1>

            <button
              className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
                isSubmitting
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 active:bg-gray-900"
              }`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Bolt létrehozása..." : "Bolt létrehozása"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <StoreInformationSection
                onStoreInfoChange={handleStoreInfoChange}
                // @ts-ignore - We'll assume the component accepts initialValues
                initialValues={storeData}
              />
              <div className="mt-6">
                <AddWorker
                  onWorkerSelect={handleWorkerSelect}
                  // @ts-ignore - We'll assume the component accepts selectedWorkerId
                  selectedWorkerId={storeData.workerId}
                />
              </div>
            </div>

            <div className="md:col-span-5">
              <AddImage
                onImageChange={handleImageChange}
                // @ts-ignore - We'll assume the component accepts previewUrl
                previewUrl={storeData.imagePreviewUrl}
              />
            </div>
          </div>
        </div>

        {/* Alert notification */}
        {alert.open && (
          <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-50">
            <div
              className={`p-4 rounded-lg shadow-lg backdrop-blur-md flex items-start justify-between ${
                alert.severity === "success"
                  ? "bg-green-500/80 text-white"
                  : alert.severity === "error"
                    ? "bg-red-500/80 text-white"
                    : alert.severity === "warning"
                      ? "bg-yellow-500/80 text-white"
                      : "bg-blue-500/80 text-white"
              }`}
            >
              <span>{alert.message}</span>
              <button
                onClick={handleCloseAlert}
                className="ml-4 text-white hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
