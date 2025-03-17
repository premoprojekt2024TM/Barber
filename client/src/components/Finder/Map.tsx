import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button, Box, Container, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { hungarianPoints } from "./cities";

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
  setPopoverInfo: (info: any) => void,
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
        "#51bbd6",
        5,
        "#f1f075",
        10,
        "#f28cb1",
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
      "text-size": 12,
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "points",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 6,
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
            number,
          ])
        : DEFAULT_CENTER;

    if (clusterId) {
      (
        map.getSource("points") as mapboxgl.GeoJSONSource
      ).getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        const newZoom = zoom ?? map.getZoom() + 1;

        // Center the map on the clicked cluster when zooming in
        map.easeTo({
          center: coordinates,
          zoom: newZoom,
          duration: 500, // Animation duration in milliseconds
        });
      });
    }
  });

  map.on("click", "unclustered-point", (e) => {
    const geometry = e.features![0].geometry;

    if (geometry.type === "Point") {
      const coordinates = geometry.coordinates;
      const properties = e.features![0].properties || {};

      // Use the actual properties from the feature
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

  // Improve cursor interaction feedback
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

      {popoverInfo.visible && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            left: "20px",
            top: "20px",
            width: "350px",
            maxWidth: "90%",
            zIndex: 1000,
            overflow: "hidden",
            borderRadius: "4px",
            pointerEvents: "auto",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <img
              src={popoverInfo.imageUrl}
              alt={popoverInfo.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />
            <Button
              size="small"
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                minWidth: "30px",
                width: "30px",
                height: "30px",
                padding: 0,
                backgroundColor: "white",
                color: "black",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
              onClick={handleClosePopover}
            >
              <CloseIcon fontSize="small" />
            </Button>
          </Box>

          <Box sx={{ p: 2 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
              {popoverInfo.city}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {popoverInfo.address}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              Address: {popoverInfo.address}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              Phone: {popoverInfo.phone}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
              Email: {popoverInfo.email}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                mb: 1,
              }}
            >
              Időpont foglalása
            </Button>
          </Box>
        </Paper>
      )}

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
