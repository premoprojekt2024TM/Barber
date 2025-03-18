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
      <Box
        component="img"
        src="https://10barberimages.s3.eu-north-1.amazonaws.com/Static/Main/MainBG2.png"
        alt="Background"
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
      />
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              color: "white",
              px: { xs: 4, md: 5 },
              py: 5,
              mx: { xs: 3, md: 6 },
              mr: { md: 8 },
              backgroundColor: "rgba(70, 70, 75, 0.65)", // Greyish tint
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography
              variant="h4"
              sx={{ marginBottom: 3, fontWeight: "bold" }}
            >
              Barberkereső
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginBottom: 3, lineHeight: 1.6 }}
            >
              A Barberkereső applikáció segít könnyedén megtalálni a legjobb
              borbélyszalonokat a közeledben, lehetőséget biztosítva a
              szolgáltatások, vélemények és elérhetőségek gyors böngészésére.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Találd meg a stílusodhoz illő szakembert pár egyszerű lépésben!
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
              src="https://10barberimages.s3.eu-north-1.amazonaws.com/Static/Main/MainImage.png"
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
