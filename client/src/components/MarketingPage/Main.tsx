import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Main() {
  return (
    <Box
      id="Main"
      sx={{
        bgcolor: 'grey.900', 
        pt:5
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Left content section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ color: 'white', pl: 10 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Barberkereső
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
            A Barberkereső applikáció segít könnyedén megtalálni a legjobb borbélyszalonokat a közeledben,<br></br> lehetőséget biztosítva a szolgáltatások, vélemények és elérhetőségek gyors böngészésére. <br></br>Találd meg a stílusodhoz illő szakembert pár egyszerű lépésben!
            </Typography> 
          </Box>
        </Grid>

        {/* Enlarged Image Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: 600, // Make the box taller to prevent top cropping
              overflow: 'hidden', // Crops the rest of the image
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src="/src/pics/image-removebg.png"
              alt="Highlight Image"
              sx={{
                transform: 'scale(1.4)',
                transformOrigin: 'top center', // Ensures top remains visible // Moves image down slightly to prevent top cropping
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
