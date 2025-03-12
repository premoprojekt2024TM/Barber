import { Box, Typography, Divider } from "@mui/material";
import FriendCard from "./FriendCard";
import { Friend } from "./Friend";

interface FriendsListProps {
  friends: Friend[];
  searchQuery: string;
}

export default function FriendsList({
  friends,
  searchQuery,
}: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 5,
          px: 3,
          borderRadius: 3,
          background: "rgba(15, 23, 42, 0.5)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "30%",
            borderRadius: "12px 12px 0 0",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
            pointerEvents: "none",
          },
        }}
      >
        <Typography variant="h6" color="white">
          Nem található ilyen nevű felhasználó: "{searchQuery}"
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.6)", mt: 1 }}
        >
          Sajnos nem jártunk sikerrel.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}></Typography>
      </Box>
      <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />
      {friends.map((friend) => (
        <FriendCard key={friend.userId} friend={friend} />
      ))}
    </Box>
  );
}
