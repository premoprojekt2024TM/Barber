import { CssBaseline, Box, Stack } from '@mui/material';
import AppNavbar from '../Shared/AppNavbar';
import Header from '../Shared/Header';
import AddPage from './AvailabilityPage';
import SideMenu from '../Shared/SideMenu';
import AppTheme from '../../shared-theme/AppTheme';

export default function Addd() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Stack spacing={2} sx={{ alignItems: 'center', mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}>
            <Header />
            <AddPage />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
