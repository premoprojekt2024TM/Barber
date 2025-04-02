import { useEffect } from "react";

interface SnackbarProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

const Snackbar = (props: SnackbarProps) => {
  const { open, message, severity, onClose } = props;

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) {
    return null;
  }

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
