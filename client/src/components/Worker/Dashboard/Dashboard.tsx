import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import Sidebar from "../sidebar";
import AppointmentsTable from "./AppointmentsTable";
import BookingChart from "./Chart";
import { axiosInstance } from "../../../utils/axiosinstance";

interface Client {
  profilePic: string;
  username: string;
  lastName: string;
  firstName: string;
}

interface Appointment {
  appointmentId: number;
  client: Client;
  day: string;
  timeSlot: string;
  status: string;
}

interface Worker {
  workerFirstName: string;
  workerLastName: string;
  appointments: Appointment[];
}

interface ApiResponse {
  workers: Worker[];
}

interface TransformedAppointment {
  id: string;
  client: Client | null;
  barberFirstName: string;
  barberLastName: string;
  day: string;
  time: string;
  completed: boolean;
}

const DashboardStats = ({
  totalAppointments,
}: {
  totalAppointments: number;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
  );
};

const BarberShopDashboard = (): React.ReactElement => {
  const [appointmentData, setAppointmentData] = useState<
    TransformedAppointment[]
  >([]);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStoreWorkersAndAppointments = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<ApiResponse>("/api/v1/stores");
        setApiResponse(response.data);

        const transformedAppointments = response.data.workers.flatMap(
          (worker: Worker) =>
            worker.appointments.map((appointment: Appointment) => ({
              id: appointment.appointmentId.toString(),
              client: appointment.client,
              barberFirstName: worker.workerFirstName,
              barberLastName: worker.workerLastName,
              day: appointment.day,
              time: appointment.timeSlot,
              completed:
                appointment.status === "completed" ||
                appointment.status === "confirmed",
            })),
        );

        setAppointmentData(transformedAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreWorkersAndAppointments();
  }, []);

  const totalAppointments = appointmentData.length;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Adatok betöltése...</p>
        </div>
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 pb-16">
            <DashboardStats totalAppointments={totalAppointments} />
            {apiResponse && <BookingChart apiResponse={apiResponse} />}
            <AppointmentsTable appointmentData={appointmentData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberShopDashboard;
