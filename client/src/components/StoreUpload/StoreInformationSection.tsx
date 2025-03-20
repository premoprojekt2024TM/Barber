import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { TextField, InputAdornment } from "@mui/material";

const GOOGLE_MAPS_API_KEY = "AIzaSyCSJN2Qzyjhv-AFd1I2LVLD30hX7-lZhRE";

interface StoreInformationProps {
  onStoreInfoChange: (
    name: string,
    phone: string,
    email: string,
    location: any,
  ) => void;
}

export const StoreInformationSection = ({
  onStoreInfoChange,
}: StoreInformationProps) => {
  const [storeName, setStoreName] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [location, setLocation] = useState<any>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setStoreName(name);
    onStoreInfoChange(name, storePhone, storeEmail, location);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digitsOnly = inputValue.replace(/\D/g, "");

    let formattedPhone = "";
    if (digitsOnly.length > 0) {
      const groups = [2, 3, 4];
      let currentPosition = 0;

      for (
        let i = 0;
        i < groups.length && currentPosition < digitsOnly.length;
        i++
      ) {
        const group = digitsOnly.substring(
          currentPosition,
          currentPosition + groups[i],
        );
        formattedPhone += group;
        currentPosition += groups[i];
        if (currentPosition < digitsOnly.length) formattedPhone += " ";
      }
    }

    setStorePhone(formattedPhone);
    onStoreInfoChange(storeName, "+36 " + formattedPhone, storeEmail, location);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setStoreEmail(email);
    onStoreInfoChange(storeName, storePhone, email, location);
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      position: "absolute",
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  // Hungarian flag mini-SVG
  const hungarianFlag = (
    <svg
      width="24"
      height="16"
      viewBox="0 0 24 16"
      style={{ marginRight: "4px" }}
    >
      <rect width="24" height="5.33" fill="#ce2b37" />
      <rect y="5.33" width="24" height="5.33" fill="#fff" />
      <rect y="10.66" width="24" height="5.33" fill="#008c45" />
    </svg>
  );

  return (
    <Box
      sx={{
        width: "100%",
        background: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 1)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        },
        overflow: "visible",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
          pointerEvents: "none",
          zIndex: 1,
        },
      }}
    >
      <Typography
        component="h2"
        variant="h6"
        sx={{
          mb: 2,
          color: "rgba(255, 255, 255, 0.9)",
          fontWeight: 600,
          position: "relative",
          zIndex: 2,
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        Bolt információk
      </Typography>

      {/* Store Name */}
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="body1"
          sx={{ mb: 1, color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
        >
          Bolt neve
        </Typography>
        <TextField
          fullWidth
          value={storeName}
          onChange={handleNameChange}
          placeholder="Bolt neve"
          variant="outlined"
          size="medium"
          sx={{ borderRadius: "8px" }}
        />
      </Box>

      {/* Google Places Autocomplete */}
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="body1"
          sx={{ mb: 1, color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
        >
          Bolt helye
        </Typography>
        <Box sx={{ "& > div": { borderRadius: "8px" } }}>
          <GooglePlacesAutocomplete
            apiKey={GOOGLE_MAPS_API_KEY}
            selectProps={{
              placeholder: "Cím keresése",
              onChange: (value) => {
                setLocation(value);
                onStoreInfoChange(storeName, storePhone, storeEmail, value);
              },
              value: location,
              noOptionsMessage: () => "Nincs találat",
              loadingMessage: () => "Keresés folyamatban...",
              styles: customStyles,
              menuPortalTarget: document.body,
              menuPosition: "fixed",
            }}
            autocompletionRequest={{
              componentRestrictions: {
                country: ["hu"],
              },
            }}
            debounce={300}
          />
        </Box>
      </Box>

      {/* Phone Number with Hungarian Flag and +36 prefix */}
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="body1"
          sx={{ mb: 1, color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
        >
          Bolt telefonszáma
        </Typography>
        <TextField
          fullWidth
          value={storePhone}
          onChange={handlePhoneChange}
          placeholder="XX XXX XXXX"
          variant="outlined"
          size="medium"
          sx={{ borderRadius: "8px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0.5 }}>
                {hungarianFlag}
                <Typography
                  sx={{ fontSize: "0.9rem", color: "text.secondary", mr: 0.5 }}
                >
                  +36
                </Typography>
              </InputAdornment>
            ),
          }}
          inputProps={{
            maxLength: 12, // Limit input to XX XXX XXXX format with spaces
          }}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        <Typography
          variant="body1"
          sx={{ mb: 1, color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
        >
          Bolt email címe
        </Typography>
        <TextField
          fullWidth
          value={storeEmail}
          onChange={handleEmailChange}
          placeholder="email cím"
          variant="outlined"
          size="medium"
          sx={{ borderRadius: "8px" }}
        />
      </Box>
    </Box>
  );
};
