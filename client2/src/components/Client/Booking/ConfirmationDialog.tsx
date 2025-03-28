import { useState } from "react";
import { ConfirmationDialogProps } from "./BookingTypes";
import { axiosInstance, getInfoFromToken } from "../../../utils/axiosinstance";

interface ExtendedConfirmationDialogProps extends ConfirmationDialogProps {
  onBookingSuccessful: () => void;
  selectedAvailabilityId: number | null;
}

function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedWorker,
  selectedDay,
  selectedTime,
  storeData,
  onBookingSuccessful,
  selectedAvailabilityId,
}: ExtendedConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBookingConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userInfo = getInfoFromToken();
      if (!userInfo || !userInfo.userId) {
        setError("Nincs megfelelő felhasználói adat. Kérem lépjen be ismét.");
        setIsLoading(false);
        return;
      }
      //@ts-ignore
      const response = await axiosInstance.post("/api/v1/createAppointment", {
        workerId: selectedWorker,
        clientId: userInfo.userId,
        availabilityId: selectedAvailabilityId,
      });

      setIsLoading(false);
      onConfirm();
      onBookingSuccessful();
      onClose();
    } catch (error) {
      setError("Siketelen foglalás. Kérem próbálja később.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-white/30">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Erősitsd meg a foglalásod</h3>
          {selectedWorker && storeData && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-gray-500">Szakember:</div>
              <div className="text-gray-800 col-span-2">
                {
                  storeData.workers.find((w) => w.workerId === selectedWorker)
                    ?.WorkerLastName
                }{" "}
                {
                  storeData.workers.find((w) => w.workerId === selectedWorker)
                    ?.WorkerFirstName
                }
              </div>
              <div className="text-gray-500">Nap:</div>
              <div className="text-gray-800 col-span-2">{selectedDay}</div>
              <div className="text-gray-500">Idő:</div>
              <div className="text-gray-800 col-span-2">{selectedTime}</div>
              <div className="text-gray-500">Helyszín:</div>
              <div className="text-gray-800 col-span-2">
                {storeData.address}, {storeData.city}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 px-4 py-3 bg-white/90">
          <button
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            Mégsem
          </button>
          <button
            className="px-4 py-2 bg-black text-white rounded-md transition-colors flex items-center justify-center"
            onClick={handleBookingConfirm}
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
                Folyamatban...
              </>
            ) : (
              "Időpont lefoglalása"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;
