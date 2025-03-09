import React, { useState } from "react";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type AddImage = {
  files: (string | null)[];
  currentIndex: number;
  isUploadedFiles: boolean[];
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => void;
  handleDelete: (index: number) => void;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  fileInputRefs: React.RefObject<HTMLInputElement>[];
};

export const Addimage = ({
  files,
  currentIndex,
  isUploadedFiles,
  handleFileChange,
  handleDelete,
  setCurrentIndex,
  fileInputRefs,
}: AddImage) => {
  const [hoveredMainBox, setHoveredMainBox] = useState(false);
  const [hoveredThumbnail, setHoveredThumbnail] = useState<number | null>(null);
  const [hoveredDeleteButton, setHoveredDeleteButton] = useState(false);

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
        justifyContent: "space-between",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        },
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
          pointerEvents: "none",
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "80%",
          border: isUploadedFiles[currentIndex]
            ? "none"
            : "2px dashed rgba(255, 255, 255, 1)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            hoveredMainBox && !isUploadedFiles[currentIndex]
              ? "rgba(25, 118, 210, 0.1)"
              : "transparent",
          cursor: isUploadedFiles[currentIndex] ? "default" : "pointer",
          position: "relative",
          transition: "all 0.3s ease",
          backdropFilter: "blur(8px)",
          ":hover": {
            borderColor: "#1976d2",
          },
          zIndex: 2,
        }}
        onClick={() =>
          !isUploadedFiles[currentIndex] &&
          fileInputRefs[currentIndex].current?.click()
        }
        onMouseEnter={() => setHoveredMainBox(true)}
        onMouseLeave={() => setHoveredMainBox(false)}
      >
        {!files[currentIndex] && (
          <AddIcon
            sx={{
              fontSize: 100,
              color: hoveredMainBox ? "#1976d2" : "rgba(255, 255, 255, 1)",
              transition: "color 0.3s ease",
              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))",
            }}
          />
        )}

        <input
          type="file"
          ref={fileInputRefs[currentIndex]}
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e, currentIndex)}
          disabled={isUploadedFiles[currentIndex]}
        />

        {files[currentIndex] && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${files[currentIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "8px",
              boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <Box sx={{ position: "absolute", top: 10, right: 10 }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(currentIndex);
                }}
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
                onMouseEnter={() => setHoveredDeleteButton(true)}
                onMouseLeave={() => setHoveredDeleteButton(false)}
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

      <Box
        sx={{
          width: "100%",
          height: "15%",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "16px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {files.map(
          (fileUrl, i) =>
            (i === 0 || isUploadedFiles[i - 1]) && (
              <Box
                key={i}
                sx={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "8px",
                  border: fileUrl
                    ? "1px solid rgba(255, 255, 255, 0.8)"
                    : "2px dashed rgba(255, 255, 255, 0.8)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(8px)",
                  background: "rgba(15, 23, 42, 0.4)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  overflow: "hidden",
                  "&:hover": {
                    borderColor: "#1976d2",
                    boxShadow: "0 6px 15px rgba(25, 118, 210, 0.25)",
                    transform: "translateY(-2px)",
                    background: "rgba(15, 23, 42, 0.6)",
                  },
                }}
                onClick={() => setCurrentIndex(i)}
                onMouseEnter={() => setHoveredThumbnail(i)}
                onMouseLeave={() => setHoveredThumbnail(null)}
              >
                {fileUrl ? (
                  <>
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${fileUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "6px",
                      }}
                    />
                    {currentIndex === i && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: -2,
                          left: 0,
                          width: "100%",
                          height: "3px",
                          background:
                            "linear-gradient(90deg, transparent, #1976d2, transparent)",
                          boxShadow: "0 0 10px rgba(25, 118, 210, 0.8)",
                        }}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <AddIcon
                      sx={{
                        fontSize: 40,
                        color:
                          hoveredThumbnail === i
                            ? "#1976d2"
                            : "rgba(255, 255, 255, 1)",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        transition: "color 0.3s ease",
                      }}
                    />
                    <input
                      type="file"
                      ref={fileInputRefs[i]}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(e, i)}
                    />
                  </>
                )}
              </Box>
            ),
        )}
      </Box>
    </Box>
  );
};
