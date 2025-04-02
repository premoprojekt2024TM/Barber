export interface Appointment {
  appointmentId: number;
  client: {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    profilePic: string;
  };
  timeSlot: {
    day: string;
    timeSlot: string;
  };
  status: string;
  notes: string | null;
}

export interface AppointmentPopoverProps {
  appointments: Appointment[];
  anchor: HTMLElement | null;
  onClose: () => void;
}
