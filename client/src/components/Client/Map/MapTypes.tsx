export interface FeatureCollection {
  type: string;
  features: Feature[];
}
export interface Feature {
  image: string;
  text: string;
  linkGoto: string;
}

export interface ApiResponse {
  status: number;
  data: FeatureCollection | { message: string };
  error?: string;
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

export interface PopoverProps {
  popoverInfo: {
    name: string;
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
