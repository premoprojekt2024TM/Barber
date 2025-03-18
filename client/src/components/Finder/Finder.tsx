import { CssBaseline, Box } from "@mui/material";
import FinderGrid from "./FinderPage";
import AppTheme from "../../shared-theme/AppTheme";

export default function Finder() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", width: "100%", height: "100vh", margin: 0 }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <FinderGrid />
        </Box>
      </Box>
    </AppTheme>
  );
}
