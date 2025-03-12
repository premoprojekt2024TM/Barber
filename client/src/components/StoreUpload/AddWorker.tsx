import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { Divider, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { axiosInstance } from "../../utils/axiosInstance"; // Adjust path as needed

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

export const AddWorker = () => {
  const [selectedWorkers, setSelectedWorkers] = useState<
    (SelectedWorker | null)[]
  >(Array(4).fill(null));
  const [availableFriends, setAvailableFriends] = useState<Friend[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredAvatarIndex, setHoveredAvatarIndex] = useState<number | null>(
    null,
  );
  const [hoveredCloseIndex, setHoveredCloseIndex] = useState<number | null>(
    null,
  );
  const [hoveredAddIndex, setHoveredAddIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const componentRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Fetch friends data from API
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/v1/getFriends");
        setAvailableFriends(response.data.friends);
        setError(null);
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError("Nem sikerült betölteni az ismerősök listáját.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleWorkerSelect = (friend: Friend) => {
    // Find the first empty slot
    const emptySlotIndex = selectedWorkers.findIndex(
      (worker) => worker === null,
    );

    if (emptySlotIndex !== -1) {
      // If there's an empty slot, fill it
      const newSelectedWorkers = [...selectedWorkers];
      newSelectedWorkers[emptySlotIndex] = friend;

      setSelectedWorkers(newSelectedWorkers);
      setAvailableFriends(
        availableFriends.filter((f) => f.userId !== friend.userId),
      );
    } else if (activeIndex !== null) {
      // If a specific slot is active, replace it
      const newSelectedWorkers = [...selectedWorkers];
      const oldWorker = newSelectedWorkers[activeIndex];
      newSelectedWorkers[activeIndex] = friend;

      setSelectedWorkers(newSelectedWorkers);

      // Update available friends
      const newAvailableFriends = availableFriends.filter(
        (f) => f.userId !== friend.userId,
      );
      if (oldWorker) {
        newAvailableFriends.push(oldWorker);
      }
      setAvailableFriends(newAvailableFriends);
      setActiveIndex(null);
    }
  };

  const handleWorkerRemove = (index: number) => {
    const workerToRemove = selectedWorkers[index];
    if (workerToRemove) {
      const newSelectedWorkers = [...selectedWorkers];
      newSelectedWorkers[index] = null;

      setAvailableFriends((prev) => [...prev, workerToRemove]);
      setSelectedWorkers(newSelectedWorkers);
    }
  };

  const handleEmptySlotClick = (index: number) => {
    setActiveIndex(index);
    setShowSelection(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setActiveIndex(null);
        setShowSelection(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = 88;
      const scrollLeft = container.scrollLeft;
      const nearestSnapPoint = Math.round(scrollLeft / itemWidth) * itemWidth;

      container.scrollTo({
        left: nearestSnapPoint,
        behavior: "smooth",
      });
    }
  };

  // Helper function to get initials from username
  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <Box
      ref={componentRef}
      sx={{
        width: "100%",
        background: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 1)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        },
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
          pointerEvents: "none",
          zIndex: 1,
        },
      }}
    >
      <Typography
        component="h2"
        variant="h6"
        sx={{
          mb: 2,
          color: "rgba(255, 255, 255, 0.9)",
          fontWeight: 600,
          position: "relative",
          zIndex: 2,
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        Dolgozók kiválasztása
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, sm: 4 },
          flexWrap: "wrap",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {selectedWorkers.map((worker, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: "60px", sm: "80px" },
              height: { xs: "60px", sm: "80px" },
              borderRadius: "50%",
              border: worker ? "none" : "2px dashed rgba(255, 255, 255, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              backgroundColor: !worker ? "transparent" : "rgba(0, 0, 0, 0.2)",
              backgroundImage: worker?.profilePic
                ? `url(${worker.profilePic})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
              transition:
                "border-color 0.3s, background-color 0.3s, transform 0.3s",
              "&:hover": worker
                ? { transform: "scale(1.05)" }
                : {
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
            }}
            onClick={() => {
              if (!worker) {
                handleEmptySlotClick(index);
              } else {
                handleWorkerRemove(index);
              }
            }}
            onMouseEnter={() => {
              setHoveredAvatarIndex(index);
              if (!worker) {
                setHoveredAddIndex(index);
              }
            }}
            onMouseLeave={() => {
              setHoveredAvatarIndex(null);
              if (!worker) {
                setHoveredAddIndex(null);
              }
            }}
          >
            {worker && !worker.profilePic && (
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {getInitials(worker.username)}
              </Typography>
            )}

            {worker && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: hoveredAvatarIndex === index ? "flex" : "none",
                  opacity: 0.9,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWorkerRemove(index);
                  }}
                  sx={{
                    color: "#fff",
                    fontSize: "30px",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    borderRadius: "50%",
                    padding: "4px",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    },
                  }}
                  onMouseEnter={() => setHoveredCloseIndex(index)}
                  onMouseLeave={() => setHoveredCloseIndex(null)}
                >
                  <CloseIcon
                    sx={{
                      color:
                        hoveredCloseIndex === index
                          ? "#fff"
                          : "rgba(255, 255, 255, 0.8)",
                      transition: "color 0.3s ease",
                    }}
                  />
                </IconButton>
              </Box>
            )}
            {!worker && (
              <AddIcon
                sx={{
                  color:
                    hoveredAddIndex === index
                      ? "rgba(255, 255, 255, 0.9)"
                      : "rgba(255, 255, 255, 0.5)",
                  fontSize: { xs: 40, sm: 40 },
                  transition: "color 0.3s ease",
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress sx={{ color: "rgba(255, 255, 255, 0.8)" }} />
        </Box>
      )}

      {error && (
        <Typography
          sx={{
            color: "error.light",
            textAlign: "center",
            mt: 2,
            position: "relative",
            zIndex: 2,
          }}
        >
          {error}
        </Typography>
      )}

      {(showSelection || activeIndex !== null) && !loading && !error && (
        <Divider
          sx={{
            mt: 2,
            mb: 2,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            position: "relative",
            zIndex: 2,
          }}
        />
      )}

      {(showSelection || activeIndex !== null) && !loading && !error && (
        <>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              textAlign: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            Válassz ismerőst a hozzáadáshoz
          </Typography>

          <Box
            ref={scrollContainerRef}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              maxWidth: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              scrollbarWidth: "thin",
              scrollBehavior: "smooth",
              paddingLeft: "12px",
              paddingRight: "12px",
              paddingBottom: "12px",
              maxHeight: "120px",
              marginTop: "8px",
              marginBottom: "8px",
              justifyContent:
                availableFriends.length <= 3 ? "center" : "flex-start",
              scrollSnapType: "x mandatory",
              position: "relative",
              zIndex: 2,
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
              },
            }}
            onScroll={(e) => {
              // @ts-ignore - Adding custom property to event target
              if (e.target.scrollLeft % 1 === 0) {
                // @ts-ignore - Adding custom property to event target
                clearTimeout(e.target.scrollTimeout);
                // @ts-ignore - Adding custom property to event target
                e.target.scrollTimeout = setTimeout(() => handleScroll(), 150);
              }
            }}
          >
            {availableFriends.length === 0 ? (
              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  width: "100%",
                  py: 2,
                }}
              >
                Nincs több elérhető ismerős
              </Typography>
            ) : (
              availableFriends.map((friend) => (
                <Box
                  key={friend.userId}
                  sx={{
                    width: { xs: "60px", sm: "80px" },
                    height: { xs: "60px", sm: "80px" },
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                    margin: "0 4px",
                    scrollSnapAlign: "center",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: "scale(1.03)",
                      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                  onClick={() => handleWorkerSelect(friend)}
                >
                  {friend.profilePic ? (
                    <img
                      src={friend.profilePic}
                      alt={friend.username}
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "40%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {getInitials(friend.username)}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      position: "absolute",
                      bottom: "-24px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.8)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "80px",
                      textAlign: "center",
                    }}
                  >
                    {friend.username}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
