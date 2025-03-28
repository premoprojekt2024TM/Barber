import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronUp, ChevronDown } from "lucide-react";
import Sidebar from "../sidebar";
import { axiosInstance } from "../../../utils/axiosinstance";
import { AppointmentPopover } from "./Popover";
import { Appointment } from "./CalenderTypes";

interface DayNameMap {
  [key: string]: string;
}

const dayNameMap: DayNameMap = {
  monday: "Hétfő",
  tuesday: "Kedd",
  wednesday: "Szerda",
  thursday: "Csütörtök",
  friday: "Péntek",
  saturday: "Szombat",
  sunday: "Vasárnap",
};

const ALL_HOURS = Array.from({ length: 25 }, (_, i) => i);
const DAYS_OF_WEEK = [
  "Hétfő",
  "Kedd",
  "Szerda",
  "Csütörtök",
  "Péntek",
  "Szombat",
  "Vasárnap",
];
const DISPLAY_LENGTH = 9;
const HEADER_ROW_HEIGHT = "h-14";
const TIME_SLOT_HEIGHT = "h-10";

interface ClusteredAppointments {
  [key: string]: Appointment[];
}

export default function AppointmentCalendar() {
  const [startHour, setStartHour] = useState(8);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [popoverAppointments, setPopoverAppointments] = useState<Appointment[]>(
    [],
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const endHourIndex = Math.min(startHour + DISPLAY_LENGTH, ALL_HOURS.length);
  const visibleHours = ALL_HOURS.slice(startHour, endHourIndex);

  const timeColumnRef = useRef<HTMLDivElement>(null);

  const handleScrollUp = () => {
    setStartHour((prev) => Math.max(0, prev - 1));
  };

  const handleScrollDown = () => {
    setStartHour((prev) =>
      Math.min(ALL_HOURS.length - DISPLAY_LENGTH, prev + 1),
    );
  };

  const isUpDisabled = startHour === 0;
  const isDownDisabled = startHour >= ALL_HOURS.length - DISPLAY_LENGTH;

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const deltaY = e.deltaY;
    const scrollSensitivity = 0.3;
    let newStartHour = startHour - Math.round(deltaY * scrollSensitivity);

    newStartHour = Math.max(
      0,
      Math.min(newStartHour, ALL_HOURS.length - DISPLAY_LENGTH),
    );

    setStartHour(newStartHour);
  };

  useEffect(() => {
    const timeColumn = timeColumnRef.current;
    if (timeColumn) {
      timeColumn.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        timeColumn.removeEventListener("wheel", handleWheel);
      };
    }
  }, [startHour]);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/api/v1/appointment");
        const appointmentsData: Appointment[] =
          response.data?.appointments || [];
        setAppointments(appointmentsData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const clusterAppointments = (): ClusteredAppointments => {
    const clustered: ClusteredAppointments = {};

    appointments.forEach((app) => {
      const appointmentHour = parseInt(app.timeSlot.timeSlot.split(":")[0], 10);
      const appointmentDay =
        (dayNameMap as any)[app.timeSlot.day] || app.timeSlot.day;

      const key = `${appointmentDay}-${appointmentHour}`;

      if (!clustered[key]) {
        clustered[key] = [];
      }
      clustered[key].push(app);
    });

    return clustered;
  };

  const clusteredAppointments = clusterAppointments();

  const handleOpenPopover = (
    event: React.MouseEvent<HTMLElement>,
    appointments: Appointment[],
  ) => {
    setPopoverAnchor(event.currentTarget as HTMLElement);
    setPopoverAppointments(appointments);
    setIsPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
    setPopoverAppointments([]);
  };

  useEffect(() => {
    if (!isPopoverOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverAnchor &&
        !popoverAnchor.contains(event.target as Node) &&
        isPopoverOpen
      ) {
        handleClosePopover();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopoverOpen, popoverAnchor]);

  const findNearestAppointment = (
    appointments: Appointment[],
    hour: number,
  ): Appointment | null => {
    if (!appointments || appointments.length === 0) {
      return null;
    }

    let nearestAppointment = appointments[0];
    let minDifference = Math.abs(
      hour - parseInt(appointments[0].timeSlot.timeSlot.split(":")[0], 10),
    );

    for (let i = 1; i < appointments.length; i++) {
      const appointment = appointments[i];
      const appointmentHour = parseInt(
        appointment.timeSlot.timeSlot.split(":")[0],
        10,
      );
      const difference = Math.abs(hour - appointmentHour);

      if (difference < minDifference) {
        minDifference = difference;
        nearestAppointment = appointment;
      }
    }

    return nearestAppointment;
  };

  const AvatarStack = ({ appointments }: { appointments: Appointment[] }) => {
    const displayAppointments = appointments.slice(0, 3);

    return (
      <div className="flex -space-x-1.5">
        {displayAppointments.map((app, index) => (
          <img
            key={app.appointmentId}
            src={app.client.profilePic}
            alt={`${app.client.firstName} ${app.client.lastName}`}
            className="w-5 h-5 rounded-full border object-cover"
            style={{ zIndex: 3 - index }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-white">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto backdrop-blur-xl bg-white/80 rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-white to-gray-50 p-3 backdrop-blur-md border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-700" size={20} />
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-500">
                  Naptár
                </h1>
              </div>
            </div>
          </div>
          <div className="flex">
            <div
              className="w-24 flex flex-col border-r border-gray-100 bg-gray-50/30 shrink-0"
              ref={timeColumnRef}
            >
              <div
                className={`flex items-center justify-center p-2 border-b border-gray-100 ${HEADER_ROW_HEIGHT}`}
              >
                <button
                  onClick={handleScrollUp}
                  className="bg-gray-100 hover:bg-gray-200 rounded-full p-1 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  disabled={isUpDisabled}
                  aria-label="Scroll time up"
                >
                  <ChevronUp size={16} className="text-gray-600" />
                </button>
              </div>

              <div className="flex-grow">
                {visibleHours.map((hour) => (
                  <div
                    key={`time-${hour}`}
                    className={`flex items-center justify-center px-2 border-b border-gray-100 last:border-b-0 ${TIME_SLOT_HEIGHT}`}
                  >
                    <div className="w-full text-center backdrop-blur-xl rounded-lg border border-gray-100 bg-gradient-to-r from-gray-100/40 to-white/40 py-1">
                      <span className="text-xs text-gray-700">
                        {`${hour.toString().padStart(2, "0")}:00`}
                      </span>
                    </div>
                  </div>
                ))}
                {Array.from({
                  length: DISPLAY_LENGTH - visibleHours.length,
                }).map((_, index) => (
                  <div
                    key={`fill-time-${index}`}
                    className={`flex items-center justify-center px-2 border-b border-gray-100 last:border-b-0 ${TIME_SLOT_HEIGHT}`}
                  >
                    <div className="w-full h-full"></div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center p-2 border-t border-gray-100">
                <button
                  onClick={handleScrollDown}
                  className="bg-gray-100 hover:bg-gray-200 rounded-full p-1 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  disabled={isDownDisabled}
                  aria-label="Scroll time down"
                >
                  <ChevronDown size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-7 border-b border-gray-100 sticky top-0 z-10 bg-white/60 backdrop-blur-sm">
                  {DAYS_OF_WEEK.map((day) => (
                    <div
                      key={day}
                      className={`p-2 text-center border-r last:border-r-0 border-gray-100 flex items-center justify-center ${HEADER_ROW_HEIGHT}`}
                    >
                      <p className="font-bold text-gray-700 text-xs">{day}</p>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  {visibleHours.map((hour) => (
                    <div
                      key={`row-${hour}`}
                      className="grid grid-cols-7 border-b border-gray-100 last:border-b-0"
                    >
                      {DAYS_OF_WEEK.map((day) => {
                        const key = `${day}-${hour}`;
                        const appointmentsForSlot =
                          clusteredAppointments[key] || [];
                        const appointmentCount = appointmentsForSlot.length;
                        const nearestAppointment = findNearestAppointment(
                          appointmentsForSlot,
                          hour,
                        );

                        return (
                          <div
                            key={`${day}-${hour}`}
                            className={`relative border-r last:border-r-0 border-gray-100 ${TIME_SLOT_HEIGHT}`}
                          >
                            {appointmentCount > 0 ? (
                              <button
                                className="w-full h-full text-left p-1 bg-gray-700 hover:bg-gray-800 transition-colors text-white flex items-center justify-center space-x-1"
                                onClick={(event) =>
                                  handleOpenPopover(event, appointmentsForSlot)
                                }
                              >
                                <span className="text-xs text-white font-medium leading-tight whitespace-nowrap text-ellipsis overflow-hidden">
                                  {nearestAppointment?.client.firstName}
                                </span>
                                {appointmentCount > 1 && (
                                  <AvatarStack
                                    appointments={appointmentsForSlot}
                                  />
                                )}
                              </button>
                            ) : (
                              <div className="backdrop-blur-sm bg-white/20 hover:bg-gray-50/50 transition-colors cursor-pointer h-full w-full"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  {Array.from({
                    length: DISPLAY_LENGTH - visibleHours.length,
                  }).map((_, index) => (
                    <div
                      key={`fill-row-${index}`}
                      className="grid grid-cols-7 border-b border-gray-100 last:border-b-0"
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <div
                          key={`fill-cell-${day}-${index}`}
                          className={`relative border-r last:border-r-0 border-gray-100 bg-gray-50/10 ${TIME_SLOT_HEIGHT}`}
                        >
                          <div className="h-full w-full"></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {isPopoverOpen && popoverAnchor && (
            <AppointmentPopover
              appointments={popoverAppointments}
              anchor={popoverAnchor}
              onClose={handleClosePopover}
            />
          )}
        </div>
      </div>
    </div>
  );
}
