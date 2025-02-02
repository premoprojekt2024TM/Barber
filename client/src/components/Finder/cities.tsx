interface Store {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: number;
  }
  
  interface StoreApiResponse {
    message: string;
    stores: Store[];
  }
  
  let hungarianPoints: any = null;
  
  async function fetchStoreData(): Promise<void> {
    try {
      const response = await fetch('http://localhost:8080/api/Store');
  
      if (!response.ok) {
        throw new Error('Failed to fetch store data');
      }
  
      const data: StoreApiResponse = await response.json();
      const stores = data.stores;
      
      const geoJsonFeatures = stores.map((store) => {
        return {
          type: 'Feature',
          properties: {
            title: store.city,
            description: store.description, 
          },
          geometry: {
            type: 'Point',
            coordinates: [store.longitude, store.latitude], 
          },
        };
      });
  
      hungarianPoints = {
        type: 'FeatureCollection',
        features: geoJsonFeatures,
      };
  
    } catch (error) {
      console.error('Error fetching store data:', error);
    }
  }
  
  fetchStoreData().then(() => {
    if (hungarianPoints) {
      console.log('Hungarian Points:', JSON.stringify(hungarianPoints, null, 2));
    }
  });
  
  export { hungarianPoints };
  