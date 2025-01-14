import React from 'react';
import { IconButton, Box } from '@mui/material';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'; 

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ onZoomIn, onZoomOut, onReset }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        zIndex: 1000, 
      }}
    >
      <IconButton
        onClick={onZoomIn}
        sx={{
          backgroundColor: 'white',
          boxShadow: 2,
          '&:hover': {
            backgroundColor: '#f0f0f0', 
          },
        }}
        aria-label="Zoom in"
      >
        <ZoomIn size={24} color="#333" />  
      </IconButton>

      <IconButton
        onClick={onZoomOut}
        sx={{
          backgroundColor: 'white',
          boxShadow: 2,
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
        aria-label="Zoom out"
      >
        <ZoomOut size={24} color="#333" />  
      </IconButton>

      <IconButton
        onClick={onReset}
        sx={{
          backgroundColor: 'white',
          boxShadow: 2,
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
        aria-label="Reset view"
      >
        <RotateCcw size={24} color="#333" /> 
      </IconButton>
    </Box>
  );
};

export default MapControls;
