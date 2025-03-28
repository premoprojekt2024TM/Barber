import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, UserCheck } from "lucide-react";
import Sidebar from "../sidebar";
import FriendsList from "./friend-list";
import Pagination from "./pagination";
import { axiosInstance } from "../../../utils/axiosinstance";
import type { Friend, Worker } from "./friends";

const FRIENDS_PER_PAGE = 4;

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [workers, setWorkers] = useState<Friend[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Friend[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFriends, setShowFriends] = useState(false);

  const fetchWorkers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/v1/list");
      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error("Invalid API response format");
      }
      const mappedWorkers = response.data.data.map((worker: Worker) => ({
        userId: worker.userId,
        name: `${worker.lastName} ${worker.firstName}`,
        username: worker.username || "",
        avatar: worker.profilePic || "/placeholder.svg?height=80&width=80",
        friendshipStatus: worker.friendshipStatus || "none",
      }));
      setWorkers(mappedWorkers);
      return mappedWorkers;
    } catch (err) {
      console.error("Error fetching workers:", err);
      setError(
        "Nem sikerült betölteni a felhasználókat, kérjük próbálja később.",
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkers().then((mappedWorkers) => {
      if (mappedWorkers) {
        applyFilters(mappedWorkers);
      }
    });
  }, [fetchWorkers]);

  const applyFilters = useCallback(
    (workerList: Friend[]) => {
      let filtered = workerList;

      // Apply search query
      if (searchQuery.trim()) {
        filtered = filtered.filter(
          (worker) =>
            worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            worker.username.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      // Filter logic
      if (showFriends) {
        // Show only accepted friends
        filtered = filtered.filter(
          (worker) => worker.friendshipStatus === "accepted",
        );
      } else {
        // Show non-friends and pending requests
        filtered = filtered.filter(
          (worker) => worker.friendshipStatus !== "accepted",
        );
      }

      setFilteredWorkers(filtered);
      setCurrentPage(1);
    },
    [searchQuery, showFriends],
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      applyFilters(workers);
    },
    [applyFilters, workers],
  );

  const handleToggleView = useCallback(() => {
    setShowFriends((prevShowFriends) => !prevShowFriends);
  }, []);

  useEffect(() => {
    applyFilters(workers);
  }, [showFriends, workers, applyFilters]);

  const handleFriendStatusChange = useCallback(() => {
    fetchWorkers().then((mappedWorkers) => {
      if (mappedWorkers) {
        applyFilters(mappedWorkers);
      }
    });
  }, [applyFilters, fetchWorkers]);

  const totalPages = useMemo(
    () => Math.ceil(filteredWorkers.length / FRIENDS_PER_PAGE),
    [filteredWorkers.length],
  );

  const currentWorkers = useMemo(
    () =>
      filteredWorkers.slice(
        (currentPage - 1) * FRIENDS_PER_PAGE,
        currentPage * FRIENDS_PER_PAGE,
      ),
    [currentPage, filteredWorkers],
  );

  return (
    <div className="flex">
      <Sidebar />
      <div
        className="flex-1 min-h-screen bg-cover bg-center bg-no-repeat p-4"
        style={{}}
      >
        <div className="max-w-3xl mx-auto">
          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Felhasználók keresése..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
              <button
                onClick={handleToggleView}
                className={`p-2 rounded-full ${
                  !showFriends ? "bg-white shadow" : "hover:bg-gray-200"
                }`}
                aria-label="Non-Friends"
              >
                <Search size={18} className="text-gray-700" />
              </button>
              <button
                onClick={handleToggleView}
                className={`p-2 rounded-full ${
                  showFriends ? "bg-white shadow" : "hover:bg-gray-200"
                }`}
                aria-label="Friends"
              >
                <UserCheck size={18} className="text-gray-700" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Felhasználók betöltése...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredWorkers.length === 0 ? (
            <div className="text-center py-8">
              {searchQuery
                ? "Nem található ilyen felhasználó."
                : showFriends
                  ? "Nincs egyetlen barátod sem."
                  : "Nincs elérhető felhasználó."}
            </div>
          ) : (
            <>
              <FriendsList
                friends={currentWorkers}
                searchQuery={searchQuery}
                onFriendStatusChange={handleFriendStatusChange}
              />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
