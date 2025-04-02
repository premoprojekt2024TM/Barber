import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PopoverProps } from "./MapTypes";

function Popover({ popoverInfo, handleClose }: PopoverProps) {
  const navigate = useNavigate();

  if (!popoverInfo.visible) return null;

  const handleBookAppointment = () => {
    navigate(`/booking/${popoverInfo.storeId}`);
  };

  return (
    <div className="absolute left-5 top-5 w-[350px] max-w-[90%] z-[1000] overflow-hidden rounded-lg shadow-lg bg-white pointer-events-auto">
      <div className="relative">
        <img
          src={popoverInfo.picture || "/placeholder.svg"}
          alt={popoverInfo.title}
          className="w-full h-[200px] object-cover"
        />
        <button
          className="absolute top-2.5 right-2.5 min-w-[30px] w-[30px] h-[30px] p-0 bg-white text-black rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5">
        <h2 className="text-xl font-bold">{popoverInfo.city}</h2>
        <p className="mb-4">{popoverInfo.address}</p>
        <p className="text-sm text-gray-500">Cím: {popoverInfo.address}</p>
        <p className="text-sm text-gray-500">
          Telefonszám: {popoverInfo.phone}
        </p>
        <p className="text-sm text-gray-500 mb-4">Email: {popoverInfo.email}</p>

        <button
          className="w-full mt-6 mb-1 py-2 px-4 bg-black  text-white font-medium rounded-lg transition-colors"
          onClick={handleBookAppointment}
        >
          Időpont foglalása
        </button>
      </div>
    </div>
  );
}

export default Popover;
