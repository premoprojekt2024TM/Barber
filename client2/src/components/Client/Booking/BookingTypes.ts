export interface Store {
  storeId: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  picture?: string;
  workers: Worker[];
}

export interface Worker {
  workerId: number;
  workerUsername: string;
  workerFirstName: string;
  workerLastName: string;
  workerImage?: string;
  availability: AvailabilitySlot[];
}

export interface AvailabilitySlot {
  day: string;
  timeSlot: string;
  status: "available" | "unavailable";
}

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedWorker: number | null;
  selectedDay: string | null;
  selectedTime: string | null;
  storeData: Store | null;
}
