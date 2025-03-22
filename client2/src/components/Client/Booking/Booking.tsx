import { useState, useEffect } from "react";
import { Phone, Calendar, MapPin, Mail, ChevronRight } from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";
import { axiosInstance } from "../../../utils/axiosinstance";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../Map/back-button";
import { Store } from "./BookingTypes";

const dayTranslations: { [key: string]: string } = {
  monday: "Hétfő",
  tuesday: "Kedd",
  wednesday: "Szerda",
  thursday: "Csütörtök",
  friday: "Péntek",
  saturday: "Szombat",
  sunday: "Vasárnap",
};

const BookingSystem = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [storeData, setStoreData] = useState<Store | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [availabilityByDay, setAvailabilityByDay] = useState<
    Record<string, string[]>
  >({});

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<{ store: Store }>(
          `/api/v1/store/${storeId}`,
        );
        setStoreData(response.data.store);
        setError(null);
        setLoading(false);
      } catch (err) {
        setError("Nem sikerült betölteni a szalon adatait. Próbálja később");
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  useEffect(() => {
    if (selectedWorker && storeData) {
      const worker = storeData.workers.find(
        (w) => w.workerId === selectedWorker,
      );
      if (worker) {
        const availByDay: Record<string, string[]> = {};

        worker.availability.forEach((slot) => {
          const day = dayTranslations[slot.day] || slot.day;
          if (!availByDay[day]) {
            availByDay[day] = [];
          }
          if (slot.status === "available") {
            availByDay[day].push(slot.timeSlot);
          }
        });

        setAvailabilityByDay(availByDay);
        setSelectedTime(null);
        setSelectedDay(null);
      }
    }
  }, [selectedWorker, storeData]);

  const handleWorkerSelect = (id: number) => {
    setSelectedWorker(id);
    setSelectedTime(null);
    setSelectedDay(null);
  };

  const handleTimeSelect = (day: string, time: string) => {
    setSelectedDay(day);
    setSelectedTime(time);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleBooking = async () => {
    try {
      await axiosInstance.post("/api/v1/booking", {
        storeId,
        workerId: selectedWorker,
        day: selectedDay,
        timeSlot: selectedTime,
      });

      handleCloseDialog();
      setSelectedTime(null);
      setSelectedDay(null);
      alert("Booking confirmed!");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to book appointment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/authbg.png)",
        }}
      >
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex justify-center items-center p-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/authbg.png)",
        }}
      >
        <div className="bg-red-100 bg-opacity-90 backdrop-blur-lg text-red-700 p-4 rounded-lg max-w-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div
        className="min-h-screen flex justify-center items-center p-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/authbg.png)",
        }}
      >
        <div className="bg-red-100 bg-opacity-90 backdrop-blur-lg text-red-700 p-4 rounded-lg max-w-lg">
          Nincs elérhető szalon adat.
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div
        className="flex-1 min-h-screen py-8 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage:
            "url(https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/booking.png)",
        }}
      >
        <div className="absolute top-4 left-4 z-10">
          <BackButton onClick={handleBackClick} />
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-xl shadow-md overflow-hidden border border-white border-opacity-20">
              <div className="h-60 overflow-hidden">
                <img
                  src={storeData.picture || "/placeholder.svg"}
                  alt="Salon interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {storeData.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  A minimalist approach to beauty and style. Our expert team
                  provides top-quality services in a relaxing environment.
                </p>
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <span className="text-gray-500 mr-2">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <span className="text-gray-600">
                      {storeData.address}, {storeData.city},{" "}
                      {storeData.postalCode}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-gray-500 mr-2">
                      <Phone className="h-5 w-5" />
                    </span>
                    <span className="text-gray-600">{storeData.phone}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-gray-500 mr-2">
                      <Mail className="h-5 w-5" />
                    </span>
                    <span className="text-gray-600">{storeData.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-xl shadow-md overflow-hidden border border-white border-opacity-20">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Foglalj időpontot
                </h2>
                <p className="text-gray-600 mb-4">
                  Válasszon egy szakembert az elérhető időpontok megtekintéséhez
                </p>

                <div className="mb-8">
                  <div className="flex flex-wrap gap-4">
                    {storeData.workers.map((worker) => (
                      <div
                        key={worker.workerId}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => handleWorkerSelect(worker.workerId)}
                      >
                        <div
                          className={`w-16 h-16 rounded-full overflow-hidden ${
                            selectedWorker === worker.workerId
                              ? "border-2 border-black"
                              : ""
                          }`}
                        >
                          <img
                            src={worker.workerImage || "/placeholder.svg"}
                            alt={worker.workerUsername}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="mt-2 font-medium text-sm">
                          {worker.workerLastName} {worker.workerFirstName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedWorker && (
                  <>
                    <div className="h-px bg-gray-200 my-6"></div>
                    <div className="flex items-center mb-4">
                      <span className="text-gray-500 mr-2">
                        <Calendar className="h-5 w-5" />
                      </span>
                      <h3 className="font-semibold">Elérhető időpontok</h3>
                    </div>

                    <div className="mt-6">
                      {Object.keys(availabilityByDay).length > 0 ? (
                        Object.entries(availabilityByDay).map(
                          ([day, times]) => (
                            <div key={day} className="mb-6">
                              <h4 className="font-medium mb-2">{day}</h4>
                              <div className="flex flex-wrap gap-2">
                                {times.map((time) => (
                                  <button
                                    key={`${day}-${time}`}
                                    className={`px-3 py-1 text-sm border border-gray-200 rounded-md transition-colors ${
                                      selectedDay === day &&
                                      selectedTime === time
                                        ? "bg-black text-white border-black"
                                        : "bg-white bg-opacity-80 backdrop-blur-sm hover:bg-gray-100"
                                    }`}
                                    onClick={() => handleTimeSelect(day, time)}
                                  >
                                    {time}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ),
                        )
                      ) : (
                        <div className="bg-gray-50 bg-opacity-90 backdrop-blur-lg text-gray-800 p-3 rounded-md">
                          Nincs elérhető időpont ennél a szakembernél.
                        </div>
                      )}
                    </div>

                    {selectedTime && (
                      <div className="mt-8">
                        <button
                          className="w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors"
                          onClick={handleOpenDialog}
                        >
                          Foglalás {selectedDay} {selectedTime}
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleBooking}
        selectedWorker={selectedWorker}
        selectedDay={selectedDay}
        selectedTime={selectedTime}
        storeData={storeData}
      />
    </div>
  );
};

export default BookingSystem;
