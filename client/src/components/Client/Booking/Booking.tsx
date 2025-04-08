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

const reverseDayTranslations: { [key: string]: string } = Object.fromEntries(
  Object.entries(dayTranslations).map(([eng, hun]) => [hun, eng]),
);

const dayOrder: { [key: string]: number } = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
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
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<
    number | null
  >(null);

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
  }, [storeId, bookingSuccess]);

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

        const sortedAvailability: Record<string, string[]> = Object.fromEntries(
          Object.entries(availByDay).sort(([dayA], [dayB]) => {
            const englishDayA = reverseDayTranslations[dayA] || dayA;
            const englishDayB = reverseDayTranslations[dayB] || dayB;

            return (dayOrder[englishDayA] || 7) - (dayOrder[englishDayB] || 7);
          }),
        );

        setAvailabilityByDay(sortedAvailability);
        setSelectedTime(null);
        setSelectedDay(null);
        setSelectedAvailabilityId(null);
      }
    }
  }, [selectedWorker, storeData, bookingSuccess]);

  const handleWorkerSelect = (id: number) => {
    setSelectedWorker(id);
    setSelectedTime(null);
    setSelectedDay(null);
    setSelectedAvailabilityId(null);
  };

  const handleTimeSelect = (day: string, time: string) => {
    if (selectedWorker && storeData) {
      const worker = storeData.workers.find(
        (w) => w.workerId === selectedWorker,
      );
      if (worker) {
        const englishDay = reverseDayTranslations[day] || day;

        const foundAvailability = worker.availability.find(
          (slot) =>
            slot.day === englishDay &&
            slot.timeSlot === time &&
            slot.status === "available",
        );

        if (foundAvailability) {
          setSelectedAvailabilityId(foundAvailability.availabilityId);
        } else {
          setSelectedAvailabilityId(null);
        }
      }
    }

    setSelectedDay(day);
    setSelectedTime(time);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleBooking = () => {
    setBookingSuccess(true);
    setSelectedTime(null);
    setSelectedDay(null);
    setSelectedAvailabilityId(null);
  };

  const handleBookingSuccessful = () => {
    setBookingSuccess(!bookingSuccess);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:items-start">
            <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-xl shadow-md overflow-hidden border border-white border-opacity-20 md:h-[500px] md:self-start md:sticky md:top-4">
              <div className="h-60 overflow-hidden">
                <img
                  src={storeData.picture}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:overflow-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {storeData.name}
                </h2>
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
                    <span className="text-gray-600">+36 {storeData.phone}</span>
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
                            alt={worker.WorkerUsername}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="mt-2 font-medium text-sm">
                          {worker.WorkerLastName} {worker.WorkerFirstName}
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
                          ([hunDay, times]) => (
                            <div key={hunDay} className="mb-6">
                              <h4 className="font-medium mb-2">{hunDay}</h4>
                              <div className="flex flex-wrap gap-2">
                                {times.map((time) => {
                                  return (
                                    <button
                                      key={`${hunDay}-${time}`}
                                      className={`px-3 py-1 text-sm border border-gray-200 rounded-md transition-colors ${
                                        selectedDay === hunDay &&
                                        selectedTime === time
                                          ? "bg-black text-white border-black"
                                          : "bg-white bg-opacity-80 backdrop-blur-sm hover:bg-gray-100"
                                      }`}
                                      onClick={() =>
                                        handleTimeSelect(hunDay, time)
                                      }
                                    >
                                      {time}
                                    </button>
                                  );
                                })}
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
                          Foglalás{" "}
                          {dayTranslations[
                            reverseDayTranslations[selectedDay || ""] || ""
                          ] || selectedDay}{" "}
                          {selectedTime}
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </button>
                      </div>
                    )}
                    {bookingSuccess && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md">
                        Sikeres foglalás!
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
        onBookingSuccessful={handleBookingSuccessful}
        selectedAvailabilityId={selectedAvailabilityId}
      />
    </div>
  );
};

export default BookingSystem;
