import { Grid, Box } from "@mui/material";
import Map from "./Map";

const FinderPage = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", width: "100%", margin: 0, padding: 0 }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          gap: "1%",
          borderRadius: "8px",
          position: "relative",
          flexDirection: "column",
        }}
      >
        <Map />
      </Box>
    </Grid>
  );
};

export default FinderPage;
