import { CssBaseline, Box, Stack } from '@mui/material';
import AppNavbar from '../Shared/AppNavbar';
import Header from '../Shared/Header';
import FinderGrid from './FinderPage';
import SideMenu from '../Shared/SideMenu';
import AppTheme from '../../shared-theme/AppTheme';

export default function Finder() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <AppNavbar />
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Stack spacing={2} sx={{ alignItems: 'center', mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}>
            <Header />
            <FinderGrid />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
