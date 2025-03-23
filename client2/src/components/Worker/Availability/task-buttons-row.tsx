import { useState } from "react";
import { useTodos } from "./todo-store";

export function TaskButtonsRow() {
  const createAvailability = useTodos((store) => store.createAvailability);
  const loading = useTodos((store) => store.loading);

  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"save" | "create">("save");

  const handleCreateAvailability = async () => {
    try {
      await createAvailability();
    } catch (error) {
      setActionError("Nem sikerült létrehozni az időpontot");
    }
  };

  const handleConfirmAction = () => {
    setConfirmDialogOpen(false);
    if (actionType === "save") {
      handleCreateAvailability();
    }
  };

  const openConfirmDialog = (type: "save" | "create") => {
    setActionType(type);
    setConfirmDialogOpen(true);
  };

  return (
    <>
      <div className="flex flex-row justify-end  mb-4">
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-black text-white rounded-xl mr-3"
            onClick={() => openConfirmDialog("save")}
            disabled={loading}
          >
            Elküldöm
          </button>
        </div>
      </div>

      {confirmDialogOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-white/30">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {actionType === "save"
                  ? "Erősitsd meg az időpont mentését"
                  : "Erősitsd meg az időpont létrehozását"}
              </h3>
              <p className="text-gray-600 mb-4">
                {actionType === "save"
                  ? "Biztosan szeretnéd menteni a jelenlegi időpontot?"
                  : "Biztosan szeretnéd létrehozni ezeket az időpontokat?"}
              </p>

              {actionError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                  {actionError}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 px-4 py-3 bg-white/90">
              <button
                onClick={() => setConfirmDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
                disabled={loading}
              >
                Mégsem
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-black text-white rounded-md transition-colors flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
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
                ) : actionType === "save" ? (
                  "Megerősít"
                ) : (
                  "Létrehozás"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
