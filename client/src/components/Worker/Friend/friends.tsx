export interface Friend {
  userId: string | number;
  name: string;
  username: string;
  avatar: string;
  friendshipStatus?:
    | "none"
    | "pending_sent"
    | "pending_received"
    | "accepted"
    | "rejected";
}

export interface Worker {
  userId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  username?: string;
  profilePic?: string;
  friendshipStatus?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
