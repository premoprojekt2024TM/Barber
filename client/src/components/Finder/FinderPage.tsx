import React, { useState } from 'react';
import { Grid, Box, Button, TextField, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import Map from './Map';
import ListView from './ListView';

const FinderPage = () => {
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => setInputValue1(event.target.value);
  const handleSubmit = () => {
    console.log('First Input:', inputValue1);
    console.log('Second Input:', inputValue2);
  };
  const handleViewSwitch = () => setViewMode(viewMode === 'grid' ? 'list' : 'grid');

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh', transform: 'scale(0.95)', overflow: 'hidden' }}>
      <Box sx={{ width: '90%', height: '90vh', display: 'flex', gap: '1%', borderRadius: '8px', position: 'relative', flexDirection: 'row' }}>
        <FormControl fullWidth>
          <TextField id="input-field-1" value={inputValue1} onChange={handleInputChange1} variant="outlined" fullWidth placeholder="Keress helyszínt..." sx={{ flexShrink: 0 }} />
        </FormControl>

        <Button variant="contained" onClick={handleSubmit} sx={{ padding: '10px 20px', minWidth: 'fit-content' }} aria-label="Search">
          <SearchIcon/>
        </Button>

        <Button variant="outlined" onClick={handleViewSwitch} sx={{ padding: '12px 20px', width: '150px', fontSize: '13px' }}>
          {viewMode === 'grid' ? 'Lista nézet' : 'Térkép nézet'}
        </Button>

        <Button variant="contained" onClick={handleSubmit} sx={{ padding: '10px 20px', minWidth: 'fit-content' }} aria-label="Adjust settings">
          <TuneIcon />
        </Button>

        <Box sx={{ width: '100%', height: '93%', padding: '20px', borderRadius: '8px', position: 'absolute', bottom: 0, overflow: 'hidden' }}>
          <Box sx={{ display: viewMode === 'grid' ? 'block' : 'none', width: '100%', height: '100%' }}>
            <Map />
          </Box>
          <Box sx={{ display: viewMode === 'list' ? 'block' : 'none', width: '100%', height: '100%' }}>
            <ListView />
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default FinderPage;
