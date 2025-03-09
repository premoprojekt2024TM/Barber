import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  mutualFriends: number;
  isOnline: boolean;
}

interface FriendCardProps {
  friend: Friend;
}

export default function FriendCard({ friend }: FriendCardProps) {
  return (
    <Card
      sx={{
        display: "flex",
        mb: 2,
        borderRadius: 3,
        background: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
          transform: "translateY(-2px)",
          background: "rgba(15, 23, 42, 0.6)",
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          backdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 0,
        }}
      >
        <Avatar
          src={friend.avatar}
          alt={friend.name}
          sx={{
            width: 80,
            height: 80,
            border: `3px solid "rgba(200, 200, 200, 0.3)`,
            boxShadow: "0 4px 14px 0 rgba(31, 38, 135, 0.3)",
            zIndex: 2,
          }}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent sx={{ flex: "1 0 auto", py: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              lineHeight: 1,
            }}
          >
            <Typography
              component="div"
              variant="h6"
              sx={{
                color: "white",
                marginTop: "10px",
                mb: 0,
                lineHeight: 1.2,
              }}
            >
              {friend.name}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mt: 0,
                lineHeight: 1.2,
              }}
              component="div"
            >
              @{friend.username}
            </Typography>
          </Box>
        </CardContent>
        <Box
          sx={{ display: "flex", alignItems: "center", pl: 1, pb: 2, gap: 1 }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<PersonAddIcon />}
            sx={{ fontSize: "0.7rem", marginTop: "5px" }}
          >
            Barát hozzáadása
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
