import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { StoreInformationSection } from "../../components/StoreUpload/StoreInformationSection";
import { AddWorker } from "./AddWorker";
import { AddImage } from "./AddImage";
import { Button, Typography, Box, Alert, Snackbar } from "@mui/material";
import { axiosInstance } from "../../utils/axiosInstance";

export const Store = () => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
  const [storeName, setStoreName] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [location, setLocation] = useState<any>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Handler for image changes from AddImage component
  const handleImageChange = (
    base64Image: string | null,
    previewUrl: string | null,
  ) => {
    setImageBase64(base64Image);
    setImagePreviewUrl(previewUrl);
  };

  // Handler for worker selection from AddWorker component
  const handleWorkerSelect = (workerId: number) => {
    setSelectedWorkerId(workerId);
  };

  // Handler for store information changes from StoreInformationSection
  const handleStoreInfoChange = (
    name: string,
    phone: string,
    email: string,
    location: any,
  ) => {
    setStoreName(name);
    setStorePhone(phone);
    setStoreEmail(email);
    setLocation(location);
  };

  // Close alert notification
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!storeName) missingFields.push("Bolt neve");
    if (!storePhone) missingFields.push("Telefonszám");
    if (!storeEmail) missingFields.push("Email");
    if (!location) missingFields.push("Cím");
    if (!selectedWorkerId) missingFields.push("Munkatárs");
    if (!imageBase64) missingFields.push("Kép");

    if (missingFields.length > 0) {
      setAlert({
        open: true,
        message: `Kérem töltse ki a kitöltetlen mezőket: ${missingFields.join(", ")}`,
        severity: "warning",
      });
      return;
    }
    const payload = {
      name: storeName,
      address: location?.label || "",
      phone: storePhone,
      email: storeEmail,
      workerId: selectedWorkerId?.toString() || "",
      image: imageBase64,
    };

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(
        "/api/v1/createStore",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setAlert({
        open: true,
        message: "Bolt sikeresen létrehozva!",
        severity: "success",
      });
    } catch (error: any) {
      setAlert({
        open: true,
        message:
          error.response?.data?.message ||
          "Hiba történt a bolt létrehozása közben.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12} sm={7}>
          <StoreInformationSection onStoreInfoChange={handleStoreInfoChange} />
          <Box mt={3}>
            <AddWorker onWorkerSelect={handleWorkerSelect} />
          </Box>
        </Grid>

        <Grid item xs={12} sm={5}>
          <AddImage onImageChange={handleImageChange} />
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "center", mt: 2 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="large"
        >
          {isSubmitting ? "Creating Store..." : "Submit Store"}
        </Button>
      </Grid>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};
