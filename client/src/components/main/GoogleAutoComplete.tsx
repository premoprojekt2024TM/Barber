import React, { useState } from 'react';
import { Box, InputAdornment, FormControl, OutlinedInput, FormHelperText, Stack, FormLabel } from '@mui/material';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import * as dotenv from 'dotenv';

dotenv.config();


const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const GoogleAutoComplete = () => {
  const [storeAddress, setStoreAddress] = useState('');
  const [title, setTitle] = useState('');
  const MAX_TITLE_LENGTH = 35;

  const handleAddressChange = (address: any) => {
    setStoreAddress(address);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    if (newTitle.length <= MAX_TITLE_LENGTH) {
      setTitle(newTitle);
    }
  };

  return (
    <Box>
      <Stack spacing={2}>
        <FormControl fullWidth sx={{ m: 1 }}>
          <FormLabel>Title</FormLabel>
          <OutlinedInput
            placeholder="What is the title of your experience?"
            value={title}
            onChange={handleTitleChange}
            variant="outlined"
            inputProps={{ maxLength: MAX_TITLE_LENGTH }}
            endAdornment={
              <InputAdornment position="end">
                {MAX_TITLE_LENGTH - title.length}
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }}>
          <FormLabel>Title</FormLabel> 
          <OutlinedInput
            placeholder="What is the title of your experience?"
            value={title}
            onChange={handleTitleChange}
            variant="outlined"
            inputProps={{ maxLength: MAX_TITLE_LENGTH }}
            endAdornment={
              <InputAdornment position="end">
                {MAX_TITLE_LENGTH - title.length}
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }}>
          <FormLabel>Address</FormLabel> 
          <GooglePlacesAutocomplete
            apiKey={GOOGLE_API_KEY}
            selectProps={{
              value: storeAddress,
              onChange: handleAddressChange,
            }}
            autocompletionRequest={{
              componentRestrictions: {
                country: 'hu', 
              },
              types: ['address'],
            }}
          />
          
          
        </FormControl>
      </Stack>
    </Box>
  );
};

export default GoogleAutoComplete;
