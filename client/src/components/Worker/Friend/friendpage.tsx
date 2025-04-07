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
        applyFilters(mappedWorkers, false);
      }
    });
  }, [fetchWorkers]);

  const applyFilters = useCallback(
    (workerList: Friend[], resetPagination: boolean = true) => {
      let filtered = workerList;

      if (searchQuery.trim()) {
        filtered = filtered.filter(
          (worker) =>
            worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            worker.username.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      if (showFriends) {
        filtered = filtered.filter(
          (worker) => worker.friendshipStatus === "accepted",
        );
      } else {
        filtered = filtered.filter(
          (worker) => worker.friendshipStatus !== "accepted",
        );
      }
      setFilteredWorkers(filtered);
      if (resetPagination) {
        setCurrentPage(1);
      }
    },
    [searchQuery, showFriends],
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      applyFilters(workers, true);
    },
    [applyFilters, workers],
  );

  const handleToggleView = useCallback(() => {
    setShowFriends((prevShowFriends) => !prevShowFriends);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    applyFilters(workers, false);
  }, [showFriends, workers, applyFilters]);

  const handleFriendStatusChange = useCallback(() => {
    const savedCurrentPage = currentPage;
    fetchWorkers().then((mappedWorkers) => {
      if (mappedWorkers) {
        applyFilters(mappedWorkers, false);
        const newTotalPages = Math.ceil(
          mappedWorkers.filter(
            (w: Friend) =>
              (showFriends
                ? w.friendshipStatus === "accepted"
                : w.friendshipStatus !== "accepted") &&
              (searchQuery.trim()
                ? w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  w.username.toLowerCase().includes(searchQuery.toLowerCase())
                : true),
          ).length / FRIENDS_PER_PAGE,
        );
        setCurrentPage(Math.min(savedCurrentPage, Math.max(newTotalPages, 1)));
      }
    });
  }, [applyFilters, fetchWorkers, currentPage, showFriends, searchQuery]);

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
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <div className="relative flex-grow w-full sm:w-auto">
              {" "}
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
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full flex-shrink-0">
              {" "}
              <button
                onClick={handleToggleView}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  !showFriends
                    ? "bg-white shadow"
                    : "hover:bg-gray-200 text-gray-500"
                }`}
                aria-label={
                  !showFriends
                    ? "Jelenleg látható: Felhasználók"
                    : "Váltás: Felhasználók"
                }
                title={
                  !showFriends
                    ? "Jelenleg látható: Felhasználók"
                    : "Váltás: Felhasználók"
                }
              >
                <Search
                  size={18}
                  className={!showFriends ? "text-black" : "text-gray-500"}
                />
              </button>
              <button
                onClick={handleToggleView}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  showFriends
                    ? "bg-white shadow"
                    : "hover:bg-gray-200 text-gray-500"
                }`}
                aria-label={
                  showFriends ? "Jelenleg látható: Barátok" : "Váltás: Barátok"
                }
                title={
                  showFriends ? "Jelenleg látható: Barátok" : "Váltás: Barátok"
                }
              >
                <UserCheck
                  size={18}
                  className={showFriends ? "text-black" : "text-gray-500"}
                />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-700">Adatok betöltése...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 bg-red-50 p-4 rounded-lg">
              {error}
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery
                ? `Nincs találat erre: "${searchQuery}"`
                : showFriends
                  ? "Nincs egyetlen barátod sem. Keress új felhasználókat!"
                  : "Nincsenek felhasználók ebben a nézetben."}
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
