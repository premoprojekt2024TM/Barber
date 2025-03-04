import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {  TextField } from '@mui/material';

type StoreInformationSectionProps = {
  location: any;
  setLocation: React.Dispatch<React.SetStateAction<any>>;
};

const GOOGLE_MAPS_API_KEY = 'AIzaSyC3aviU6KHXAjoSnxcw6qbOhjnFctbxPkE';

const StoreInformationSection: React.FC<StoreInformationSectionProps> = ({ location, setLocation }) => {
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeEmail, setStoreEmail] = useState('');

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreDescription(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreName(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStorePhone(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreEmail(e.target.value);
  };

  const handleSubmit = () => {
    const storeData = {
      name: storeName,
      description: storeDescription,
      address: location?.label,
      city: location?.city,  // Assuming the city is part of the address object
      postalCode: location?.postalCode,  // You might need to handle this separately
      phone: storePhone,
      email: storeEmail,
    };

    // Handle form submission (send to backend or handle accordingly)
    console.log('Store Data Submitted:', storeData);
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: '16px',
        border: '1px solid #e0e0e0',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {/* Store Title */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
       Bolt információk
      </Typography>

      {/* Store Name */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Bolt neve
        </Typography>
        <TextField
          fullWidth
          value={storeName}
          onChange={handleNameChange}
          placeholder="Bolt neve"
          variant="outlined"
          size="medium"
          sx={{
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
      </Box>

      {/* Google Places Autocomplete */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Bolt helye
        </Typography>
        <GooglePlacesAutocomplete
          apiKey={GOOGLE_MAPS_API_KEY}
          selectProps={{
            placeholder: 'Cím keresése',
            onChange: (value) => setLocation(value),
            value: location?.label || '',
          }}
          debounce={300}
        />
      </Box>

      {/* Store Phone */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Bolt telefonszáma
        </Typography>
        <TextField
          fullWidth
          value={storePhone}
          onChange={handlePhoneChange}
          placeholder="telefonszám"
          variant="outlined"
          size="medium"
          sx={{
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
      </Box>

      {/* Store Email */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Bolt email címe
        </Typography>
        <TextField
          fullWidth
          value={storeEmail}
          onChange={handleEmailChange}
          placeholder="email cím"
          variant="outlined"
          size="medium"
          sx={{
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
      </Box>

      {/* Store Description - Multiline TextField */}
     


    </Box>
  );
};

export default StoreInformationSection;
