// src/types.ts
import { ZodError } from "zod";
import { MouseEvent } from "react";

export interface ErrorResponse {
  message: string;
}

export interface PopoverProps {
  popoverInfo: {
    title: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    picture: string;
    storeId: string;
    visible: boolean;
    location: string;
    city: string;
  };
  handleClose: () => void;
}

export interface Feature {
  image: string;
  text: string;
  linkGoto: string;
}

export interface FeatureCollection {
  type: string;
  features: Feature[];
}

export interface ApiResponse {
  status: number;
  data: FeatureCollection | { message: string };
  error?: string;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "info" | "success" | "error";
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginErrors {
  email: string | null;
  password: string | null;
}

export interface Availability {
  day: string;
  timeSlot: string;
  status: "available" | "booked";
}

export interface Worker {
  workerId: number;
  WorkerFirstName: string;
  WorkerLastName: string;
  workerName: string;
  workerImage: string;
  availability: Availability[];
}

export interface Store {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
  picture?: string;
  storeId?: string;
  longitude?: string;
  latitude?: string;
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

export interface UserInfo {
  username?: string;
  email?: string;
  profilePic?: string;
}

// Props for the AppBar component
export interface AppBarProps {
  // Add any props if needed
}

// Menu state
export interface MenuState {
  anchorEl: HTMLElement | null;
  open: boolean;
}

export interface Feature {
  image: string;
  text: string;
  linkGoto: string;
}

// Component props (if needed in the future)
export interface FeaturesProps {
  customFeatures?: Feature[];
}

// Type for our state variables
export type IndexState = number | null;
