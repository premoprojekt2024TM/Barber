import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// UI Avatar URLs with specific configurations as per your request
const avatars = [
  'https://ui-avatars.com/api/?name=Elon+Musk&size=128&font-size=0.33&length=1&rounded=true',
  'https://ui-avatars.com/api/?name=Steve+Jobs&size=128&font-size=0.33&length=1&rounded=true',
  'https://ui-avatars.com/api/?name=Bill+Gates&size=128&font-size=0.33&length=1&rounded=true',
  'https://ui-avatars.com/api/?name=Mark+Zuckerberg&size=128&font-size=0.33&length=1&rounded=true',
  'https://ui-avatars.com/api/?name=Jeff+Bezos&size=128&font-size=0.33&length=1&rounded=true',
];

const CircularUploadBoxes: React.FC = () => {
  const [selectedAvatars, setSelectedAvatars] = useState<(string | null)[]>(Array(4).fill(null)); // Track selected avatars
  const [availableAvatars, setAvailableAvatars] = useState(avatars); // Available avatars for selection
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // Track the currently clicked circle

  const componentRef = useRef<HTMLDivElement | null>(null); // Ref for the component

  // Handle avatar click to place in the first available circle or remove it from a circle
  const handleAvatarClick = (avatarUrl: string) => {
    const newSelectedAvatars = [...selectedAvatars];

    // Place the avatar in the active index slot
    if (activeIndex !== null) {
      newSelectedAvatars[activeIndex] = avatarUrl;

      // Remove the selected avatar from the available list
      setAvailableAvatars(availableAvatars.filter(avatar => avatar !== avatarUrl));
      setActiveIndex(null); // Hide the avatar selection after placing the avatar
    }

    // Update selected avatars with the new state
    setSelectedAvatars(newSelectedAvatars);
  };

  // Handle the click on an assigned avatar to remove it and return it to the list
  const handleAssignedAvatarClick = (index: number) => {
    const avatarToRemove = selectedAvatars[index];
    if (avatarToRemove) {
      const newSelectedAvatars = [...selectedAvatars];
      newSelectedAvatars[index] = null; // Remove avatar from the selected slot

      // Add the avatar back to the available list
      setAvailableAvatars(prev => [...prev, avatarToRemove]);

      // Update selected avatars with the new state
      setSelectedAvatars(newSelectedAvatars);
    }
  };

  // Use useEffect to handle click outside logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setActiveIndex(null); // Hide avatar selection when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup the event listener
    };
  }, []);

  return (
    <Box
      ref={componentRef} // Attach the ref to the component
      sx={{
        width: '100%',
        height: 'auto',
        backgroundColor: '#f5f5f5',
        borderRadius: '16px',
        border: '1px solid #e0e0e0',
        padding: 2,
        mt: 2,
        pl: { xs: 2, sm: 6 }, // Adjust padding for mobile screens
      }}
    >
      {/* Circular Boxes */}
      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 4 }, flexWrap: 'wrap', justifyContent: 'center' }}>
        {selectedAvatars.map((avatar, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: '60px', sm: '80px' }, // Adjust size for mobile
              height: { xs: '60px', sm: '80px' }, // Adjust size for mobile
              borderRadius: '50%',
              border: avatar ? 'none' : '2px dashed #bdbdbd', // Dashed border if empty
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              backgroundImage: avatar ? `url(${avatar})` : 'transparent',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: 'pointer', // Indicate that it's clickable
              transition: 'all 0.3s ease', // Smooth transition on hover
              '&:hover': avatar ? { filter: 'blur(3px)' } : {}, // Apply blur effect on hover
            }}
            onClick={() => {
              if (!avatar) {
                setActiveIndex(index); // Show the avatar list if the circle is empty
              } else {
                handleAssignedAvatarClick(index); // Remove the avatar and return it to the list
              }
            }}
          >
            {avatar && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'none',
                  opacity: 0.8,
                  '&:hover': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating
                    handleAssignedAvatarClick(index); // Remove avatar from the circle
                  }}
                  sx={{
                    color: '#fff',
                    fontSize: '30px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background for contrast
                    borderRadius: '50%',
                    padding: '5px',
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
            {!avatar && <AddIcon sx={{ color: '#bdbdbd', fontSize: { xs: 30, sm: 40 } }} />}
          </Box>
        ))}
      </Box>

      {/* Divider between circular boxes and avatar selection */}
      {activeIndex !== null && <Divider sx={{ mt: 2, mb: 2 }} />}

      {/* Scrollable Avatar Selection */}
      {activeIndex !== null && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            maxWidth: '100%',
            overflowX: 'auto',
            scrollbarWidth: 'thin',
            scrollBehavior: 'smooth',
            paddingRight: '12px', // To avoid cutting off avatars when scrolling
            maxHeight: '80px',
            marginTop: '16px',
            justifyContent: 'center', // Center avatars on small screens
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#bdbdbd',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f5f5f5',
            },
          }}
        >
          {availableAvatars.map((avatarUrl, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: '60px', sm: '80px' }, // Adjust size for mobile
                height: { xs: '60px', sm: '80px' }, // Adjust size for mobile
                borderRadius: '50%',
                border: '2px solid #bdbdbd', // Border for avatar circles
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                backgroundColor: 'transparent',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
              }}
              onClick={() => handleAvatarClick(avatarUrl)} // Add avatar to the first available circle
            >
              <img
                src={avatarUrl}
                alt="profile avatar"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CircularUploadBoxes;
