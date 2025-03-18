import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const ZoomControls = ({ onZoomIn, onZoomOut, onReset }: ZoomControlsProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: "4px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <IconButton
        onClick={onZoomIn}
        size="small"
        sx={{
          padding: "8px",
          borderRadius: 0,
          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>

      <div style={{ height: "1px", backgroundColor: "#e0e0e0" }} />

      <IconButton
        onClick={onZoomOut}
        size="small"
        sx={{
          padding: "8px",
          borderRadius: 0,
          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
        }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      <div style={{ height: "1px", backgroundColor: "#e0e0e0" }} />

      <IconButton
        onClick={onReset}
        size="small"
        sx={{
          padding: "8px",
          borderRadius: 0,
          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
        }}
      >
        <FullscreenIcon fontSize="small" />
      </IconButton>

      <div style={{ height: "1px", backgroundColor: "#e0e0e0" }} />
    </div>
  );
};

export default ZoomControls;
