"use client";
import { ArrowLeft, LogOut, PlusCircle } from "lucide-react";
import Sidebar from "../sidebar";

export default function NoEditRightsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <div className="bg-gradient-to-b from-white to-gray-50 w-full h-full" />
        </div>
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md z-10 mx-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Nincs Szerkesztési Jogosultság
              </h1>
              <h2 className="text-xl text-gray-700">
                Nincs jogosultsága az üzlet szerkesztésére
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
                    <path
                      d="M12 15C11.4477 15 11 15.4477 11 16V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V16C13 15.4477 12.5523 15 12 15Z"
                      fill="currentColor"
                    />
                    <path
                      d="M7.70711 7.70711C8.09763 7.31658 8.09763 6.68342 7.70711 6.29289C7.31658 5.90237 6.68342 5.90237 6.29289 6.29289L3.29289 9.29289C2.90237 9.68342 2.90237 10.3166 3.29289 10.7071L6.29289 13.7071C6.68342 14.0976 7.31658 14.0976 7.70711 13.7071C8.09763 13.3166 8.09763 12.6834 7.70711 12.2929L5.41421 10L7.70711 7.70711Z"
                      fill="currentColor"
                    />
                    <path
                      d="M16.2929 7.70711L18.5858 10L16.2929 12.2929C15.9024 12.6834 15.9024 13.3166 16.2929 13.7071C16.6834 14.0976 17.3166 14.0976 17.7071 13.7071L20.7071 10.7071C21.0976 10.3166 21.0976 9.68342 20.7071 9.29289L17.7071 6.29289C17.3166 5.90237 16.6834 5.90237 16.2929 6.29289C15.9024 6.68342 15.9024 7.31658 16.2929 7.70711Z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 4C12.5523 4 13 4.44772 13 5V11C13 11.5523 12.5523 12 12 12C11.4477 12 11 11.5523 11 11V5C11 4.44772 11.4477 4 12 4Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="text-center text-gray-600 max-w-xs">
                  El kell hagynia ezt az üzletet, és létre kell hoznia a
                  sajátját ahhoz, hogy szerkesztési jogosultságot kapjon.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                className="w-full bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center gap-2 py-5 px-4 font-medium transition-colors"
                onClick={() => {}}
              >
                <LogOut size={18} />
                Kilépés az üzletből
              </button>

              <button
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-full flex items-center justify-center gap-2 py-5 px-4 font-medium transition-colors"
                onClick={() => {}}
              >
                <PlusCircle size={18} />
                Saját üzlet létrehozása
              </button>

              <div className="pt-4">
                <a
                  href="/"
                  className="flex items-center justify-center text-sm text-gray-600 hover:text-black transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Vissza a vezérlőpulthoz
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
