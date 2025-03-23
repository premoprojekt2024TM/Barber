import { useState, useEffect } from "react";
import Sidebar from "../sidebar";
import SearchBar from "./searchbar";
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

  const fetchWorkers = async () => {
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
      setFilteredWorkers(mappedWorkers);
    } catch (err) {
      console.error("Error fetching workers:", err);
      setError("Nem sikerült betölteni a barátokat, kérjük próbálja később.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (!query.trim()) {
      setFilteredWorkers(workers);
      return;
    }
    const filtered = workers.filter(
      (worker) =>
        worker.name.toLowerCase().includes(query.toLowerCase()) ||
        worker.username.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredWorkers(filtered);
  };

  const handleFriendStatusChange = () => {
    fetchWorkers();
  };

  const totalPages = Math.ceil(filteredWorkers.length / FRIENDS_PER_PAGE);

  const currentWorkers = filteredWorkers.slice(
    (currentPage - 1) * FRIENDS_PER_PAGE,
    currentPage * FRIENDS_PER_PAGE,
  );

  return (
    <div className="flex">
      <Sidebar />
      <div
        className="flex-1 min-h-screen bg-cover bg-center bg-no-repeat p-4"
        style={{
          backgroundColor: "#e6e2d9",
          // backgroundImage:
          //"url(https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/authbg.png)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <SearchBar onSearch={handleSearch} />
          {isLoading ? (
            <div className="text-center py-8">Barátok betöltése...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredWorkers.length === 0 ? (
            <div className="text-center py-8">
              {searchQuery
                ? "Nem található az ilyen nevű barát."
                : "Nincs elérhető barát adat."}
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
