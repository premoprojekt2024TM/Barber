import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { axiosInstance } from "../../../utils/axiosinstance";

interface Friend {
  userId: number;
  username: string;
  profilePic: string | null;
}

interface SelectedWorker {
  userId: number;
  username: string;
  profilePic: string | null;
}

interface FriendsResponse {
  friends?: Friend[];
  message?: string;
}

interface AddWorkerProps {
  onWorkersSelect: (workerIds: number[]) => void;
}

export const AddWorker = ({ onWorkersSelect }: AddWorkerProps) => {
  const [selectedWorkers, setSelectedWorkers] = useState<
    (SelectedWorker | null)[]
  >(Array(4).fill(null));
  const [availableFriends, setAvailableFriends] = useState<Friend[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noFriends, setNoFriends] = useState(false);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Function to extract and send all selected worker IDs
  const updateSelectedWorkerIds = (workers: (SelectedWorker | null)[]) => {
    const workerIds = workers
      .filter((worker): worker is SelectedWorker => worker !== null)
      .map((worker) => worker.userId);

    onWorkersSelect(workerIds);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response =
          await axiosInstance.get<FriendsResponse>("/api/v1/getFriends");

        if (response.data.friends && response.data.friends.length > 0) {
          setAvailableFriends(response.data.friends);
          setNoFriends(false);
        } else {
          setNoFriends(true);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError("Failed to load friends.");
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleWorkerSelect = (friend: Friend) => {
    const updatedWorkers = [...selectedWorkers];
    const emptySlotIndex = selectedWorkers.findIndex(
      (worker) => worker === null,
    );

    if (emptySlotIndex !== -1) {
      updatedWorkers[emptySlotIndex] = friend;
      setSelectedWorkers(updatedWorkers);
      setAvailableFriends(
        availableFriends.filter((f) => f.userId !== friend.userId),
      );

      // Update the selected worker IDs
      updateSelectedWorkerIds(updatedWorkers);
    } else if (activeIndex !== null) {
      const previousWorker = selectedWorkers[activeIndex];
      updatedWorkers[activeIndex] = friend;
      setSelectedWorkers(updatedWorkers);

      const newAvailableFriends = availableFriends.filter(
        (f) => f.userId !== friend.userId,
      );

      if (previousWorker) {
        newAvailableFriends.push({
          userId: previousWorker.userId,
          username: previousWorker.username,
          profilePic: previousWorker.profilePic,
        });
      }

      setAvailableFriends(newAvailableFriends);
      setActiveIndex(null);

      // Update the selected worker IDs
      updateSelectedWorkerIds(updatedWorkers);
    }
  };

  const handleWorkerRemove = (index: number) => {
    const updatedWorkers = [...selectedWorkers];
    const workerToRemove = updatedWorkers[index];

    if (workerToRemove) {
      updatedWorkers[index] = null;
      setSelectedWorkers(updatedWorkers);

      setAvailableFriends([
        ...availableFriends,
        {
          userId: workerToRemove.userId,
          username: workerToRemove.username,
          profilePic: workerToRemove.profilePic,
        },
      ]);

      // Update the selected worker IDs
      updateSelectedWorkerIds(updatedWorkers);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      componentRef.current &&
      !componentRef.current.contains(event.target as Node)
    ) {
      setActiveIndex(null);
      setShowSelection(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (username: string) => username.charAt(0).toUpperCase();

  return (
    <div
      ref={componentRef}
      className="w-full p-4 sm:p-6 bg-white backdrop-blur-xl rounded-2xl border border-white mt-10"
    >
      <h2 className="text-xl font-semibold text-black/80 mb-4">
        Munkatárs kiválasztása
      </h2>

      <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
        {selectedWorkers.map((worker, index) => (
          <div
            key={index}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center relative overflow-hidden flex-shrink-0 cursor-pointer group"
            style={{
              backgroundImage: worker?.profilePic
                ? `url(${worker.profilePic})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              aspectRatio: "1/1",
              border: worker ? "none" : "2px dashed rgba(0,0,0,0.2)",
              backgroundColor: worker ? "rgba(255,255,255,0.3)" : "transparent",
            }}
            onClick={() => {
              if (!worker && !noFriends) {
                setActiveIndex(index);
                setShowSelection(true);
              }
            }}
          >
            {worker && !worker.profilePic && (
              <span className="text-lg sm:text-2xl font-bold text-black/70">
                {getInitials(worker.username)}
              </span>
            )}
            {!worker && !noFriends && (
              <Plus
                className="h-8 w-8 sm:h-10 sm:w-10 text-black/50"
                strokeWidth={1.5}
              />
            )}
            {worker && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWorkerRemove(index);
                  }}
                  className="bg-white/80 hover:bg-white text-black/80 hover:text-black p-2 rounded-full transition-all duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-4">
          <div className="w-8 h-8 border-t-2 border-black/40 rounded-full animate-spin"></div>
        </div>
      )}

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {noFriends && !loading && !error && (
        <p className="text-black/60 mt-4 text-center italic">
          Önnek még nincsenek ismerősei
        </p>
      )}

      {(showSelection || activeIndex !== null) &&
        !loading &&
        !error &&
        !noFriends && (
          <>
            <div className="h-px bg-black/10 my-4"></div>

            <div
              ref={scrollContainerRef}
              className="flex gap-2 sm:gap-4 overflow-x-auto py-4 pb-2"
            >
              {availableFriends.map((friend) => (
                <div
                  key={friend.userId}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white cursor-pointer overflow-hidden flex items-center justify-center flex-shrink-0 hover:shadow-md transition-shadow duration-200"
                  style={{ aspectRatio: "1/1" }}
                  onClick={() => handleWorkerSelect(friend)}
                >
                  {friend.profilePic ? (
                    <img
                      src={friend.profilePic || "/placeholder.svg"}
                      alt={friend.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg sm:text-2xl font-bold text-black/70 flex items-center justify-center">
                      {getInitials(friend.username)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
    </div>
  );
};
