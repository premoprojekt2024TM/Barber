import React, { useState, useEffect } from "react";
import { LogOut, Trash2 } from "lucide-react"; // Import Trash2 for delete icon

interface WorkplaceProps {
  store: {
    storeId: number;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    picture: string;
  } | null;
  handleExitWorkplace: () => void;
  handleDeleteStore?: () => void; // Optional function to delete the store
}

const Workplace = ({
  store,
  handleExitWorkplace,
  handleDeleteStore,
}: WorkplaceProps) => {
  if (!store) {
    return (
      <div className="p-4 space-y-6">
        <p>Nem tartozol munkahelyhez.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-medium">Munkahely</h3>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{store.name}</h4>
            </div>
            <p className="text-sm text-gray-600">
              {store.city} {store.address}
            </p>
          </div>

          {handleDeleteStore ? (
            <button
              className="self-start flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1 text-sm rounded-md"
              onClick={handleDeleteStore}
            >
              <Trash2 size={14} />
              Bolt törlése
            </button>
          ) : (
            <button
              className="self-start flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1 text-sm rounded-md"
              onClick={handleExitWorkplace}
            >
              <LogOut size={14} />
              Kilépés
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workplace;
