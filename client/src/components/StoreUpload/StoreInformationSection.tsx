import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { TextField } from "@mui/material";

type StoreInformationSectionProps = {
  location: any;
  setLocation: React.Dispatch<React.SetStateAction<any>>;
};

const GOOGLE_MAPS_API_KEY = "AIzaSyC3aviU6KHXAjoSnxcw6qbOhjnFctbxPkE";

export const StoreInformationSection = ({
  location,
  setLocation,
}: StoreInformationSectionProps) => {
  const [storeName, setStoreName] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");

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
      address: location?.label,
      city: location?.city,
      postalCode: location?.postalCode,
      phone: storePhone,
      email: storeEmail,
    };
    // Handle submission logic (e.g., sending data to an API)
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: "16px",
        border: "1px solid #e0e0e0",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Bolt információk
      </Typography>

      {/* Store Name */}
      <Box sx={{ width: "100%" }}>
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
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      {/* Google Places Autocomplete */}
      <Box sx={{ width: "100%" }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Bolt helye
        </Typography>
        <GooglePlacesAutocomplete
          apiKey={GOOGLE_MAPS_API_KEY}
          selectProps={{
            placeholder: "Cím keresése",
            onChange: (value) => setLocation(value),
            value: location?.label || "",
            noOptionsMessage: () => "Nincs találat",
            loadingMessage: () => "Keresés folyamatban...",
          }}
          debounce={300}
        />
      </Box>

      {/* Store Phone */}
      <Box sx={{ width: "100%" }}>
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
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      {/* Store Email */}
      <Box sx={{ width: "100%" }}>
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
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Box>
    </Box>
  );
};
