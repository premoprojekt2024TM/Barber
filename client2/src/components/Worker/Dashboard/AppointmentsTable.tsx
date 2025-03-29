import { useState } from "react";
import { Clock } from "lucide-react";

interface Client {
  profilePic: string;
  username: string;
  lastName: string;
  firstName: string;
}

interface Appointment {
  id: string;
  client: Client | null;
  barberFirstName: string;
  barberLastName: string;
  day: string;
  time: string;
  completed: boolean;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface AppointmentsTableProps {
  appointmentData: Appointment[];
  // Made toggleAppointmentStatus optional with ? operator
  toggleAppointmentStatus?: (id: string) => void;
}

const dayTranslations: { [key: string]: string } = {
  monday: "Hétfő",
  tuesday: "Kedd",
  wednesday: "Szerda",
  thursday: "Csütörtök",
  friday: "Péntek",
  saturday: "Szombat",
  sunday: "Vasárnap",
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 shadow-md border border-white/20">
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
            currentPage === pageNumber
              ? "bg-black text-white"
              : "bg-white/50 text-slate-700 hover:bg-slate-100"
          }`}
        >
          {pageNumber}
        </button>
      ))}
    </div>
  );
};

const AppointmentsTable = ({
  appointmentData,
  toggleAppointmentStatus,
}: AppointmentsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 4;

  const dayOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const translateDay = (day: string) => {
    return dayTranslations[day.toLowerCase()] || day;
  };

  const sortedAppointmentData = [...appointmentData].sort((a, b) => {
    const dayAIndex = dayOrder.indexOf(a.day.toLowerCase());
    const dayBIndex = dayOrder.indexOf(b.day.toLowerCase());

    if (dayAIndex !== dayBIndex) {
      return dayAIndex - dayBIndex;
    } else {
      return a.time.localeCompare(b.time);
    }
  });

  // Calculate pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = sortedAppointmentData.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment,
  );

  const totalPages = Math.ceil(
    sortedAppointmentData.length / appointmentsPerPage,
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Időpontok</h2>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ügyfél
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fodrász
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nap
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Időpont
              </th>
              {toggleAppointmentStatus && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Állapot
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentAppointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {appointment.client ? (
                      <>
                        <div className="h-8 w-8 rounded-full overflow-hidden relative flex-shrink-0">
                          <img
                            className="object-cover w-full h-full"
                            src={appointment.client.profilePic}
                            alt={`${appointment.client.firstName} ${appointment.client.lastName}`}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.client.lastName}{" "}
                            {appointment.client.firstName}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">Nincs Kliens</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {appointment.barberLastName} {appointment.barberFirstName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {translateDay(appointment.day)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Clock size={16} className="mr-1 text-gray-400" />
                    {appointment.time}
                  </div>
                </td>
                {toggleAppointmentStatus && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAppointmentStatus(appointment.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.completed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.completed ? "Teljesítve" : "Folyamatban"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;
