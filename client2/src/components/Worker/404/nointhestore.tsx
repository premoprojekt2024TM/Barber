import { PlusCircle, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";

export default function NotInStorePage() {
  const navigate = useNavigate();
  const handleCreateStore = () => {
    navigate("/store");
  };
  const handleAddFriends = () => {
    navigate("/search");
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0" />
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md  mx-4 relative">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Nincs Üzlet-hozzáférése
              </h1>
              <h2 className="text-xl text-gray-700">
                Ön jelenleg nem tagja egyetlen üzletnek sem
              </h2>
            </div>
            <div className="py-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400"
                  >
                    <path d="M13 16H11V18H13V16Z" fill="currentColor" />
                    <path
                      d="M12 6C11.4477 6 11 6.44772 11 7V13C11 13.5523 11.4477 14 12 14C12.5523 14 13 13.5523 13 13V7C13 6.44772 12.5523 6 12 6Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="text-center text-gray-600 max-w-xs">
                  Önnek új üzletet kell létrehoznia, vagy csatlakoznia kell egy
                  meglévőhöz meghívás útján a funkció eléréséhez.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <button
                className="w-full bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center gap-2 py-5 px-4 font-medium transition-colors"
                onClick={handleCreateStore}
              >
                <PlusCircle size={18} />
                Új üzlet létrehozása
              </button>
              <button
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-full flex items-center justify-center gap-2 py-5 px-4 font-medium transition-colors"
                onClick={handleAddFriends}
              >
                <UserPlus size={18} />
                Barátok hozzáadása
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
