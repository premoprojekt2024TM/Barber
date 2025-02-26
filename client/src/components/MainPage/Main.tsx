import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
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

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: 600,
              overflow: 'hidden', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src="src/components/MainPage/MainPagePictures/MainImage.png"
              alt="Highlight Image"
              sx={{
                transform: 'scale(1.4)',
                transformOrigin: 'top center',
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
