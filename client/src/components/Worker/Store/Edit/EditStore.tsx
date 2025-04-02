import { useState, useEffect } from "react";
import Sidebar from "../../sidebar";
import { EditImage } from "./EditImage";
import { EditWorker } from "./EditWorker";
import { EditStoreInfo } from "./EditStoreInformationSection";
import { axiosInstance } from "../../../../utils/axiosinstance";

interface LocationType {
  label: string;
  [key: string]: any;
  address?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

interface StoreDataType {
  storeId?: number;
  name: string;
  phone: string;
  email: string;
  location: LocationType | null;
  workerId: number | null;
  imageBase64: string | null;
  imagePreviewUrl: string | null;
}

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

interface WorkerType {
  userId: number;
  username: string;
  email: string;
  role: string;
  storeWorkerId: number;
  profilepic: string;
}

interface StoreOwnerResponse {
  isStoreOwner: boolean;
  store: {
    storeId: number;
    name: string;
    description: string | null;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: number;
    picture: string;
  };
  workers: WorkerType[];
}

export const EditStore = () => {
  const [storeData, setStoreData] = useState<StoreDataType>({
    name: "",
    phone: "",
    email: "",
    location: null,
    workerId: null,
    imageBase64: null,
    imagePreviewUrl: null,
  });

  const [initialStoreData, setInitialStoreData] =
    useState<StoreDataType | null>(null);
  const [workers, setWorkers] = useState<WorkerType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchStoreOwnerData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get<StoreOwnerResponse>(
          "api/v1/isStoreOwner",
        );
        const { isStoreOwner, store, workers } = response.data;

        setWorkers(workers);

        if (isStoreOwner && store) {
          const location: LocationType = {
            label: store.address,
            address: store.address,
            city: store.city,
            postalCode: store.postalCode,
            latitude: store.latitude,
            longitude: store.longitude,
          };

          const currentWorker =
            workers && workers.length > 0 ? workers[0].userId : null;

          const fetchedData: StoreDataType = {
            storeId: store.storeId,
            name: store.name,
            phone: store.phone,
            email: store.email,
            location: location,
            workerId: currentWorker,
            imageBase64: null,
            imagePreviewUrl: store.picture,
          };

          setStoreData(fetchedData);
          setInitialStoreData(fetchedData);
          setIsEditMode(false);
        } else {
          const defaultInitialData: StoreDataType = {
            name: "",
            phone: "",
            email: "",
            location: null,
            workerId: null,
            imageBase64: null,
            imagePreviewUrl: null,
          };
          setStoreData(defaultInitialData);
          setInitialStoreData(defaultInitialData);
          setIsEditMode(true);
        }
      } catch (error) {
        setAlert({
          open: true,
          message: "Nem sikerült betölteni a bolt adatait.",
          severity: "error",
        });
        const defaultInitialData: StoreDataType = {
          name: "",
          phone: "",
          email: "",
          location: null,
          workerId: null,
          imageBase64: null,
          imagePreviewUrl: null,
        };
        setStoreData(defaultInitialData);
        setInitialStoreData(defaultInitialData);
        setIsEditMode(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreOwnerData();
  }, []);

  const handleImageChange = (
    base64Image: string | null,
    previewUrl: string | null,
  ): void => {
    setStoreData((prev) => ({
      ...prev,
      imageBase64: base64Image,
      imagePreviewUrl: previewUrl || prev.imagePreviewUrl,
    }));
  };

  const handleWorkerSelect = (workerId: number): void => {
    setStoreData((prev) => ({ ...prev, workerId }));
  };

