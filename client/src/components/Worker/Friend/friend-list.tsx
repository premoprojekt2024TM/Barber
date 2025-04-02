import FriendCard from "./friend-card";
import type { Friend } from "./friends";

interface FriendsListProps {
  friends: Friend[];
  searchQuery: string;
  onFriendStatusChange?: () => void;
}

export default function FriendsList({
  friends,
  searchQuery,
  onFriendStatusChange,
}: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <div className="relative py-5 px-3 rounded-xl text-center bg-white/80 backdrop-blur-xl shadow-lg border border-white/20">
        <div className="absolute inset-x-0 top-0 h-[30%] rounded-t-xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        <h2 className="text-lg font-semibold text-slate-800">
          Nem található ilyen nevű felhasználó: "{searchQuery}"
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Sajnos nem jártunk sikerrel.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-slate-800"></h2>
      </div>
      <div className="mb-3 border-t border-slate-200" />
      <div className="space-y-2">
        {friends.map((friend) => (
          <FriendCard
            key={friend.userId}
            friend={friend}
            onFriendStatusChange={onFriendStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
