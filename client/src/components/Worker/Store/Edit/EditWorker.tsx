import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { axiosInstance } from "../../../../utils/axiosinstance";

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

interface EditWorkerProps {
  onWorkerSelect: (workerIds: number[]) => void;
  selectedWorkerIds: number[];
  workersList: {
    userId: number;
    username: string;
    profilepic: string;
    role: string;
    storeWorkerId: number;
    email: string;
  }[];
  disabled?: boolean;
}

export const EditWorker = ({
  onWorkerSelect,
  selectedWorkerIds,
  workersList,
  disabled = false,
}: EditWorkerProps) => {
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

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<FriendsResponse>(
          "/api/v1/getFriendsv2",
        );

        let friends = response.data.friends || [];

        const newSelectedWorkers = Array(4).fill(null);

        if (selectedWorkerIds.length > 0 && workersList.length > 0) {
          const processedIds = selectedWorkerIds.slice(0, 4);

          processedIds.forEach((workerId, index) => {
            if (index > 3) return;

            const currentWorker = workersList.find(
              (worker) => worker.userId === workerId,
            );

            if (currentWorker) {
              newSelectedWorkers[index] = {
                userId: currentWorker.userId,
                username: currentWorker.username,
                profilePic: currentWorker.profilepic,
              };

              friends = friends.filter((friend) => friend.userId !== workerId);
            }
          });
        }

        setSelectedWorkers(newSelectedWorkers);

        if (friends.length > 0) {
          setAvailableFriends([...friends]);
          setNoFriends(false);
        } else {
          setNoFriends(true);
        }

        setLoading(false);
      } catch (err) {
        setError("Hiba történt az ismerősök betöltése közben.");
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
  }, [selectedWorkers]);

  const handleActivateSlot = (index: number) => {
    if (disabled || noFriends || availableFriends.length === 0 || index > 3)
      return;

    setActiveIndex(index);
    setShowSelection(true);
  };

  const notifyParentOfUpdatedWorkers = (
    updatedWorkers: (SelectedWorker | null)[],
  ) => {
    const workerIds = updatedWorkers
      .slice(0, 4)
      .filter((worker): worker is SelectedWorker => worker !== null)
      .map((worker) => worker.userId);

    onWorkerSelect(workerIds);
  };

  const handleWorkerSelect = (friend: Friend) => {
    if (disabled) return;

    const updatedWorkers = [...selectedWorkers];

    let targetIndex =
      activeIndex !== null
        ? activeIndex
        : updatedWorkers.findIndex((worker) => worker === null);

    if (targetIndex === -1 || targetIndex > 3) targetIndex = 0;

    const previousWorker = updatedWorkers[targetIndex];
    if (previousWorker) {
      setAvailableFriends((prev) => [
        ...prev,
        {
          userId: previousWorker.userId,
          username: previousWorker.username,
          profilePic: previousWorker.profilePic,
        },
      ]);
    }

    const newWorker = {
      userId: friend.userId,
      username: friend.username,
      profilePic: friend.profilePic,
    };

    updatedWorkers[targetIndex] = newWorker;

    setAvailableFriends((prev) =>
      prev.filter((f) => f.userId !== friend.userId),
    );

    setSelectedWorkers(updatedWorkers.slice(0, 4));
    setShowSelection(false);
    setActiveIndex(null);

    notifyParentOfUpdatedWorkers(updatedWorkers);
  };

  const handleWorkerRemove = (index: number) => {
    if (disabled || index > 3) return;

    const updatedWorkers = [...selectedWorkers];
    const workerToRemove = updatedWorkers[index];

    if (workerToRemove) {
      setAvailableFriends((prev) => [
        ...prev,
        {
          userId: workerToRemove.userId,
          username: workerToRemove.username,
          profilePic: workerToRemove.profilePic,
        },
      ]);

      updatedWorkers[index] = null;
      setSelectedWorkers(updatedWorkers);

      notifyParentOfUpdatedWorkers(updatedWorkers);

      setActiveIndex(index);
      setShowSelection(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      componentRef.current &&
      !componentRef.current.contains(event.target as Node)
    ) {
      setActiveIndex(null);
      setShowSelection(false);
    }
  };

  const getInitials = (username: string) => username.charAt(0).toUpperCase();

  return (
    <div
      ref={componentRef}
      className={`w-full p-4 sm:p-6 bg-white backdrop-blur-xl rounded-2xl border border-white mt-10 ${disabled ? "opacity-80" : ""}`}
    >
      <h2 className="text-xl font-semibold text-black/80 mb-4">
        Munkatárs kiválasztása
      </h2>

      <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
        {selectedWorkers.slice(0, 4).map((worker, index) => (
          <div
            key={index}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center relative overflow-hidden flex-shrink-0 ${
              !worker && !disabled ? "cursor-pointer" : "cursor-default"
            } ${worker ? "group" : ""}`}
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
              if (!worker && !noFriends && !disabled) {
                handleActivateSlot(index);
              }
            }}
          >
            {worker && !worker.profilePic && (
              <span className="text-lg sm:text-2xl font-bold text-black/70">
                {getInitials(worker.username)}
              </span>
            )}

            {!worker && !noFriends && !disabled && (
              <Plus
                className="h-8 w-8 sm:h-10 sm:w-10 text-black/50"
                strokeWidth={1.5}
              />
            )}

            {worker && !disabled && (
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

      {!disabled &&
        (showSelection || activeIndex !== null) &&
        !loading &&
        !error &&
        !noFriends && (
          <>
            <div className="h-px bg-black/10 my-4"></div>

            <div
              ref={scrollContainerRef}
              className="flex gap-2 sm:gap-4 overflow-x-auto py-4 pb-2"
            >
              {availableFriends.length > 0 ? (
                availableFriends.map((friend) => (
                  <div
                    key={friend.userId}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white cursor-pointer overflow-hidden flex items-center justify-center flex-shrink-0 hover:shadow-md transition-shadow duration-200"
                    style={{ aspectRatio: "1/1" }}
                    onClick={() => handleWorkerSelect(friend)}
                  >
                    {friend.profilePic ? (
                      <img
                        src={friend.profilePic}
                        alt={friend.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.parentElement!.innerHTML = getInitials(
                            friend.username,
                          );
                        }}
                      />
                    ) : (
                      <span className="text-lg sm:text-2xl font-bold text-black/70 flex items-center justify-center">
                        {getInitials(friend.username)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 w-full text-center py-4">
                  Nincs több elérhető munkatárs.
                </p>
              )}
            </div>
          </>
        )}
    </div>
  );
};
