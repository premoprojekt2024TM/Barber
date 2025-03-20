import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
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
        onClick={onClick}
        size="small"
        sx={{
          padding: "8px",
          borderRadius: 0, 
        }}
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>

      <div style={{ height: "1px", backgroundColor: "#e0e0e0" }} />
    </div>
  );
};

export default BackButton;
