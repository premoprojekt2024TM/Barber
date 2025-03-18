import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface AddImageProps {
  onImageChange: (
    base64Image: string | null,
    previewUrl: string | null,
  ) => void;
}

export const AddImage: React.FC<AddImageProps> = ({ onImageChange }) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      try {
        const fileUrl = URL.createObjectURL(uploadedFile);
        const base64String = await convertToBase64(uploadedFile);

        setFilePreview(fileUrl);
        setIsUploaded(true);
        onImageChange(base64String, fileUrl); // Pass base64 string and URL to parent
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  const handleDelete = () => {
    setFilePreview(null);
    setIsUploaded(false);
    onImageChange(null, null); // Notify parent when image is deleted
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "700px",
        background: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 1)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transition: "all 0.3s ease",
        overflow: "hidden",
        position: "relative",
        "&:hover": {
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "80%",
          border: isUploaded ? "none" : "2px dashed rgba(255, 255, 255, 1)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isUploaded
            ? "transparent"
            : "rgba(25, 118, 210, 0.1)",
          cursor: isUploaded ? "default" : "pointer",
          position: "relative",
          transition: "all 0.3s ease",
          backdropFilter: "blur(8px)",
        }}
        onClick={() => !isUploaded && fileInputRef.current?.click()}
      >
        {!filePreview && (
          <AddIcon
            sx={{
              fontSize: 100,
              color: "rgba(255, 255, 255, 1)",
              transition: "color 0.3s ease",
              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))",
            }}
          />
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled={isUploaded}
        />

        {filePreview && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${filePreview})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "8px",
              boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <Box sx={{ position: "absolute", top: 10, right: 10 }}>
              <IconButton
                onClick={handleDelete}
                sx={{
                  backgroundColor: "rgba(15, 23, 42, 0.7)",
                  backdropFilter: "blur(5px)",
                  borderRadius: "50%",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.8)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <DeleteIcon
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    transition: "color 0.3s ease",
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
