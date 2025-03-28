export interface Workplace {
  id: number;
  name: string;
  position: string;
  address: string;
  isActive: boolean;
}

export interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface Booking {
  id: number;
  type: string;
  date: string;
  time: string;
  address: string;
  storeName: string;
  cityName: string;
}
