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
              Highlight Title
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              Here is the content that describes the highlight, which is shown beside the image.
            </Typography>

            {/* Two buttons */}
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ marginRight: 2 }}
            >
              Button 1
            </Button>
            <Button 
              variant="outlined" 
              color="secondary"
            >
              Button 2
            </Button>
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
