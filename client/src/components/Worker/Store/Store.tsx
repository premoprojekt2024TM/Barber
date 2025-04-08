import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import { AddImage } from "./AddImage";
import { AddWorker } from "./AddWorker";
import { StoreInformationSection } from "./StoreInformationSection";
import { axiosInstance } from "../../../utils/axiosinstance";


interface LocationType {
  label: string;
  [key: string]: any;
}

interface StoreDataType {
  name: string;
  phone: string;
  email: string;
  location: LocationType | null;
  workerIds: number[];
  imageBase64: string | null;
  imagePreviewUrl: string | null;
}

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

export const Store = () => {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<StoreDataType>({
    name: "",
    phone: "",
    email: "",
    location: null,
    workerIds: [], 
    imageBase64: null,
    imagePreviewUrl: null,
  });

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

  const handleWorkersSelect = (workerIds: number[]): void => {
    setStoreData((prev) => ({ ...prev, workerIds }));
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

  const extractAddressDetails = (location: LocationType | null) => {
    if (!location) return { fullAddress: "" };

    const fullAddress =
      location.label ||
      (location.value && location.value.description) ||
      (location.value &&
        location.value.structured_formatting &&
        `${location.value.structured_formatting.main_text}, ${location.value.structured_formatting.secondary_text}`) ||
      "";

    return {
      fullAddress: fullAddress,
    };
  };


  const handleSubmit = async (): Promise<void> => {
    const { name, phone, email, location, workerIds, imageBase64 } = storeData;
    const missingFields: string[] = [];

    if (!name) missingFields.push("Bolt neve");
    if (!phone) missingFields.push("Telefonszám");
    if (!email) missingFields.push("Email");
    if (!location) missingFields.push("Cím");
    if (workerIds.length === 0) missingFields.push("Munkatárs");
    if (!imageBase64) missingFields.push("Kép");

    if (missingFields.length > 0) {
      setAlert({
        open: true,
        message: `Kérem töltse ki a kitöltetlen mezőket: ${missingFields.join(", ")}`,
        severity: "warning",
      });
      return;
    }

    const addressDetails = extractAddressDetails(location);

    const payload = {
      name,
      address: addressDetails.fullAddress,
      phone,
      email,
      workerIds: workerIds,
      image: imageBase64,
    };

    setIsSubmitting(true);

    try {
      await axiosInstance.post("/api/v1/createStore", payload);
      setAlert({
        open: true,
        message: "Bolt sikeresen létrehozva!",
        severity: "success",
      });
      navigate("/edit");
      setStoreData({
        name: "",
        phone: "",
        email: "",
        location: null,
        workerIds: [],
        imageBase64: null,
        imagePreviewUrl: null,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as any)?.response?.data?.message ||
            "Hiba történt a bolt létrehozása közben.";

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
                // @ts-ignore
                initialValues={storeData}
              />
              <div className="mt-6">
                <AddWorker
                  onWorkersSelect={handleWorkersSelect}
                />
              </div>
            </div>

            <div className="md:col-span-5">
              <AddImage
                onImageChange={handleImageChange}
                // @ts-ignore
                previewUrl={storeData.imagePreviewUrl}
              />
            </div>
          </div>
        </div>

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
