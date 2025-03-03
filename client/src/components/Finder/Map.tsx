import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button, ButtonGroup, Box, Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IsoIcon from '@mui/icons-material/Iso';
import { hungarianPoints } from './cities';

const MAPBOX_TOKEN = "pk.eyJ1IjoibWFyY2VsbHRlbWxlaXRuZXIiLCJhIjoiY201MWVycDVtMW52ZTJpcXc5aGJpMDJkaCJ9.z3ZnN8MWLZo5F8KbrjYYlw";
const STYLE_URL = `https://api.mapbox.com/styles/v1/marcelltemleitner/cm51gxg7l00cb01qyhqgdd01i?access_token=${MAPBOX_TOKEN}`;

const DEFAULT_CENTER = [19.513, 47] as [number, number];
const DEFAULT_ZOOM = 6.50;
const MAX_BOUNDS = [
  [16.113, 45.000],
  [22.913, 48.900]
] as mapboxgl.LngLatBoundsLike;

const setupMapClustering = (map: mapboxgl.Map, pointsData: GeoJSON.FeatureCollection) => {
  map.addSource('points', {
    type: 'geojson',
    data: pointsData,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'points',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        5,
        '#f1f075',
        10,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        5,
        25,
        10,
        30
      ]
    }
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'points',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'points',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 6,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    const clusterId = features[0]?.properties?.cluster_id;
    if (clusterId) {
      (map.getSource('points') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        const newZoom = zoom ?? 10; 
        map.easeTo({
          zoom: newZoom
        });
      });
    }
  });

  map.on('click', 'unclustered-point', (e) => {
    const geometry = e.features![0].geometry;
    
    if (geometry.type === 'Point') {
      const coordinates = geometry.coordinates;
      const { title, description } = e.features![0].properties as { title: string, description: string };

      new mapboxgl.Popup()
        .setLngLat([coordinates[0], coordinates[1]]) 
        .setHTML(`<strong>${title}</strong><br>${description}`)
        .addTo(map);
    }
  });

  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });
};

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleReset = () => {
    map.current?.jumpTo({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM
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
      minZoom: DEFAULT_ZOOM,
      maxZoom: 15,
      scrollZoom: true,
      maxBounds: MAX_BOUNDS,
    });

    map.current.on('load', () => {
      if (map.current) {
        setupMapClustering(map.current, hungarianPoints);
        handleReset();
      }
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const buttons = [
    <Button key="zoomIn" variant="contained" color="primary" onClick={handleZoomIn} sx={{ minWidth: '25px', height: '30px', padding: '0 5px' }}>
      <AddIcon fontSize="small" />
    </Button>,
    <Button key="zoomOut" variant="contained" color="primary" onClick={handleZoomOut} sx={{ minWidth: '25px', height: '30px', padding: '0 5px' }}>
      <RemoveIcon fontSize='small' />
    </Button>
  ];

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', paddingTop: '20px', height: '100vh' }}>
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          clipPath: 'inset(0 0 70px 0)',
        }}
      />

      <Box sx={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <ButtonGroup orientation="vertical" aria-label="Zoom Controls" sx={{ '& .MuiButton-root': { minWidth: '25px', height: '30px', padding: '0 5px' } }}>
          {buttons}
        </ButtonGroup>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleReset} 
          sx={{ minWidth: 25, height: 30, padding: '0 5px' }}
        >
          <IsoIcon fontSize="small" />
        </Button>
      </Box>
    </Container>
  );
};

export default Map;
