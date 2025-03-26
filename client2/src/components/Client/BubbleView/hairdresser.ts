export interface Hairdresser {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  hasAvailability: boolean;
  nextAvailable: string;
  appointments?: string[];
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
