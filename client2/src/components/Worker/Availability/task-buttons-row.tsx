"use client";

import { useState } from "react";
import { useTodos } from "./todo-store";
import { AlertCircle, CheckCircle } from "lucide-react";

export function TaskButtonsRow() {
  const todos = useTodos((store) => store.todos);
  const createAvailability = useTodos((store) => store.createAvailability);
  const loading = useTodos((store) => store.loading);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"save" | "create">("save");

  const handleListTasks = () => {
    const taskList = Object.keys(todos).map((day) => {
      const tasks = todos[day as keyof typeof todos];
      const timeSlots = tasks.map((task) => task.title);
      return `${day.charAt(0).toUpperCase() + day.slice(1)}: [${timeSlots.join(", ")}]`;
    });

    alert(taskList.join("\n"));
  };

  const handleCreateAvailability = async () => {
    try {
      await createAvailability();
      setCreateSuccess(true);
    } catch (error) {
      setActionError("Failed to create availability");
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
      <div className="flex flex-row justify-between mb-4">
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
            onClick={handleListTasks}
          >
            List All Tasks
          </button>
          <button
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => openConfirmDialog("save")}
            disabled={loading}
          >
            Elküldöm
          </button>
        </div>
      </div>

      {/* Success Notifications */}
      {saveSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center">
          <CheckCircle className="mr-2" size={20} />
          <span>Availability saved successfully!</span>
          <button
            onClick={() => setSaveSuccess(false)}
            className="ml-4 text-green-700 hover:text-green-900"
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      )}

      {createSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center">
          <CheckCircle className="mr-2" size={20} />
          <span>Availability created successfully!</span>
          <button
            onClick={() => setCreateSuccess(false)}
            className="ml-4 text-green-700 hover:text-green-900"
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Error Notification */}
      {actionError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <span>{actionError}</span>
          <button
            onClick={() => setActionError(null)}
            className="ml-4 text-red-700 hover:text-red-900"
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">
              {actionType === "save"
                ? "Save Availability"
                : "Create Availability"}
            </h3>
            <p className="text-gray-600 mb-4">
              {actionType === "save"
                ? "Are you sure you want to save your current availability?"
                : "Are you sure you want to create these time slots as your availability?"}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
