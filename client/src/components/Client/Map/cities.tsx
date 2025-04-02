import { axiosInstance } from "../../../utils/axiosinstance";
import { FeatureCollection, ApiResponse, Store } from "./MapTypes";

export let hungarianPoints: FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

export const getStores = async (): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.get("/api/v1/Store");
    let storesData: Store[] = [];

    if (!response.data || !Array.isArray(response.data)) {
      storesData = Array.isArray(response.data)
        ? response.data
        : response.data?.stores
          ? response.data.stores
          : response.data?.data
            ? response.data.data
            : [];

      if (!Array.isArray(storesData)) {
        throw new Error("Nem sikerült lekérdezni a boltokat");
      }
    } else {
      storesData = response.data;
    }

    const transformedFeatures = storesData.map((store) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(store.longitude || "0"),
          parseFloat(store.latitude || "0"),
        ],
      },
      properties: {
        name: store.name || "",
        description: store.description || "",
        address: store.address || "",
        phone: store.phone || "",
        email: store.email || "",
        city: store.city || "",
        picture: store.picture || "/placeholder.svg",
        storeId: store.storeId || "",
      },
    }));

    hungarianPoints = {
      type: "FeatureCollection",
      // @ts-ignore
      features: transformedFeatures,
    };

    return { status: 200, data: hungarianPoints };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: "Szerver hiba" },
      error: error.message || "Ismeretlen hiba",
    };
  }
};
