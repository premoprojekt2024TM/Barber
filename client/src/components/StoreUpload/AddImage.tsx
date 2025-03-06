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
        backgroundColor: "#f5f5f5",
        borderRadius: "16px",
        border: "1px solid #e0e0e0",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "80%",
          border: isUploadedFiles[currentIndex] ? "none" : "2px dashed #bdbdbd",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
          cursor: isUploadedFiles[currentIndex] ? "default" : "pointer",
          position: "relative",
          transition: "border-color 0.3s, background-color 0.3s",
          ":hover": {
            borderColor: "#1976d2",
            backgroundColor: "#e3f2fd",
          },
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
              color: hoveredMainBox ? "#1976d2" : "#bdbdbd",
              transition: "color 0.3s ease",
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
            }}
          >
            <Box sx={{ position: "absolute", top: 10, right: 10 }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(currentIndex);
                }}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "50%",
                  boxShadow: 3,
                }}
                onMouseEnter={() => setHoveredDeleteButton(true)}
                onMouseLeave={() => setHoveredDeleteButton(false)}
              >
                <DeleteIcon
                  sx={{
                    color: hoveredDeleteButton ? "#1976d2" : "#757575",
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
                  border: `2px ${fileUrl ? "#e0e0e0" : "#bdbdbd"} ${fileUrl ? "solid" : "dashed"}`,
                  cursor: "pointer",
                  position: "relative",
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
                        borderRadius: "6px",
                      }}
                    />
                    {currentIndex === i && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: -6,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "80%",
                          height: "3px",
                          backgroundColor: "#1976d2",
                        }}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <AddIcon
                      sx={{
                        fontSize: 50,
                        color: "#bdbdbd",
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
