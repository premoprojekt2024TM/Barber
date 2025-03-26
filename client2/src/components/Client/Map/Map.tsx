import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { hungarianPoints, getStores } from "./cities";
import Popover from "./popover";
import ZoomControls from "./zoom-controls";
import BackButton from "./back-button";
import { useNavigate } from "react-router-dom";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWFyY2VsbHRlbWxlaXRuZXIiLCJhIjoiY201MWVycDVtMW52ZTJpcXc5aGJpMDJkaCJ9.z3ZnN8MWLZo5F8KbrjYYlw";
const STYLE_URL = `https://api.mapbox.com/styles/v1/marcelltemleitner/cm51gxg7l00cb01qyhqgdd01i?access_token=${MAPBOX_TOKEN}`;
const DEFAULT_CENTER = [19.513, 47] as [number, number];
const DEFAULT_ZOOM = 12;
const MIN_ZOOM = 6;
const MAX_BOUNDS = [
  [16.113, 45.0],
  [22.913, 48.9],
] as mapboxgl.LngLatBoundsLike;

interface GeoJSON {
  type: string;
  features: any[];
}

const setupMapClustering = (
  map: mapboxgl.Map,
  pointsData: GeoJSON,
  setPopoverInfo: (info: any) => void,
) => {
  if (map.getSource("points")) {
    map.removeLayer("clusters");
    map.removeLayer("cluster-count");
    map.removeLayer("unclustered-point");
    map.removeSource("points");
  }

  map.addSource("points", {
    type: "geojson",
    //@ts-ignore
    data: pointsData,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "points",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#ffffff",
        5,
        "#ffffff",
        10,
        "#ffffff",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 5, 25, 10, 30],
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "points",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 15,
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "points",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#fff",
      "circle-radius": 20,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });

  map.on("click", "clusters", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0]?.properties?.cluster_id;
    let coordinates: mapboxgl.LngLatLike;

    if (features[0]?.geometry?.type === "Point") {
      const pointCoords = (features[0].geometry as GeoJSON.Point).coordinates;
      coordinates = [pointCoords[0], pointCoords[1]] as [number, number];
    } else {
      coordinates = DEFAULT_CENTER;
    }

    if (clusterId) {
      (
        map.getSource("points") as mapboxgl.GeoJSONSource
      ).getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        const newZoom = zoom ?? map.getZoom() + 1;
        map.easeTo({ center: coordinates, zoom: newZoom, duration: 500 });
      });
    }
  });

  map.on("click", "unclustered-point", (e) => {
    const geometry = e.features![0].geometry;
    if (geometry.type === "Point") {
      const coordinates = geometry.coordinates;
      const properties = e.features![0].properties || {};
      setPopoverInfo({
        title: properties.name || "Store",
        description: properties.description || "Store description.",
        address: properties.address || "Unknown",
        phone: properties.phone || "No phone",
        email: properties.email || "No email",
        city: properties.city || "No city",
        picture: properties.picture || "No city",
        storeId: properties.storeId || "No Id",
        visible: true,
        location: `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`,
      });
    }
  });

  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });

  map.on("mouseenter", "unclustered-point", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "unclustered-point", () => {
    map.getCanvas().style.cursor = "";
  });
};

const mapStyles = `
  .mapboxgl-canvas-container,
  .mapboxgl-canvas {
    width: 100% !important;
    height: 100% !important;
  }

  .mapboxgl-map {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popoverInfo, setPopoverInfo] = useState({
    title: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    picture: "",
    storeId: "",
    visible: false,
    location: "",
    city: "",
  });

  const navigate = useNavigate();

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleReset = () => {
    map.current?.fitBounds(MAX_BOUNDS, { padding: 50, animate: true });
  };

  const handleClosePopover = () => {
    setPopoverInfo({ ...popoverInfo, visible: false });
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const result = await getStores();
        if (result.status !== 200) {
          throw new Error("Nem sikerült lekérdezni az adatokat.");
        }
        setLoading(false);
        if (map.current && map.current.loaded()) {
          setupMapClustering(
            map.current,
            hungarianPoints as GeoJSON,
            setPopoverInfo,
          );
        }
      } catch (err) {
        setError("Nem sikerült betölteni az üzleteket");
        setLoading(false);
      }
    };

    fetchStores();
  }, []);
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = mapStyles;
    document.head.appendChild(style);

    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: STYLE_URL,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: 15,
      scrollZoom: true,
      maxBounds: MAX_BOUNDS,
      attributionControl: false,
    });

    map.current.on("load", () => {
      if (map.current) {
        setupMapClustering(
          map.current,
          hungarianPoints as GeoJSON,
          setPopoverInfo,
        );

        map.current.fitBounds(MAX_BOUNDS, {
          padding: 50,
          animate: false,
        });
        map.current.resize();
      }
    });
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      map.current?.remove();
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <div ref={mapContainer} className="w-full h-full absolute inset-0" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
          <div className="bg-white p-4 rounded-lg">Boltok betöltése...</div>
        </div>
      )}
      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-20">
          {error}
        </div>
      )}
      <Popover popoverInfo={popoverInfo} handleClose={handleClosePopover} />
      <div className="absolute top-5 right-5 z-10 flex flex-col gap-2">
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
        />
      </div>
      <div className="absolute top-5 left-5 z-10">
        <BackButton onClick={handleBackButtonClick} />
      </div>
    </div>
  );
};

export default Map;
