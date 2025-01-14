import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GoogleAutoComplete from './GoogleAutoComplete'; 


export default function SimpleContainer() {
  const [files, setFiles] = useState([null, null, null, null, null]);
  const [isUploadedFiles, setIsUploadedFiles] = useState([false, false, false, false, false]);

  const fileInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const [storeInfo, setStoreInfo] = useState({
    storeName: '',
    storeAddress: '',
    description: '',
  });

  const handleFileChange = (e, index) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const newFiles = [...files];
      const newUploadedState = [...isUploadedFiles];
      newFiles[index] = URL.createObjectURL(uploadedFile); 
      newUploadedState[index] = true; 
      setFiles(newFiles);
      setIsUploadedFiles(newUploadedState);
    }
  };

  const handleDelete = (index) => {
    const newFiles = [...files];
    const newUploadedState = [...isUploadedFiles];
    newFiles[index] = null; 
    newUploadedState[index] = false;
    setFiles(newFiles);
    setIsUploadedFiles(newUploadedState);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={7}>
        <Box
          sx={{
            width: '100%',
            maxWidth: '2000px',
            height: '500px',
            margin: '0 auto',
            backgroundColor: '#f5f5f5',
            borderRadius: '16px',
            border: '1px solid #e0e0e0',
            padding: 3,
          }}
        >
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Store Information
          </Typography>
          <GoogleAutoComplete
          />
      


        </Box>
      </Grid>

      <Grid item xs={12} sm={5}>
        <Box
          sx={{
            width: '100%',
            maxWidth: '2000px',
            height: '700px',
            margin: '0 auto',
            backgroundColor: '#f5f5f5', 
            borderRadius: '16px',
            border: '1px solid #e0e0e0', 
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '80%',
              border: isUploadedFiles[0] ? 'none' : '2px dashed #bdbdbd', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              cursor: isUploadedFiles[0] ? 'default' : 'pointer',
              position: 'relative',
            }}
            onClick={() => {
              if (!isUploadedFiles[0]) {
                fileInputRefs[0].current.click();
              }
            }}
          >
            {!files[0] && (
              <AddIcon
                sx={{
                  fontSize: 100,
                  color: '#bdbdbd', 
                }}
              />
            )}

            <input
              type="file"
              ref={fileInputRefs[0]}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, 0)}
              disabled={isUploadedFiles[0]} 
            />

            {files[0] && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${files[0]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '8px',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => handleDelete(0)}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      boxShadow: 3,
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <DeleteIcon sx={{ color: '#757575' }} /> 
                  </IconButton>

                  <IconButton
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      boxShadow: 3,
                      '&:hover': {
                        backgroundColor: '#f5f5f5', 
                      },
                    }}
                  >
                    <EditIcon sx={{ color: '#757575' }} /> 
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>

          {isUploadedFiles[0] && (
            <Box
              sx={{
                width: '100%',
                height: '15%',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'flex-start', 
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 100, 
                  height: 100,
                  backgroundImage: `url(${files[0]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '8px',
                  
                }}
              />
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  border: '2px dashed #bdbdbd',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AddIcon sx={{ fontSize: 50, color: '#bdbdbd' }} />
              </Box>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
