import { useRef, useEffect } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
);

interface BookingData {
  day: string;
  bookings: number;
}

interface BookingChartProps {
  apiResponse?: any;
}

const BookingChart = ({ apiResponse }: BookingChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const defaultBookingData: BookingData[] = [
    { day: "Hétfő", bookings: 0 },
    { day: "Kedd", bookings: 0 },
    { day: "Szerda", bookings: 0 },
    { day: "Csütörtök", bookings: 0 },
    { day: "Péntek", bookings: 0 },
    { day: "Szombat", bookings: 0 },
    { day: "Vasárnap", bookings: 0 },
  ];

  const calculateBookingsPerDay = (apiResponse: any): BookingData[] => {
    if (!apiResponse || !apiResponse.workers) return defaultBookingData;

    const bookingsPerDay: { [key: string]: number } = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    };

    apiResponse.workers.forEach((worker: any) => {
      worker.appointments.forEach((appointment: any) => {
        const day = appointment.day.toLowerCase();
        if (bookingsPerDay.hasOwnProperty(day)) {
          bookingsPerDay[day]++;
        }
      });
    });

    return [
      { day: "Hétfő", bookings: bookingsPerDay["monday"] },
      { day: "Kedd", bookings: bookingsPerDay["tuesday"] },
      { day: "Szerda", bookings: bookingsPerDay["wednesday"] },
      { day: "Csütörtök", bookings: bookingsPerDay["thursday"] },
      { day: "Péntek", bookings: bookingsPerDay["friday"] },
      { day: "Szombat", bookings: bookingsPerDay["saturday"] },
      { day: "Vasárnap", bookings: bookingsPerDay["sunday"] },
    ];
  };

  const dataToRender = calculateBookingsPerDay(apiResponse);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: dataToRender.map((item) => item.day),
            datasets: [
              {
                label: "Foglalások",
                data: dataToRender.map((item) => item.bookings),
                borderColor: "black",
                borderWidth: 2,
                pointBackgroundColor: "black",
                pointBorderColor: "black",
                pointRadius: 5,
                tension: 0.1,
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: false,
                },
                ticks: {
                  display: false,
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const dataIndex = context.dataIndex;
                    const bookings = context.dataset.data[dataIndex];
                    const day = dataToRender[dataIndex].day;
                    return `${day}: ${bookings} foglalás`;
                  },
                },
                backgroundColor: "rgba(0,0,0,0.7)",
                titleColor: "white",
                bodyColor: "white",
                borderColor: "white",
                borderWidth: 1,
              },
            },
          },
        });
      }
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [dataToRender]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Foglalások</h2>
        <div className="flex items-center gap-2"></div>
      </div>
      <div className="relative h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default BookingChart;
