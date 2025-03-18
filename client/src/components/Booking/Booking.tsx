import AppTheme from "../../shared-theme/AppTheme";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CalendarMonth,
  AccessTime,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material";
import { axiosInstance } from "../../utils/axiosInstance";

// Define types for the API response
interface Availability {
  day: string;
  timeSlot: string;
  status: string;
}

interface Worker {
  workerId: number;
  workerName: string;
  workerImage: string;
  WorkerFirstName: string;
  WorkerLastName: string;
  availability: Availability[];
}

interface Store {
  storeId: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  picture: string;
  workers: Worker[];
}

interface StoreResponse {
  message: string;
  store: Store;
}

// Day translation mapping
const dayTranslations: { [key: string]: string } = {
  monday: "Hétfő",
  tuesday: "Kedd",
  wednesday: "Szerda",
  thursday: "Csütörtök",
  friday: "Péntek",
  saturday: "Szombat",
  sunday: "Vasárnap",
};

export default function BookingSystem() {
  const { storeId } = useParams(); // Move this inside the component function
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [storeData, setStoreData] = useState<Store | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [availabilityByDay, setAvailabilityByDay] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<StoreResponse>(
          `/api/v1/store/${storeId}`,
        );
        setStoreData(response.data.store);
        setError(null);
      } catch (err) {
        console.error("Error fetching store data:", err);
        setError("Failed to load salon data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch data only if storeId is present
    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]); // Add storeId as dependency

  useEffect(() => {
    if (selectedWorker && storeData) {
      const worker = storeData.workers.find(
        (w) => w.workerId === selectedWorker,
      );
      if (worker) {
        // Organize availability by day
        const availByDay: Record<string, string[]> = {};

        worker.availability.forEach((slot) => {
          const day = dayTranslations[slot.day] || slot.day;
          if (!availByDay[day]) {
            availByDay[day] = [];
          }
          if (slot.status === "available") {
            availByDay[day].push(slot.timeSlot);
          }
        });

        setAvailabilityByDay(availByDay);
        setSelectedTime(null);
        setSelectedDay(null);
      }
    }
  }, [selectedWorker, storeData]);

  const handleWorkerSelect = (id: number) => {
    setSelectedWorker(id);
    setSelectedTime(null);
    setSelectedDay(null);
  };

  const handleTimeSelect = (day: string, time: string) => {
    setSelectedDay(day);
    setSelectedTime(time);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleBooking = async () => {
    try {
      // Here you would implement the booking API call
      // Example:
      /*
      await axiosInstance.post("/api/v1/booking", {
        workerId: selectedWorker,
        day: selectedDay,
        timeSlot: selectedTime,
        // Add any other required data
      });
      */

      // For now, just close the dialog
      handleCloseDialog();

      // Reset selection
      setSelectedTime(null);
      setSelectedDay(null);

      // Show success message (you might want to implement this)
      // setSuccessMessage("Booking confirmed successfully!");
    } catch (err) {
      console.error("Error making booking:", err);
      // Handle error (you might want to implement this)
      // setBookingError("Failed to confirm booking. Please try again.");
    }
  };

  if (loading) {
    return (
      <AppTheme>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </AppTheme>
    );
  }

  if (error) {
    return (
      <AppTheme>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            p: 3,
          }}
        >
          <Alert severity="error">{error}</Alert>
        </Box>
      </AppTheme>
    );
  }

  if (!storeData) {
    return (
      <AppTheme>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            p: 3,
          }}
        >
          <Alert severity="warning">No salon data available.</Alert>
        </Box>
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          py: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={storeData.picture}
                    alt="Salon interior"
                  />
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      {storeData.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      A minimalist approach to beauty and style. Our expert team
                      provides top-quality services in a relaxing environment.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <LocationOn
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {storeData.address}, {storeData.city},{" "}
                          {storeData.postalCode}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Phone
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {storeData.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Email
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {storeData.email}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Booking Interface - Right Side */}
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Foglalj időpontot
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Válasszon egy szakembert az elérhető időpontok
                    megtekintéséhez
                  </Typography>

                  <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2} justifyContent="flex-start">
                      {storeData.workers.map((worker) => (
                        <Grid item key={worker.workerId}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => handleWorkerSelect(worker.workerId)}
                          >
                            <Avatar
                              src={worker.workerImage}
                              alt={worker.workerName}
                              sx={{
                                width: 64,
                                height: 64,
                                border:
                                  selectedWorker === worker.workerId
                                    ? "2px solid #000"
                                    : "1px solid transparent",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ mt: 1, fontWeight: 500 }}
                            >
                              {worker.WorkerFirstName} {worker.WorkerLastName}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {selectedWorker && (
                    <>
                      <Divider sx={{ my: 3 }} />
                      <Box
                        sx={{ mb: 2, display: "flex", alignItems: "center" }}
                      >
                        <CalendarMonth fontSize="small" sx={{ mr: 1 }} />
                        <Typography
                          variant="subtitle2"
                          sx={{ display: "inline-flex" }}
                        >
                          Elérhető időpontok
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 4 }}>
                        {Object.keys(availabilityByDay).length > 0 ? (
                          Object.entries(availabilityByDay).map(
                            ([day, times]) => (
                              <Box key={day} sx={{ mb: 2 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ mb: 1, fontWeight: 500 }}
                                >
                                  {day}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                  }}
                                >
                                  {times.map((time) => (
                                    <Button
                                      key={`${day}-${time}`}
                                      variant={
                                        selectedDay === day &&
                                        selectedTime === time
                                          ? "contained"
                                          : "outlined"
                                      }
                                      size="small"
                                      onClick={() =>
                                        handleTimeSelect(day, time)
                                      }
                                      sx={{
                                        minWidth: "60px",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      {time}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            ),
                          )
                        ) : (
                          <Alert severity="info">
                            Nincs elérhető időpont ennél a szakembernél.
                          </Alert>
                        )}
                      </Box>

                      {selectedTime && (
                        <Box sx={{ mt: 3 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={handleOpenDialog}
                          >
                            Foglalás {selectedDay} {selectedTime}
                          </Button>
                        </Box>
                      )}
                    </>
                  )}

                  <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Confirm Your Booking</DialogTitle>
                    <DialogContent>
                      {selectedWorker && storeData && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">
                              Specialist:
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">
                              {
                                storeData.workers.find(
                                  (w) => w.workerId === selectedWorker,
                                )?.WorkerFirstName
                              }{" "}
                              {
                                storeData.workers.find(
                                  (w) => w.workerId === selectedWorker,
                                )?.WorkerLastName
                              }
                            </Typography>
                          </Grid>

                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">
                              Date:
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">
                              {selectedDay}
                            </Typography>
                          </Grid>

                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">
                              Time:
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">
                              {selectedTime}
                            </Typography>
                          </Grid>

                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">
                              Location:
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">
                              {storeData.address}, {storeData.city}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog}>Cancel</Button>
                      <Button variant="contained" onClick={handleBooking}>
                        Confirm Booking
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </AppTheme>
  );
}
