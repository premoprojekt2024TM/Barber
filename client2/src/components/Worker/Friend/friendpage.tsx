"use client";

import { useState, useEffect } from "react";
import Sidebar from "../sidebar";
import SearchBar from "./searchbar";
import FriendsList from "./friend-list";
import Pagination from "./pagination";
import { axiosInstance } from "../../../utils/axiosinstance";
import type { Friend } from "./friends";

const FRIENDS_PER_PAGE = 4;

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [workers, setWorkers] = useState<Friend[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Friend[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch workers from API
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/api/v1/list");

        // Check if response structure is correct
        if (!response.data || !Array.isArray(response.data.data)) {
          throw new Error("Invalid API response format");
        }

        // Map API response to match Friend interface
        const mappedWorkers = response.data.data.map((worker) => ({
          userId: worker.userId,
          name: `${worker.firstName} ${worker.lastName}`, // Concatenates first & last name
          username: worker.username || "",
          avatar: worker.profilePic || "/placeholder.svg?height=80&width=80",
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

    fetchWorkers();
  }, []);

  // Search function
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredWorkers.length / FRIENDS_PER_PAGE);

  // Get current page workers
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
          backgroundColor: "#e6e2d9", // Bone-grey color
          backgroundImage:
            "url(https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/authbg.png)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <SearchBar onSearch={handleSearch} />

          {isLoading ? (
            <div className="text-center py-8">Loading workers...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredWorkers.length === 0 ? (
            <div className="text-center py-8">
              {searchQuery
                ? "No workers found matching your search."
                : "No workers available."}
            </div>
          ) : (
            <>
              <FriendsList friends={currentWorkers} searchQuery={searchQuery} />
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
