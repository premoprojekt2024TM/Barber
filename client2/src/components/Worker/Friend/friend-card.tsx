import { useState } from "react";
import { UserPlus, Check, Clock, UserMinus, UserX } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import type { Friend } from "./friends";

interface FriendCardProps {
  friend: Friend;
  onFriendStatusChange?: () => void;
}

export default function FriendCard({
  friend,
  onFriendStatusChange,
}: FriendCardProps) {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSendFriendRequest = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("jwt_token");

      await axios.post(
        "http://localhost:8080/api/v1/sendFriendRequest",
        { friendId: friend.userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotification({
        open: true,
        message: "Baráti kérelem elküldve",
        severity: "success",
      });

      if (onFriendStatusChange) {
        onFriendStatusChange();
      }
    } catch (error: any) {
      console.error("Error sending friend request:", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "Nem sikerült elküldeni a kérelmet",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFriendRequest = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("jwt_token");

      await axios.post(
        "http://localhost:8080/api/v1/acceptFriendRequest",
        { friendId: friend.userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotification({
        open: true,
        message: "Baráti kérelem elfogadva",
        severity: "success",
      });

      if (onFriendStatusChange) {
        onFriendStatusChange();
      }
    } catch (error: any) {
      console.error("Error accepting friend request:", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "Nem sikerült elfogadni a kérelmet",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFriendship = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("jwt_token");

      await axios.delete("http://localhost:8080/api/v1/deleteFriendship", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { friendId: friend.userId },
      });

      setNotification({
        open: true,
        message: "Barátság törölve",
        severity: "success",
      });

      if (onFriendStatusChange) {
        onFriendStatusChange();
      }
    } catch (error: any) {
      console.error("Error deleting friendship:", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "Nem sikerült törölni a barátságot",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const renderFriendshipButton = () => {
    switch (friend.friendshipStatus) {
      case "pending_sent":
        return (
          <button
            className="px-4 py-2 text-sm font-medium rounded-full bg-slate-200 text-slate-700 mt-1.5 opacity-70 flex items-center gap-2"
            disabled
          >
            <Clock className="w-4 h-4" />
            Kérelem elküldve
          </button>
        );
      case "pending_received":
        return (
          <div className="flex gap-2 mt-1.5">
            <button
              className="px-3 py-2 text-sm font-medium rounded-full bg-black hover:bg-slate-800 text-white flex items-center gap-1 transition-colors"
              onClick={handleAcceptFriendRequest}
              disabled={loading}
            >
              <Check className="w-4 h-4" />
              Elfogad
            </button>
            <button
              className="px-3 py-2 text-sm font-medium rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center gap-1 transition-colors"
              onClick={handleDeleteFriendship}
              disabled={loading}
            >
              <UserX className="w-4 h-4" />
              Elutasít
            </button>
          </div>
        );
      case "accepted":
        return (
          <button
            className="px-4 py-2 text-sm font-medium rounded-full bg-green-100 hover:bg-red-100 text-green-700 hover:text-red-700 mt-1.5 flex items-center gap-2 transition-all"
            onClick={handleDeleteFriendship}
            disabled={loading}
          >
            <UserMinus className="w-4 h-4 transition-all" />
            <span className="transition-all">Barátság megszüntetése</span>
          </button>
        );
      case "rejected":
        return (
          <button
            className="px-5 py-2 text-sm font-medium rounded-full bg-black hover:bg-slate-800 text-white mt-1.5 flex items-center gap-2 transition-colors"
            onClick={handleSendFriendRequest}
            disabled={loading}
          >
            <UserPlus className="w-4 h-4" />
            Újra küldés
          </button>
        );
      case "none":
      default:
        return (
          <button
            className="px-5 py-2 text-sm font-medium rounded-full bg-black hover:bg-slate-800 text-white mt-1.5 flex items-center gap-2 transition-colors"
            onClick={handleSendFriendRequest}
            disabled={loading}
          >
            <UserPlus className="w-4 h-4" />
            Barát hozzáadása
          </button>
        );
    }
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
            {renderFriendshipButton()}
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
