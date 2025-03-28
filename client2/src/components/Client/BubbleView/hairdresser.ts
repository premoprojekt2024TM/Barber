export interface Hairdresser {
  id: number;
  name: string;
  hasAvailability: boolean;
  appointments?: string[];
  profilePic: string;
  availability?: {
    [key: string]: {
      timeSlot: string;
      status: string;
    }[];
  };
}

export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "bubble" | "list";
  setViewMode: (mode: "bubble" | "list") => void;
}

export interface AppointmentPopoverProps {
  hairdresser: Hairdresser;
  position: { x: number; y: number };
  onClose: () => void;
}
