import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button, ButtonGroup, Box, Container } from '@mui/material';
import { Plus, Minus, Diff } from 'lucide-react'; 
import { hungarianPoints } from './cities'; 
import * as dotenv from 'dotenv';

dotenv.config();


const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

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
    const clusterId = features[0].properties.cluster_id;
    map.getSource('points').getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      });
    });
  });

  map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features![0].geometry.coordinates.slice();
    const { title, description } = e.features![0].properties;

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`<strong>${title}</strong><br>${description}`)
      .addTo(map);
  });

  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });
};

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const handleZoomIn = () => map.current?.zoomTo((map.current?.getZoom() || 0) + 1);
  const handleZoomOut = () => map.current?.zoomTo((map.current?.getZoom() || 0) - 1);
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
      setupMapClustering(map.current, hungarianPoints);
      handleReset();
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const buttons = [
    <Button key="zoomIn" variant="contained" color="primary" onClick={handleZoomIn} sx={{ minWidth: '25px', height: '30px', padding: '0 5px' }}>
      <Plus size={14} />
    </Button>,
    <Button key="zoomOut" variant="contained" color="primary" onClick={handleZoomOut} sx={{ minWidth: '25px', height: '30px', padding: '0 5px' }}>
      <Minus size={14} />
    </Button>
  ];

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>

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
            <Diff size={14} />
          </Button>
        </Box>
    </Container>
  );
};

export default Map;
