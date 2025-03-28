import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import Sidebar from "../sidebar";
import AppointmentsTable from "./AppointmentsTable";
import BookingChart from "./Chart";
import { axiosInstance } from "../../../utils/axiosinstance";

const BarberShopDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [appointmentData, setAppointmentData] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreWorkersAndAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/api/v1/stores");

        // Store the full API response
        setApiResponse(response.data);

        // Transform the response data to match the AppointmentsTable expected data structure
        const transformedAppointments = response.data.workers.flatMap(
          (worker) =>
            worker.appointments.map((appointment) => ({
              id: appointment.appointmentId.toString(),
              client: appointment.client,
              barberFirstName: worker.workerFirstName,
              barberLastName: worker.workerLastName,
              day: appointment.day,
              time: appointment.timeSlot,
              completed: appointment.status === "confirmed",
            })),
        );

        setAppointmentData(transformedAppointments);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchStoreWorkersAndAppointments();
  }, []);

  const totalAppointments = appointmentData.length;
  const completedAppointments = appointmentData.filter(
    (a) => a.completed,
  ).length;

  const toggleAppointmentStatus = async (id) => {
    try {
      await axiosInstance.patch(`/api/v1/appointments/${id}/status`);

      setAppointmentData(
        appointmentData.map((appointment) =>
          appointment.id === id
            ? { ...appointment, completed: !appointment.completed }
            : appointment,
        ),
      );
    } catch (err) {
      console.error("Error updating appointment status:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50">
        <div className="text-red-600 text-xl">
          Hiba történt az adatok betöltése közben
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === "Dashboard" ? "Irányítópult" : activeTab}
            </h1>
            <div className="flex items-center gap-3"></div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Összes Foglalás</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {totalAppointments}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Calendar size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Booking chart */}
          {apiResponse && <BookingChart apiResponse={apiResponse} />}

          {/* Appointments Table */}
          <AppointmentsTable
            appointmentData={appointmentData}
            toggleAppointmentStatus={toggleAppointmentStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default BarberShopDashboard;
