import type React from "react";
import type { AppointmentPopoverProps as AppointmentPopoverPropsType } from "./hairdresser";
import { Clock, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../utils/axiosinstance";

const dayTranslations: Record<string, string> = {
  monday: "Hétfő",
  tuesday: "Kedd",
  wednesday: "Szerda",
  thursday: "Csütörtök",
  friday: "Péntek",
  saturday: "Szombat",
  sunday: "Vasárnap",
};


const dayOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface AppointmentPopoverProps extends AppointmentPopoverPropsType {}

export default function AppointmentPopover({
  hairdresser,
  position,
  onClose,
}: AppointmentPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverStyles, setPopoverStyles] = useState<React.CSSProperties>({});
  const [storeId, setStoreId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    const fetchWorkerStore = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/worker/${hairdresser.id}/store`,
        );

        if (response.data.store) {
          setStoreId(response.data.store.storeId);
        } else {
          setError("Nem dolgozik jelenleg ez a fodrász");
        }
      } catch (err) {
        setError("Nem sikerült lekérdezni a bolt információt.");
      }
    };

    fetchWorkerStore();
  }, [hairdresser.id]);

  useEffect(() => {
    if (hairdresser.availability) {
      const days = Object.entries(hairdresser.availability)
        .filter(([_, daySlots]) =>
          (daySlots as any[]).some((slot) => slot.status === "available"),
        )
        .map(([day]) => day)
        .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

      setAvailableDays(days);
      setCurrentDayIndex(days.length > 0 ? 0 : -1);
    }
  }, [hairdresser.availability]);

  const currentDay = availableDays[currentDayIndex];
  const currentDayTimes =
    currentDay && hairdresser.availability?.[currentDay]
      ? (hairdresser.availability[currentDay] as any[])
          .filter((slot) => slot.status === "available")
          .map((slot) => slot.timeSlot)
      : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (!popoverRef.current) return;
    const viewportWidth = window.innerWidth;
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const popoverWidth = popoverRect.width;
    let left = position.x;
    let top = position.y + 20;
    if (left + popoverWidth / 2 > viewportWidth) {
      left = viewportWidth - popoverWidth / 2 - 20;
    }

    if (left - popoverWidth / 2 < 0) {
      left = popoverWidth / 2 + 20;
    }

    setPopoverStyles({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      transform: "translate(-50%, 0)",
      zIndex: 50,
    });
  }, [position]);

  const handleBooking = () => {
    if (storeId) {
      navigate(`/booking/${storeId}`);
    }
  };

  const goToPreviousDay = () => {
    setCurrentDayIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextDay = () => {
    setCurrentDayIndex((prev) =>
      prev < availableDays.length - 1 ? prev + 1 : prev,
    );
  };

  return (
    <div
      ref={popoverRef}
      className="bg-white rounded-lg shadow-xl p-4 w-72 absolute"
      style={popoverStyles}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            src={hairdresser.profilePic}
            alt={`${hairdresser.name}'s profile`}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h3 className="font-bold text-gray-900">{hairdresser.name}</h3>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      <div>
        <div className="flex items-center mb-3">
          <Clock size={16} className="text-gray-400 mr-2" />
          <h4 className="font-medium text-gray-800">Elérhető időpontok:</h4>
        </div>

        {availableDays.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={goToPreviousDay}
                disabled={currentDayIndex === 0}
                className={`p-1 rounded-full ${
                  currentDayIndex === 0
                    ? "text-gray-300"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="text-sm font-medium text-gray-800">
                {dayTranslations[currentDay] || currentDay}
              </div>

              <button
                onClick={goToNextDay}
                disabled={currentDayIndex === availableDays.length - 1}
                className={`p-1 rounded-full ${
                  currentDayIndex === availableDays.length - 1
                    ? "text-gray-300"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            
            {currentDayTimes.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {currentDayTimes.map((time, index) => (
                  <button
                    key={index}
                    className="py-1 px-2 text-sm rounded-full text-center bg-black text-white hover:bg-gray-800"
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 italic py-2">
                Nincs elérhető időpont ezen a napon
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 italic py-4">
            Jelenleg nincs elérhető időpont
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        {error ? (
          <div className="text-red-500 text-center mb-2">{error}</div>
        ) : (
          <button
            onClick={handleBooking}
            disabled={!storeId || availableDays.length === 0}
            className={`
              w-full rounded-full py-2 px-4 font-medium transition-colors text-sm
              ${
                storeId && availableDays.length > 0
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Foglalás
          </button>
        )}
      </div>
    </div>
  );
}
