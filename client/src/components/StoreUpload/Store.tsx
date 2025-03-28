import { CssBaseline, Box, Stack } from "@mui/material";
import AppTheme from "../../shared-theme/AppTheme";
import SideMenu from "../Shared/SideMenu";
import AppNavbar from "../Shared/AppNavbar";
import { Store } from "./StorePage";

export default function StoreUpload() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={() => ({
            flexGrow: 1,
            overflow: "auto",
            paddingTop: { xs: "80px", sm: "0" },
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Store />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
