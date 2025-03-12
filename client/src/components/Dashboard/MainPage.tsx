import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "../../components/Dashboard/CustomizedDataGrid";
import SessionsChart from "../../components/Dashboard/SessionsChart";
import StatCard, { StatCardProps } from "../../components/Dashboard/StatCard";
import FriendsList from "./FriendList"; // Import the new component
import { Card, CardContent, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";

const data: StatCardProps[] = [
  {
    title: "Users",
    value: "14k",
    interval: "Last 30 days",
    trend: "up",
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340,
      380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: "Conversions",
    value: "325",
    interval: "Last 30 days",
    trend: "down",
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600,
      820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300,
      220,
    ],
  },
];

const GlowingTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  fontSize: "1rem",
  minWidth: "100px",
  padding: "12px 16px",
  color: "#777777",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    fontWeight: 600,
    filter: "drop-shadow(0 0 8px rgba(25, 118, 210, 0.4))",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "3px",
    background: "transparent",
    transition: "all 0.3s ease",
  },
  "&.Mui-selected::after": {
    background: theme.palette.primary.main,
    boxShadow: "0 0 10px rgba(25, 118, 210, 0.6)",
  },
}));

// Custom styled Tabs component
const ModernTabs = styled(Tabs)({
  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
  minHeight: "48px",
  "& .MuiTabs-indicator": {
    display: "none", // Hide default indicator since we're using our custom one
  },
});

export default function MainPage() {
  // State for managing active tab
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {/* Left Column: Users, Conversions, and Sessions Chart */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {/* Users Card */}
            <Grid item xs={12} sm={6}>
              <StatCard {...data[0]} />
            </Grid>
            {/* Conversions Card */}
            <Grid item xs={12} sm={6}>
              <StatCard {...data[1]} />
            </Grid>
            {/* Sessions Chart */}
            <Grid item xs={12}>
              <SessionsChart />
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column: Project Status with Tabs */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              width: "100%",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 14px 0 rgba(106, 107, 114, 0.15)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {/* Modern Tabs */}
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "#fafafa",
              }}
            >
              <ModernTabs value={activeTab} onChange={handleTabChange} centered>
                <GlowingTab label="Bejövő" />
                <GlowingTab label="Kimenő" />
                <GlowingTab label="Ismerősök" />
              </ModernTabs>
            </Box>

            {/* Tab Content */}
            <CardContent>
              {activeTab === 0 && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1">Bejövő tartalma</Typography>
                </Box>
              )}
              {activeTab === 1 && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1">Kimenő tartalma</Typography>
                </Box>
              )}
              {activeTab === 2 && <FriendsList />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section 2: Kliensek (Clients) */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Kliensek
      </Typography>
      <Grid container spacing={2} columns={12}>
        {/* Left side grid with Data Grid */}
        <Grid item xs={12} lg={9}>
          <CustomizedDataGrid />
        </Grid>
      </Grid>
    </Box>
  );
}
