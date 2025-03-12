import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { axiosInstance } from "../../utils/axiosInstance"; // Assuming this is the correct path

interface Friend {
  userId: number;
  username: string;
  profilePic: string | null;
}

const FriendsList: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/v1/getFriends");
        setFriends(response.data.friends);
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Ismerősök listája
      </Typography>

      {friends.length === 0 ? (
        <Typography variant="body1">Nincsenek még ismerőseid.</Typography>
      ) : (
        <List>
          {friends.map((friend) => (
            <ListItem
              key={friend.userId}
              sx={{
                borderRadius: 1,
                mb: 1,
                bgcolor: "background.paper",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={friend.profilePic || undefined}
                  alt={friend.username}
                  sx={{
                    bgcolor: friend.profilePic ? "transparent" : "primary.main",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {!friend.profilePic &&
                    friend.username.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={friend.username}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FriendsList;
