import { Paper, Box, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface PopoverProps {
  popoverInfo: {
    title: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    imageUrl: string;
    id: string;
    visible: boolean;
    location: string;
    city: string;
  };
  handleClose: () => void;
}

function Popover({ popoverInfo, handleClose }: PopoverProps) {
  if (!popoverInfo.visible) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        left: "20px",
        top: "20px",
        width: "350px",
        maxWidth: "90%",
        zIndex: 1000,
        overflow: "hidden",
        borderRadius: "4px",
        pointerEvents: "auto",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <img
          src={popoverInfo.imageUrl}
          alt={popoverInfo.title}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
          }}
        />
        <Button
          size="small"
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            minWidth: "30px",
            width: "30px",
            height: "30px",
            padding: 0,
            backgroundColor: "white",
            color: "black",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </Button>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
          {popoverInfo.city}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {popoverInfo.address}
        </Typography>
        <Typography variant="body2" sx={{ color: "gray" }}>
          Address: {popoverInfo.address}
        </Typography>
        <Typography variant="body2" sx={{ color: "gray" }}>
          Phone: {popoverInfo.phone}
        </Typography>
        <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
          Email: {popoverInfo.email}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            mb: 1,
          }}
        >
          Időpont foglalása
        </Button>
      </Box>
    </Paper>
  );
}

export default Popover;
