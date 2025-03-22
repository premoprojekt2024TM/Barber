import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
      aria-label="Menj vissza."
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
};

export default BackButton;