  const handleStoreInfoChange = (
    name: string,
    phone: string,
    email: string,
    location: LocationType | null,
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

  const toggleEditMode = (): void => {
    if (!isEditMode && initialStoreData) {
    }
    setIsEditMode(true);
  };
  const haveFieldsChanged = (): boolean => {
    if (!initialStoreData) return true;
    const imageChanged = storeData.imageBase64 !== null;
    if (imageChanged) return true;
    if (storeData.name !== initialStoreData.name) return true;
    if (storeData.phone !== initialStoreData.phone) return true;
    if (storeData.email !== initialStoreData.email) return true;
    if (storeData.workerId !== initialStoreData.workerId) return true;

    const currentLocation = storeData.location;
    const initialLocation = initialStoreData.location;

    if (currentLocation === null && initialLocation !== null) return true;
    if (currentLocation !== null && initialLocation === null) return true;

    if (currentLocation && initialLocation) {
      if (currentLocation.label !== initialLocation.label) return true;
      if (currentLocation.address !== initialLocation.address) return true;
      if (currentLocation.city !== initialLocation.city) return true;
      if (currentLocation.postalCode !== initialLocation.postalCode)
        return true;
      if (currentLocation.latitude !== initialLocation.latitude) return true;
      if (currentLocation.longitude !== initialLocation.longitude) return true;
    }
    return false;
  };

  const handleSubmit = async (): Promise<void> => {
    const { name, phone, email, location, workerId } = storeData;
    const missingFields: string[] = [];

    if (!name) missingFields.push("Bolt neve");
    if (!phone) missingFields.push("Telefonszám");
    if (!email) missingFields.push("Email");
    if (!location || !location.label) missingFields.push("Cím");
    if (!workerId) missingFields.push("Munkatárs");

    if (
      !storeData.storeId &&
      !storeData.imageBase64 &&
      !storeData.imagePreviewUrl
    ) {
      missingFields.push("Kép");
    }

    if (missingFields.length > 0) {
      setAlert({
        open: true,
        message: `Kérem töltse ki a kötelező mezőket: ${missingFields.join(", ")}`,
        severity: "warning",
      });
      return;
    }

    if (storeData.storeId) {
      if (!haveFieldsChanged()) {
        setAlert({
          open: true,
          message: "Nem történt módosítás.",
          severity: "info",
        });
        setIsEditMode(false);
        return;
      }
    }

    const payload: any = {
      ...(storeData.storeId && { storeId: storeData.storeId }),
      name,
      address: location?.address || location?.label || "",
      city: location?.city || "",
      postalCode: location?.postalCode || "",
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
      phone,
      email,
      workerId: workerId?.toString() || "",
    };
    if (storeData.imageBase64) {
      payload.image = storeData.imageBase64;
    }

    setIsSubmitting(true);

    try {
      const endpoint = storeData.storeId
        ? "/api/v1/updateStore"
        : "/api/v1/createStore";
      const response = await axiosInstance.post(endpoint, payload);
      const successMessage = storeData.storeId
        ? "Bolt sikeresen frissítve!"
        : "Bolt sikeresen létrehozva!";
      setAlert({
        open: true,
        message: successMessage,
        severity: "success",
      });

      const updatedStoreDataFromApi = response?.data?.store;

      let newStoreState: StoreDataType;

      if (updatedStoreDataFromApi && storeData.storeId) {
        const updatedLocation: LocationType = {
          label: updatedStoreDataFromApi.address || "",
          address: updatedStoreDataFromApi.address || "",
          city: updatedStoreDataFromApi.city || "",
          postalCode: updatedStoreDataFromApi.postalCode || "",
          latitude: updatedStoreDataFromApi.latitude,
          longitude: updatedStoreDataFromApi.longitude,
        };
        newStoreState = {
          ...storeData,
          storeId: updatedStoreDataFromApi.storeId || storeData.storeId,
          name: updatedStoreDataFromApi.name,
          phone: updatedStoreDataFromApi.phone,
          email: updatedStoreDataFromApi.email,
          location: updatedLocation,
          workerId: updatedStoreDataFromApi.workerId || storeData.workerId,
          imagePreviewUrl:
            updatedStoreDataFromApi.picture || storeData.imagePreviewUrl,
          imageBase64: null,
        };
      } else {
        newStoreState = {
          ...storeData,
          imageBase64: null,
          storeId: storeData.storeId || response?.data?.storeId || undefined,
        };
      }

      setStoreData(newStoreState);
      setInitialStoreData(newStoreState);

      if (newStoreState.storeId) {
        setIsEditMode(false);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as any)?.response?.data?.message ||
            "Hiba történt a művelet közben.";
      setAlert({
        open: true,
        message: `Mentés sikertelen: ${errorMessage}`,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-700">Adatok betöltése...</p>
          </div>
        </div>
      </div>
    );
  }

  const formDisabled =
    (storeData.storeId && !isEditMode) || isLoading || isSubmitting;

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
              {storeData.storeId ? "Bolt adatai" : "Új bolt létrehozása"}
            </h1>

            {storeData.storeId && !isEditMode ? (
              <button
                className="px-6 py-2 rounded-lg text-white font-medium transition-all bg-black hover:bg-gray-800 active:bg-gray-900"
                onClick={toggleEditMode}
                disabled={isLoading}
              >
                Adatok szerkesztése
              </button>
            ) : (
              <button
                className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
                  isSubmitting
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 active:bg-gray-900"
                }`}
                onClick={handleSubmit}
                disabled={formDisabled}
              >
                {isSubmitting
                  ? storeData.storeId
                    ? "Mentés..."
                    : "Létrehozás..."
                  : storeData.storeId
                    ? "Mentés"
                    : "Bolt létrehozása"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <EditStoreInfo
                onStoreInfoChange={handleStoreInfoChange}
                initialValues={{
                  name: storeData.name,
                  phone: storeData.phone,
                  email: storeData.email,
                  location: storeData.location,
                }}
                disabled={formDisabled}
              />
              <div className="mt-6">
                <EditWorker
                  onWorkerSelect={handleWorkerSelect}
                  selectedWorkerId={storeData.workerId}
                  workersList={workers}
                  disabled={formDisabled}
                />
              </div>
            </div>

            <div className="md:col-span-5">
              <EditImage
                onImageChange={handleImageChange}
                previewUrl={storeData.imagePreviewUrl}
                disabled={formDisabled}
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
                      ? "bg-yellow-500/80 text-black"
                      : "bg-blue-500/80 text-white"
              }`}
            >
              <span>{alert.message}</span>
              <button
                onClick={handleCloseAlert}
                className={`ml-4 ${alert.severity === "warning" ? "text-black hover:text-gray-700" : "text-white hover:text-gray-200"}`}
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
