import { Plus, Minus, Maximize } from "lucide-react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const ZoomControls = ({ onZoomIn, onZoomOut, onReset }: ZoomControlsProps) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md">
      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-gray-50 transition-colors rounded-t-lg"
        aria-label="+"
      >
        <Plus className="h-5 w-5" />
      </button>

      <div className="h-px bg-gray-200" />

      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-gray-50 transition-colors"
        aria-label="-"
      >
        <Minus className="h-5 w-5" />
      </button>

      <div className="h-px bg-gray-200" />

      <button
        onClick={onReset}
        className="p-2 hover:bg-gray-50 transition-colors rounded-b-lg"
        aria-label="Vissza"
      >
        <Maximize className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ZoomControls;
