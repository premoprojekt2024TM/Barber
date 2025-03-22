// src/pages/barber-shop-dashboard.js

import React, { useState } from "react";
import {
  Calendar,
  Users,
  Check,
  PlusCircle,
  Filter,
  Clock,
} from "lucide-react";
import Sidebar from "../sidebar";
import AppointmentsTable from "./AppointmentsTable"; // Import the new table component

const BarberShopDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [appointmentData, setAppointmentData] = useState([
    {
      id: 1,
      client: "John Smith",
      barber: "Mike Johnson",
      day: "hétfő", // Set directly to "hétfő"
      time: "09:00",
      completed: true,
    },
    {
      id: 2,
      client: "Sarah Williams",
      barber: "Robert Chen",
      day: "hétfő", // Set directly to "hétfő"
      time: "10:30",
      completed: false,
    },
    {
      id: 3,
      client: "David Brown",
      barber: "Mike Johnson",
      day: "hétfő", // Set directly to "hétfő"
      time: "14:00",
      completed: false,
    },
    {
      id: 4,
      client: "Emily Jones",
      barber: "Anna Martinez",
      day: "kedd", // Set directly to "kedd"
      time: "11:00",
      completed: false,
    },
    {
      id: 5,
      client: "Michael Davis",
      barber: "Robert Chen",
      day: "kedd", // Set directly to "kedd"
      time: "15:30",
      completed: false,
    },
  ]);

  const [visitData, setVisitData] = useState([
    { date: "2025-03-15", count: 24 },
    { date: "2025-03-16", count: 18 },
    { date: "2025-03-17", count: 27 },
    { date: "2025-03-18", count: 23 },
    { date: "2025-03-19", count: 29 },
    { date: "2025-03-20", count: 32 },
    { date: "2025-03-21", count: 11 },
  ]);

  const todayVisits =
    visitData.find((d) => d.date === "2025-03-21")?.count || 0;
  const todayAppointments = appointmentData.filter(
    (a) => a.date === "2025-03-21",
  ).length;
  const completedAppointments = appointmentData.filter(
    (a) => a.completed,
  ).length;

  const toggleAppointmentStatus = (id) => {
    setAppointmentData(
      appointmentData.map((appointment) =>
        appointment.id === id
          ? { ...appointment, completed: !appointment.completed }
          : appointment,
      ),
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === "Dashboard" ? "Irányítópult" : activeTab}
            </h1>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-full flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                <PlusCircle size={18} />
                <span>Új időpont</span>
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Mai látogatók</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {todayVisits}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Users size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Mai időpontok</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {todayAppointments}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Calendar size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Befejezett időpontok</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {completedAppointments}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Check size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Visit chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Látogatói statisztika
              </h2>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <span>Heti</span>
                </button>
                <button className="px-3 py-1 text-sm border border-gray-200 bg-indigo-50 text-indigo-600 rounded-md">
                  <span>Havi</span>
                </button>
              </div>
            </div>

            <div className="relative h-64">
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-52">
                {visitData.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-12 bg-indigo-500 rounded-t-md transition-all hover:bg-indigo-600"
                      style={{ height: `${(day.count / 35) * 100}%` }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-500">
                      {day.date.split("-")[2]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
