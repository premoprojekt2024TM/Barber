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

  // Form submission handler
  const handleSubmit = async () => {
    const missingFields = [];
    if (!storeName) missingFields.push("Store Name");
    if (!storePhone) missingFields.push("Phone Number");
    if (!storeEmail) missingFields.push("Email");
    if (!location) missingFields.push("Location");
    if (!selectedWorkerId) missingFields.push("Worker");
    if (!imageBase64) missingFields.push("Store Image");

    if (missingFields.length > 0) {
      setAlert({
        open: true,
        message: `Please provide the following: ${missingFields.join(", ")}`,
        severity: "warning",
      });
      return;
    }

    // Create request payload with base64 image
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
        message: "Store created successfully!",
        severity: "success",
      });
    } catch (error: any) {
      setAlert({
        open: true,
        message:
          error.response?.data?.message ||
          "There was an error creating the store.",
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

      <Grid item xs={12}>
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            p: 2,
            mt: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Store Preview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                Store Name: {storeName || "Not Provided"}
              </Typography>
              <Typography variant="body1">
                Phone: {storePhone || "Not Provided"}
              </Typography>
              <Typography variant="body1">
                Email: {storeEmail || "Not Provided"}
              </Typography>
              <Typography variant="body1">
                Location: {location ? location.label : "Not Provided"}
              </Typography>
              {selectedWorkerId && (
                <Typography variant="body1">
                  Worker ID: {selectedWorkerId}
                </Typography>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Store"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              )}
            </Grid>
          </Grid>
        </Box>
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
