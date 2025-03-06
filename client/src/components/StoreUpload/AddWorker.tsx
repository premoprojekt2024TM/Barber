import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import { Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const avatars = [
  "https://ui-avatars.com/api/?name=Elon+Musk&size=128&font-size=0.33&length=1&rounded=true",
  "https://ui-avatars.com/api/?name=Steve+Jobs&size=128&font-size=0.33&length=1&rounded=true",
  "https://ui-avatars.com/api/?name=Bill+Gates&size=128&font-size=0.33&length=1&rounded=true",
  "https://ui-avatars.com/api/?name=Mark+Zuckerberg&size=128&font-size=0.33&length=1&rounded=true",
  "https://ui-avatars.com/api/?name=Jeff+Bezos&size=128&font-size=0.33&length=1&rounded=true",
];

export const AddWorker = ({}) => {
  const [selectedAvatars, setSelectedAvatars] = useState<(string | null)[]>(
    Array(4).fill(null),
  );
  const [availableAvatars, setAvailableAvatars] = useState(avatars);
  const [showSelection, setShowSelection] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredAvatarIndex, setHoveredAvatarIndex] = useState<number | null>(
    null,
  );
  const [hoveredCloseIndex, setHoveredCloseIndex] = useState<number | null>(
    null,
  );
  const [hoveredAddIndex, setHoveredAddIndex] = useState<number | null>(null);

  const componentRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleAvatarClick = (avatarUrl: string) => {
    // Find the first empty slot
    const emptySlotIndex = selectedAvatars.findIndex(
      (avatar) => avatar === null,
    );

    if (emptySlotIndex !== -1) {
      // If there's an empty slot, fill it
      const newSelectedAvatars = [...selectedAvatars];
      newSelectedAvatars[emptySlotIndex] = avatarUrl;

      setSelectedAvatars(newSelectedAvatars);
      setAvailableAvatars(
        availableAvatars.filter((avatar) => avatar !== avatarUrl),
      );
    } else if (activeIndex !== null) {
      // If a specific slot is active, replace it
      const newSelectedAvatars = [...selectedAvatars];
      const oldAvatar = newSelectedAvatars[activeIndex];
      newSelectedAvatars[activeIndex] = avatarUrl;

      setSelectedAvatars(newSelectedAvatars);

      // Update available avatars
      const newAvailableAvatars = availableAvatars.filter(
        (avatar) => avatar !== avatarUrl,
      );
      if (oldAvatar) {
        newAvailableAvatars.push(oldAvatar);
      }
      setAvailableAvatars(newAvailableAvatars);
      setActiveIndex(null);
    }
  };

  const handleAssignedAvatarClick = (index: number) => {
    const avatarToRemove = selectedAvatars[index];
    if (avatarToRemove) {
      const newSelectedAvatars = [...selectedAvatars];
      newSelectedAvatars[index] = null;

      setAvailableAvatars((prev) => [...prev, avatarToRemove]);

      setSelectedAvatars(newSelectedAvatars);
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

  return (
    <Box
      ref={componentRef}
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "#f5f5f5",
        borderRadius: "16px",
        padding: 2,
        mt: 2,
        pl: { xs: 2, sm: 6 },
        pr: { xs: 2, sm: 6 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, sm: 4 },
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {selectedAvatars.map((avatar, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: "60px", sm: "80px" },
              height: { xs: "60px", sm: "80px" },
              borderRadius: "50%",
              border: avatar ? "none" : "2px dashed #bdbdbd",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              backgroundImage: avatar ? `url(${avatar})` : "transparent",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
              transition:
                "border-color 0.3s, background-color 0.3s, transform 0.3s",
              "&:hover": avatar
                ? { transform: "scale(1.05)" }
                : {
                    borderColor: "#1976d2",
                    backgroundColor: "#e3f2fd",
                  },
            }}
            onClick={() => {
              if (!avatar) {
                handleEmptySlotClick(index);
              } else {
                handleAssignedAvatarClick(index);
              }
            }}
            onMouseEnter={() => {
              setHoveredAvatarIndex(index);
              if (!avatar) {
                setHoveredAddIndex(index);
              }
            }}
            onMouseLeave={() => {
              setHoveredAvatarIndex(null);
              if (!avatar) {
                setHoveredAddIndex(null);
              }
            }}
          >
            {avatar && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: hoveredAvatarIndex === index ? "flex" : "none",
                  opacity: 0.8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAssignedAvatarClick(index);
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
                      color: hoveredCloseIndex === index ? "#1976d2" : "#fff",
                      transition: "color 0.3s ease",
                    }}
                  />
                </IconButton>
              </Box>
            )}
            {!avatar && (
              <AddIcon
                sx={{
                  color: hoveredAddIndex === index ? "#1976d2" : "#bdbdbd",
                  fontSize: { xs: 40, sm: 40 },
                  transition: "color 0.3s ease",
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {(showSelection || activeIndex !== null) && (
        <Divider sx={{ mt: 2, mb: 2 }} />
      )}

      {(showSelection || activeIndex !== null) && (
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
            marginTop: "16px",
            marginBottom: "8px",
            justifyContent: "flex-start",
            scrollSnapType: "x mandatory",
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "4px",
            },
          }}
          onScroll={(e) => {
            if (e.target.scrollLeft % 1 === 0) {
              clearTimeout(e.target.scrollTimeout);
              e.target.scrollTimeout = setTimeout(() => handleScroll(), 150);
            }
          }}
        >
          {availableAvatars.map((avatarUrl, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: "60px", sm: "80px" },
                height: { xs: "60px", sm: "80px" },
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                backgroundColor: "transparent",
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                transition: "background-color 0.3s, transform 0.3s",
                flexShrink: 0,
                margin: "0 4px",
                scrollSnapAlign: "center",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  transform: "scale(1.03)",
                },
              }}
              onClick={() => handleAvatarClick(avatarUrl)}
            >
              <img
                src={avatarUrl}
                alt="profile avatar"
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "40%",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
