import type React from "react";
import type { Hairdresser } from "./hairdresser";

interface HairdresserBubbleProps {
  hairdresser: Hairdresser;
  onClick: (e: React.MouseEvent) => void;
  isSelected: boolean;
}

export default function HairdresserBubble({
  hairdresser,
  onClick,
  isSelected,
}: HairdresserBubbleProps) {
  return (
    <div
      className={`bubble-item w-full h-full rounded-full flex flex-col items-center justify-center
        ${
          isSelected
            ? "bg-black text-white shadow-lg scale-105"
            : "bg-white text-gray-800 shadow hover:shadow-md hover:scale-105"
        }
        transition-all duration-200 cursor-pointer select-none border border-gray-100`}
      onClick={onClick}
    >
      <div className={`w-8 h-8 rounded-full mb-1 overflow-hidden`}>
        <img
          src={hairdresser.profilePic}
          alt={`${hairdresser.name}'s profile`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-xs font-medium">{hairdresser.name}</div>
    </div>
  );
}
