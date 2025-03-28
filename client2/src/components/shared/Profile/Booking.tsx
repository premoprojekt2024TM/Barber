import { Booking } from "./types";

interface BookingsProps {
  bookings: Booking[];
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

export function Bookings({ bookings }: BookingsProps) {
  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-medium">Foglalásaim</h3>
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white border rounded-lg p-4 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <h4 className="font-medium">{booking.type}</h4>
              <p className="text-sm text-gray-600">
                {translateDay(booking.date)}, {booking.time}
              </p>
              <p className="text-sm text-gray-600 mt-1">{booking.storeName}</p>
              <p className="text-sm text-gray-600 mt-1">
                {booking.cityName} {booking.address}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const translateDay = (day: string): string => {
  return dayTranslations[day] || day;
};

export default Bookings;
