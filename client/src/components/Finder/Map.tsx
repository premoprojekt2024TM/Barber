import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button, Box, Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { hungarianPoints } from "./cities";
import Popover from "./Popover";

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

const setupMapClustering = (
  map: mapboxgl.Map,
  pointsData: GeoJSON.FeatureCollection,
  setPopoverInfo: (info: any) => void
) => {
  map.addSource("points", {
    type: "geojson",
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

    const coordinates =
      features[0].geometry.type === "Point"
        ? ((features[0].geometry as GeoJSON.Point).coordinates.slice() as [
            number,
            number
          ])
        : DEFAULT_CENTER;

    if (clusterId) {
      (
        map.getSource("points") as mapboxgl.GeoJSONSource
      ).getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        const newZoom = zoom ?? map.getZoom() + 1;
        map.easeTo({
          center: coordinates,
          zoom: newZoom,
          duration: 500, 
        });
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
        imageUrl:
          properties.picture ||
          "https://api.bwnet.hu/media/salons/2215/header/62ce959d1cd4c.jpg",
        id:
          properties.storeId ||
          e.features![0].id ||
          Math.random().toString(36).substring(2, 9),
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

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [popoverInfo, setPopoverInfo] = useState({
    title: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    imageUrl: "https://api.bwnet.hu/media/salons/2215/header/62ce959d1cd4c.jpg",
    id: "",
    visible: false,
    location: "",
    city: "",
  });

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleReset = () => {
    map.current?.fitBounds(MAX_BOUNDS, {
      padding: 50,
      animate: true,
    });
  };

  const handleClosePopover = () => {
    setPopoverInfo({
      ...popoverInfo,
      visible: false,
    });
  };

  useEffect(() => {
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
        setupMapClustering(map.current, hungarianPoints, setPopoverInfo);

        map.current.fitBounds(MAX_BOUNDS, {
          padding: 50,
          animate: false,
        });
      }
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const buttons = [
    <Button
      key="zoomIn"
      variant="contained"
      color="primary"
      onClick={handleZoomIn}
      sx={{ minWidth: "25px", height: "30px", padding: "0 5px" }}
    >
      <AddIcon fontSize="small" />
    </Button>,
    <Button
      key="zoomOut"
      variant="contained"
      color="primary"
      onClick={handleZoomOut}
      sx={{ minWidth: "25px", height: "30px", padding: "0 5px" }}
    >
      <RemoveIcon fontSize="small" />
    </Button>,
    <Button
      key="reset"
      variant="contained"
      color="primary"
      onClick={handleReset}
      sx={{ minWidth: "25px", height: "30px", padding: "0 5px" }}
    >
      Reset
    </Button>,
  ];

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "20px",
        height: "100vh",
      }}
    >
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <Popover popoverInfo={popoverInfo} handleClose={handleClosePopover} />

      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {buttons}
      </Box>
    </Container>
  );
};

export default Map;
