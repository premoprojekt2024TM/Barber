import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Logo from '/src/pics/logo.svg';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: '8px',
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: '#ccc',
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
  padding: '8px 12px',
});

// Styled Logo component with color inversion effect
const StyledLogo = styled(Box)({
  height: 40,
  marginRight: '16px',
  transition: 'filter 0.3s ease-in-out',
  '&:hover': {
    filter: 'invert(1)', // Invert colors on hover
  },
});

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  color: 'black',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: 'black',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  },
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: '28px',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StyledLogo component="img" src={Logo} alt="Logo" />
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
  variant="text"
  color="inherit"
  size="small"
  sx={{ color: 'black' }}
  href="#features"  // Ezzel az id-ra navigálunk
>
  Szolgáltatások
</Button>
                <Button variant="text" color="inherit" size="small" sx={{ color: 'black' }}>
                  Népszerű
                </Button>
                <Button variant="text" color="inherit" size="small" sx={{ color: 'black', minWidth: 0 }}>
                 GyIK 
                </Button>

              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Button color="inherit" variant="text" size="small" sx={{ color: 'black' }}>
              Bejelentkezés
            </Button>
            <Button color="primary" variant="contained" size="small">
              Regisztráció
            </Button>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <StyledIconButton
              aria-label="Menu button"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </StyledIconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: '0px',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: '#fff' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <StyledIconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </StyledIconButton>
                </Box>

                <StyledMenuItem>Features</StyledMenuItem>
                <StyledMenuItem>Testimonials</StyledMenuItem>
                <StyledMenuItem>Highlights</StyledMenuItem>
                <StyledMenuItem>Pricing</StyledMenuItem>
                <StyledMenuItem>FAQ</StyledMenuItem>
                <StyledMenuItem>Blog</StyledMenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
