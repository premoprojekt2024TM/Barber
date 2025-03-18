import { useState } from "react";
import AppTheme from "../../shared-theme/AppTheme";
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
} from "@mui/material";
import {
  CalendarMonth,
  AccessTime,
  LocationOn,
  Phone,
} from "@mui/icons-material";

const serviceProviders = [
  {
    id: 1,
    name: "Anna K.",
    image: "/placeholder.svg?height=80&width=80",
    role: "Hair Stylist",
  },
  {
    id: 2,
    name: "Mark T.",
    image: "/placeholder.svg?height=80&width=80",
    role: "Barber",
  },
  {
    id: 3,
    name: "Sarah J.",
    image: "/placeholder.svg?height=80&width=80",
    role: "Colorist",
  },
  {
    id: 4,
    name: "David L.",
    image: "/placeholder.svg?height=80&width=80",
    role: "Stylist",
  },
  {
    id: 5,
    name: "Emma R.",
    image: "/placeholder.svg?height=80&width=80",
    role: "Nail Artist",
  },
];

const availabilityData = {
  Hétfő: ["9:10", "9:20", "9:40", "10:15", "11:30", "14:00"],
  Kedd: ["9:40", "10:30", "11:00", "15:45"],
  Szerda: ["9:00", "10:00", "11:00", "13:30", "14:45"],
  Csütörtök: ["9:30", "10:45", "12:15", "16:00"],
  Péntek: ["9:15", "10:30", "11:45", "14:30", "15:30"],
  Szombat: ["10:00", "11:15", "12:30"],
};

export default function BookingSystem() {
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleProviderSelect = (id: number) => {
    setSelectedProvider(id);
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
                    image="/placeholder.svg?height=400&width=600"
                    alt="Salon interior"
                  />
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      Monochrome Beauty Salon
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
                          123 Stylish Street, Fashion District
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
                          +1 (555) 123-4567
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTime
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          Mon-Fri: 9:00-18:00, Sat: 10:00-16:00
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
                      {serviceProviders.map((provider) => (
                        <Grid item key={provider.id}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => handleProviderSelect(provider.id)}
                          >
                            <Avatar
                              src={provider.image}
                              alt={provider.name}
                              sx={{
                                width: 64,
                                height: 64,
                                border:
                                  selectedProvider === provider.id
                                    ? "1px solid #000"
                                    : "1px solid transparent",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ mt: 1, fontWeight: 500 }}
                            >
                              {provider.name}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {selectedProvider && (
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
                        {Object.entries(availabilityData).map(
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
                                    onClick={() => handleTimeSelect(day, time)}
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
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Specialist:
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {
                              serviceProviders.find(
                                (p) => p.id === selectedProvider,
                              )?.name
                            }
                          </Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Service:
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {
                              serviceProviders.find(
                                (p) => p.id === selectedProvider,
                              )?.role
                            }
                          </Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Date:
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">{selectedDay}</Typography>
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
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog}>Cancel</Button>
                      <Button variant="contained" onClick={handleCloseDialog}>
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
