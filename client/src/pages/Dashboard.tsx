import { useState, useEffect } from 'react';
import axiosInstance1 from '../axios/auth'; 
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../components/main/AppNavbar';
import Header from '../components/main/Header';
import MainGrid from '../components/main/MainGrid';
import SideMenu from '../components/main/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../shared-theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};




export default function Dashboard(props: { disableCustomTheme?: boolean }) {
 const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    axiosInstance1.get('/api/dashboard')
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setMessage('Session expired. Please log in again.');
            setTimeout(() => window.location.href = '/auth/sign-in', 3000); 
          } else if (error.response.status === 403) {
            setMessage('Invalid or expired token.');
          } else {
            setMessage('An error occurred. Please try again.');
          }
        } else {
          setMessage('Network error. Please check your connection.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <MainGrid />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}




