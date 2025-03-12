import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function Main() {
  return (
    <Box
      id="Main"
      sx={{
        position: "relative",
        pt: 5,
        overflow: "hidden",
      }}
    >
      {/* Video Background */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
          top: 0,
          left: 0,
          transform: "scaleX(-1)",
          filter: "blur(2px)",
        }}
      >
        <source
          src="src/components/MainPage/MainPagePictures/video3.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </Box>

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ color: "white", pl: 10 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Barberkereső
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              A Barberkereső applikáció segít könnyedén megtalálni a legjobb
              borbélyszalonokat a közeledben,<br></br> lehetőséget biztosítva a
              szolgáltatások, vélemények és elérhetőségek gyors böngészésére.{" "}
              <br></br>Találd meg a stílusodhoz illő szakembert pár egyszerű
              lépésben!
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: 600,
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pt: 15,
            }}
          >
            <Box
              component="img"
              src="src/components/MainPage/MainPagePictures/MainImage.png"
              alt="Highlight Image"
              sx={{
                height: 500,
                transformOrigin: "top center",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
