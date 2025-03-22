import React, { useEffect } from "react";

const Snackbar = ({ open, message, severity, onClose }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  const bgColor =
    severity === "success"
      ? "bg-green-500"
      : severity === "error"
        ? "bg-red-500"
        : severity === "warning"
          ? "bg-yellow-500"
          : "bg-blue-500";

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-md shadow-md z-50 ${bgColor} text-white`}
    >
      {message}
    </div>
  );
};

export default Snackbar;
