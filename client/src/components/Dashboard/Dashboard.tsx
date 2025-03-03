import { CssBaseline, Box, Stack } from '@mui/material';
import AppNavbar from '../Shared/AppNavbar';
import Header from '../Shared/Header';
import MainPage from './MainPage';
import SideMenu from '../Shared/SideMenu';
import AppTheme from '../../shared-theme/AppTheme';
import { chartsCustomizations, dataGridCustomizations, datePickersCustomizations, treeViewCustomizations } from '../../theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard() {
  return (
    <AppTheme  themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Stack spacing={2} sx={{ alignItems: 'center', mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}>
            <Header />
            <MainPage />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
