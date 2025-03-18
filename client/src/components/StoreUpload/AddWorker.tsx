import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, CircularProgress, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { axiosInstance } from "../../utils/axiosInstance";

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
  friends: Friend[];
}

interface AddWorkerProps {
  onWorkerSelect: (workerId: number) => void; // Callback to pass the selected worker's ID
}

export const AddWorker = ({ onWorkerSelect }: AddWorkerProps) => {
  const [selectedWorkers, setSelectedWorkers] = useState<
    (SelectedWorker | null)[]
  >(Array(4).fill(null));
  const [availableFriends, setAvailableFriends] = useState<Friend[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response =
          await axiosInstance.get<FriendsResponse>("/api/v1/getFriends");
        setAvailableFriends(response.data.friends);
        setError(null);
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError("Failed to load friends.");
      } finally {
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
      onWorkerSelect(friend.userId); // Notify the parent with the worker ID
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
    <Box
      ref={componentRef}
      sx={{
        width: "100%",
        padding: { xs: 2, sm: 3 },
        background: "rgba(15, 23, 42, 0.5)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 1)",
        marginTop: "42px",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "white", fontWeight: 600 }}>
        Munkatárs kiválasztása
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 2 },
          justifyContent: "center",
        }}
      >
        {selectedWorkers.map((worker, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: "60px", sm: "80px" },
              height: { xs: "60px", sm: "80px" },
              borderRadius: "50%",
              backgroundColor: worker ? "rgba(0, 0, 0, 0.2)" : "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              backgroundImage: worker?.profilePic
                ? `url(${worker.profilePic})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: !worker ? "2px dashed white" : "none",
              overflow: "hidden",
              flexShrink: 0,
              aspectRatio: "1/1",
              "&:hover .overlay": {
                opacity: 1,
              },
            }}
            onClick={() => (worker ? null : setActiveIndex(index))}
          >
            {worker && !worker.profilePic && (
              <Typography
                sx={{
                  fontSize: { xs: "18px", sm: "24px" },
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {getInitials(worker.username)}
              </Typography>
            )}
            {!worker && (
              <AddIcon sx={{ color: "white", fontSize: { xs: 30, sm: 40 } }} />
            )}
            {worker && (
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(2px)",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWorkerRemove(index);
                  }}
                  sx={{
                    color: "white",
                    fontSize: { xs: 22, sm: 28 },
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {loading && <CircularProgress sx={{ color: "white", marginTop: 2 }} />}
      {error && <Typography sx={{ color: "red", mt: 2 }}>{error}</Typography>}

      {(showSelection || activeIndex !== null) && !loading && !error && (
        <>
          <Divider
            sx={{ mt: 2, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />

          <Box
            ref={scrollContainerRef}
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2 },
              overflowX: "auto",
              paddingTop: 2,
              pb: 1,
            }}
          >
            {availableFriends.map((friend) => (
              <Box
                key={friend.userId}
                sx={{
                  width: { xs: "60px", sm: "80px" },
                  height: { xs: "60px", sm: "80px" },
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  cursor: "pointer",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  aspectRatio: "1/1",
                }}
                onClick={() => handleWorkerSelect(friend)}
              >
                {friend.profilePic ? (
                  <img
                    src={friend.profilePic}
                    alt={friend.username}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      fontSize: { xs: "18px", sm: "24px" },
                      fontWeight: "bold",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {getInitials(friend.username)}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};
