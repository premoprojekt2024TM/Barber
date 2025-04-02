import { useEffect, useRef } from "react";
import { AppointmentPopoverProps } from "./CalenderTypes";

const translateDay = (day: string): string => {
  const dayTranslations: { [key: string]: string } = {
    monday: "Hétfő",
    tuesday: "Kedd",
    wednesday: "Szerda",
    thursday: "Csütörtök",
    friday: "Péntek",
    saturday: "Szombat",
    sunday: "Vasárnap",
  };
  return dayTranslations[day.toLowerCase()] || day;
};

export function AppointmentPopover({
  appointments,
  anchor,
  onClose,
}: AppointmentPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!anchor) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute z-[9999] p-4 rounded-md shadow-md bg-white border border-gray-200"
      style={{
        position: "absolute",
        top: `${anchor.offsetHeight}px`,
        left: "0px",
        minWidth: "300px",
        zIndex: 9999,
      }}
    >
      <h3 className="font-semibold mb-2 text-gray-700">Időpontok</h3>
      <ul>
        {appointments.map((app) => (
          <li
            key={app.appointmentId}
            className="py-2 border-b last:border-b-0 border-gray-200 flex items-center space-x-3"
          >
            <img
              src={app.client.profilePic}
              alt={`${app.client.firstName} ${app.client.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">
                {app.client.lastName} {app.client.firstName}
              </p>
              <p className="text-xs text-gray-600">{app.timeSlot.timeSlot}</p>
              <p className="text-xs text-gray-500">
                {translateDay(app.timeSlot.day)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        onClick={onClose}
      >
        Bezárás
      </button>
    </div>
  );
}
