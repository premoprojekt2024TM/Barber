import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';
import { Search, SlidersHorizontal } from 'lucide-react';
import Map from '../finder/Map';
import ListView from '../finder/ListView';

const FinderGrid: React.FC = () => {
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue1(event.target.value);
  };

  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue2(event.target.value);
  };

  const handleSubmit = () => {
    console.log('First Input:', inputValue1);
    console.log('Second Input:', inputValue2);
  };

  const handleViewSwitch = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  return (
    <Grid 
      container 
      justifyContent="center" 
      alignItems="center" 
      sx={{
        minHeight: '100vh', 
        transform: 'scale(0.95)', 
        transformOrigin: 'top center',
        overflow: 'hidden', 
      }}
    >
      <Box 
        sx={{
          width: '90%',
          height: '90vh',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'flex-start',
          gap: '1%',
          borderRadius: '8px',
          position: 'relative',
          flexDirection: 'row', 
          overflow: 'hidden', 
        }}
      >
        <FormControl fullWidth>
          <TextField
            id="input-field-1"
            value={inputValue1}
            onChange={handleInputChange1}
            variant="outlined" 
            fullWidth
            placeholder="Enter something"
            sx={{ flexShrink: 0 }} 
          />
        </FormControl>
        
        <Button 
          variant="contained"
          onClick={handleSubmit}
          sx={{
            width: 'auto',
            marginBottom: '20px',
            alignSelf: 'flex-start',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            minWidth: 'fit-content',
          }}
          aria-label="Search"
        >
          <Search size={20} />
        </Button>

        <Button
          variant="outlined"
          onClick={handleViewSwitch}
          sx={{
            width: '250px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: '16px',
            marginBottom: '20px',
          }}
        >
          {viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
        </Button>

        <Button 
          variant="contained"
          onClick={handleSubmit}
          sx={{
            width: 'auto',
            marginBottom: '20px',
            padding: '10px 20px',
            display: 'flex',  
            alignItems: 'center',
            minWidth: 'fit-content',
          }}
          aria-label="Adjust settings"
        >
          <SlidersHorizontal size={20} />
        </Button>

        <Box
          sx={{
            width: '100%',
            height: '93%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '8px',
            position: 'absolute',
            bottom: 0,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: viewMode === 'grid' ? 'block' : 'none',
              width: '100%',
              height: '100%',
            }}
          >
            <Map />
          </Box>

          <Box
            sx={{
              display: viewMode === 'list' ? 'block' : 'none',
              width: '100%',
              height: '100%',
            }}
          >
            <ListView />
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default FinderGrid;
