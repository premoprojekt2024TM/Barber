import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Box, Divider, Collapse, Button, Typography, CircularProgress } from '@mui/material';
import { ChevronDown } from 'lucide-react'; 
import { hungarianPoints } from './cities'; 

const ListView: React.FC = () => {

  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  
  useEffect(() => {
    setTimeout(() => {
      if (hungarianPoints?.features) {
        setLoading(false);
      } else {
        console.error("No data found in hungarianPoints.features");
        setLoading(false);
      }
    }, 1000);
  }, []);
  
  const handleExpandClick = (index: number) => {
    
    setExpanded(expanded === index ? null : index);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!hungarianPoints?.features || hungarianPoints.features.length === 0) {
    return <Typography variant="h6" sx={{ padding: 2 }}>No points available</Typography>;
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        clipPath: 'inset(0 0 70px 0)',
      }}
    >
      <List
        sx={{
          overflowY: 'auto',
          maxHeight: 'calc(100% - 40px)',
          '&::-webkit-scrollbar': {
            display: 'none', 
          },
          scrollbarWidth: 'none', 
        }}
      >
        {hungarianPoints.features.map((point, index) => (
          <div key={index}>
            <ListItem
              sx={{
                '&:hover': {
                  backgroundColor: '#f5f5f5', 
                  cursor: 'pointer', 
                },
              }}
            >
              <ListItemText
                primary={<Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 'bold' }}>{point.properties.title}</Typography>}
                secondary={<Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>{point.properties.description}</Typography>}
              />
              <Button
                variant="text"
                onClick={() => handleExpandClick(index)} 
                sx={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  textTransform: 'none',
                  padding: '4px 0',
                }}
              >
                Részletek
                <ChevronDown size={16} style={{ marginLeft: '-8px', verticalAlign: 'middle' }} /> 
              </Button>
            </ListItem>

            <Collapse in={expanded === index} timeout="auto" unmountOnExit>
              <Box sx={{ padding: '10px 0', fontSize: '16px', color: 'text.primary' }}>
                <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                  <strong>Additional Details:</strong> {point.properties.additionalDetails || 'No additional details available.'}
                </Typography>
              </Box>
            </Collapse>

            <Divider sx={{ margin: '10px 0' }} />
          </div>
        ))}
      </List>
    </Box>
  );
};

export default ListView;
