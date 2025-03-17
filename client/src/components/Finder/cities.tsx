import { axiosInstance } from "../../utils/axiosInstance";

interface Store {
  storeId: number;
  name: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  picture: string;
}

interface StoreApiResponse {
  message: string;
  stores: Store[];
}

let hungarianPoints: any = null;

async function fetchStoreData(): Promise<void> {
  try {
    const response = await axiosInstance.get<StoreApiResponse>("/api/v1/Store");

    if (response.status === 200) {
      const stores = response.data.stores;

      const geoJsonFeatures = stores.map((store) => {
        return {
          type: "Feature",
          properties: {
            id: store.storeId, // Store ID
            title: store.name, // Store name
            city: store.city, // City// Description
            address: store.address, // Address
            phone: store.phone, // Phone number
            email: store.email, // Email address
            pictureUrl: store.picture, // Store picture URL
            location: `${store.latitude.toFixed(4)}, ${store.longitude.toFixed(4)}`, // Location
          },
          geometry: {
            type: "Point",
            coordinates: [store.longitude, store.latitude], // [longitude, latitude]
          },
        };
      });

      hungarianPoints = {
        type: "FeatureCollection",
        features: geoJsonFeatures,
      };
    }
  } catch (error) {
    console.error("Error fetching store data", error);
  }
}

fetchStoreData();

export { hungarianPoints };
