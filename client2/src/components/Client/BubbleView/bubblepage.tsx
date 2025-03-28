import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BubbleContainer from "./container";
import SearchBar from "./search-bar";
import HairdresserList from "./list";
import type { Hairdresser } from "./hairdresser";
import BackButton from "../Map/back-button";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"bubble" | "list">("bubble");
  const [selectedHairdresser, setSelectedHairdresser] =
    useState<Hairdresser | null>(null);
  const [hairdressers, setHairdressers] = useState<Hairdresser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHairdressers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://localhost:8080/api/v1/available-workers",
        );

        if (!response.ok) {
          throw new Error("Nem sikerült lekérdezni a fodrászokat.");
        }

        const data = await response.json();
        const transformedHairdressers: Hairdresser[] = data.workers.map(
          (worker: any) => {
            const hasAvailableSlot =
              worker.availability &&
              Object.keys(worker.availability).some(
                (day) =>
                  Array.isArray(worker.availability[day]) &&
                  worker.availability[day].length > 0 &&
                  worker.availability[day].every(
                    (slot) => slot.status !== "accepted",
                  ),
              );

            return {
              id: worker.userId,
              name: `${worker.lastName} ${worker.firstName}`,
              hasAvailability: hasAvailableSlot,
              profilePic: worker.profilePic,
              availability: worker.availability || {},
            };
          },
        );

        setHairdressers(transformedHairdressers);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ismeretlen hiba történt",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHairdressers();
  }, []);

  const filteredHairdressers = hairdressers.filter(
    (h) =>
      h.hasAvailability &&
      h.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectFromList = (hairdresser: Hairdresser) => {
    setSelectedHairdresser(hairdresser);
    setViewMode("bubble");
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-700">Töltés...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Hiba: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col relative">
      <div className="absolute top-5 left-5 z-10">
        <BackButton onClick={handleBackButtonClick} />
      </div>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-[1400px] mx-auto flex-grow mt-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Elérhető Fodrászok
            </h1>
            <h2 className="text-xl text-gray-700">
              Válasszon egy fodrászt az időpontok megtekintéséhez
            </h2>
          </div>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <div className="py-4">
            {viewMode === "bubble" ? (
              <BubbleContainer
                items={filteredHairdressers}
                selectedHairdresserId={selectedHairdresser?.id}
                onSelectHairdresser={setSelectedHairdresser}
              />
            ) : (
              <HairdresserList
                hairdressers={filteredHairdressers}
                onSelectHairdresser={handleSelectFromList}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
