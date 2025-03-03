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
import Logo from './MainPagePictures/logo-icon.svg';
import { Link } from 'react-scroll'; 

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

const StyledLogo = styled('img')({
  height: 40,
  marginRight: '16px',
  transition: 'filter 0.3s ease-in-out',
  '&:hover': {
    filter: 'invert(1)', 
  },
});

const StyledMenuItem = styled(MenuItem)({
  color: 'black',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  },
});

const StyledIconButton = styled(IconButton)({
  color: 'black',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  },
});

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
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
            <Link to="Main" smooth={true} duration={500}>
              <Button
                variant="text"
                color="inherit"
                size="small"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 0,
                  padding: 0,
                  '&:hover': {
                    backgroundColor: 'transparent', 
                  },
                }}
              >
                <StyledLogo src={Logo} alt="Logo" />
              </Button>
            </Link>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Link to="features" smooth={true} duration={500}>
                  <Button variant="text" color="inherit" size="small" sx={{ color: 'black' }}>
                    Szolgáltatások
                  </Button>
                </Link>
                <Link to="popular" smooth={true} duration={500}>
                  <Button variant="text" color="inherit" size="small" sx={{ color: 'black' }}>
                    Népszerű
                  </Button>
                </Link>
                <Link to="faq" smooth={true} duration={500}>
                  <Button variant="text" color="inherit" size="small" sx={{ color: 'black', minWidth: 0 }}>
                    GyIK
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            <Button color="inherit" variant="text" size="small" sx={{ color: 'black' }}>
              Bejelentkezés
            </Button>
            <Button color="primary" variant="contained" size="small">
              Regisztráció
            </Button>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <StyledIconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <StyledIconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </StyledIconButton>
                </Box>
                <Link to="features" smooth={true} duration={500}>
                <StyledMenuItem>Szolgáltatások</StyledMenuItem>
                </Link>
                <Link to="popular" smooth={true} duration={500}>
                <StyledMenuItem>Népszerű</StyledMenuItem>
                </Link>
                <Link to="faq" smooth={true} duration={500}>
                <StyledMenuItem>GyIK</StyledMenuItem>
                </Link>
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
