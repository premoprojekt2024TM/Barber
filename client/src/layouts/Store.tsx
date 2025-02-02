import { useState } from 'react';
import { CssBaseline, Box, Stack } from '@mui/material';
import AppTheme from '../shared-theme/AppTheme';
import SideMenu from '../components/shared/SideMenu';
import AppNavbar from '../components/shared/AppNavbar';
import Header from '../components/shared/Header';
import SimpleContainer1 from '../pages/StorePage';  // Import SimpleContainer1

// Optional customizations for charts, data grids, etc.
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function FinderWithSidebar(props: { disableCustomTheme?: boolean }) {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        {/* Side Menu */}
        <SideMenu />

        {/* Navbar */}
        <AppNavbar />

        {/* Main Content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : theme.palette.background.default,
            overflow: 'auto',
            paddingTop: { xs: '80px', sm: '0' }, // Adjust padding for header overlap
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

            <SimpleContainer1 />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
