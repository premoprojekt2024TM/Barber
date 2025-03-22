import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import type { Friend } from "./friends";

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
          response.data.sentFriendRequestIds.includes(
            Number.parseInt(friend.userId),
          )
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
        { friendId: friend.userId },
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
      <div
        className="relative flex mb-2 rounded-xl overflow-hidden
  bg-white/80 backdrop-blur-xl shadow-lg border border-white/20
  transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5
  before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-[30%]
  before:bg-gradient-to-b before:from-white/30 before:to-transparent
  before:pointer-events-none before:z-10"
      >
        <div className="flex flex-col items-center p-2 z-0">
          <div className="w-20 h-20 shadow-md z-20 rounded-full overflow-hidden">
            <img
              src={friend.avatar || "/placeholder.svg"}
              alt={friend.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col flex-grow">
          <div className="flex-1 py-1">
            <div className="flex flex-col gap-0 leading-tight mt-2.5">
              <h3 className="text-slate-900 text-lg font-semibold leading-tight">
                {friend.name}
              </h3>
              <p className="text-slate-600 leading-tight">@{friend.username}</p>
            </div>
          </div>

          <div className="flex items-center pl-1 pb-2 gap-1">
            {requestSent ? (
              <button
                className="px-4 py-2 text-sm font-medium rounded-full bg-slate-200 text-slate-700 mt-1.5 opacity-70"
                disabled
              >
                Kérelem elküldve
              </button>
            ) : (
              <button
                className="px-5 py-2 text-sm font-medium rounded-full bg-black hover:bg-slate-800 text-white mt-1.5 flex items-center gap-2 transition-colors"
                onClick={handleSendFriendRequest}
                disabled={loading}
              >
                <UserPlus className="w-4 h-4" />
                Barát hozzáadása
              </button>
            )}
          </div>
        </div>
      </div>

      {notification.open && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg z-50
          ${notification.severity === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          {notification.message}
          <button
            onClick={handleCloseNotification}
            className="ml-2 text-white/80 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
