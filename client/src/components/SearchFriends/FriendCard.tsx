import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";
import Cookies from "js-cookie";
import { Friend } from "../types/Friend"; // Import from centralized type

interface FriendCardProps {
  friend: Friend;
}

export default function FriendCard({ friend }: FriendCardProps) {
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Fetch sent friend requests when component mounts
  useEffect(() => {
    const checkSentRequests = async () => {
      try {
        const token = Cookies.get("jwt_token");
        const response = await axios.get(
          "http://localhost:8080/api/v1/getSentFriendRequests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (
          response.data &&
          response.data.sentFriendRequestIds &&
          response.data.sentFriendRequestIds.includes(parseInt(friend.userId))
        ) {
          setRequestSent(true);
        }
      } catch (error) {
        console.error("Error checking sent friend requests:", error);
      }
    };

    checkSentRequests();
  }, [friend.userId]);

  const handleSendFriendRequest = async () => {
    try {
      setLoading(true);

      // Get JWT token from cookies
      const token = Cookies.get("jwt_token");

      // Send request directly to backend endpoint
      const response = await axios.post(
        "http://localhost:8080/api/v1/sendFriendRequest",
        { friendId: friend.userId }, // Using userId consistently
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRequestSent(true);
      setNotification({
        open: true,
        message: "Friend request sent successfully",
        severity: "success",
      });
    } catch (error: any) {
      console.error("Error sending friend request:", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "Failed to send friend request",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
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
              boxShadow: "0 4px 14px 0 rgba(106, 107, 114, 0.3)",
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
            {requestSent ? (
              <Button
                variant="contained"
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  marginTop: "5px",
                  opacity: 0.7,
                  color: "white", // Set the font color to white
                }}
              >
                Kérelem elküldve
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                startIcon={<PersonAddIcon />}
                onClick={handleSendFriendRequest}
                disabled={loading}
                sx={{ fontSize: "0.7rem", marginTop: "5px" }}
              >
                Barát hozzáadása
              </Button>
            )}
          </Box>
        </Box>
      </Card>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
