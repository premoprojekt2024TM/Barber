// SimpleContainer.tsx

import React, { useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import StoreInformationSection from '../components/StoreUpload/StoreInformationSection';
import CircularUploadBoxes from '../components/StoreUpload/CircularUploadBoxes';
import ImageAndThumbnailController from '../components/StoreUpload/ImageAndThumbnailController';

type FileState = (string | null)[];
type UploadedState = boolean[];

const SimpleContainer1 = () => {
  const [files, setFiles] = useState<FileState>(Array(4).fill(null));
  const [isUploadedFiles, setIsUploadedFiles] = useState<UploadedState>(Array(4).fill(false));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [location, setLocation] = useState<any>(null);  // To store selected location

  const fileInputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      const newFiles = [...files];
      const newUploadedState = [...isUploadedFiles];
      newFiles[index] = URL.createObjectURL(uploadedFile);
      newUploadedState[index] = true;
      setFiles(newFiles);
      setIsUploadedFiles(newUploadedState);
      setCurrentIndex(index);
    }
  };

  const handleDelete = (index: number) => {
    const newFiles = [...files];
    const newUploadedState = [...isUploadedFiles];

    // Remove the file at the specified index
    newFiles.splice(index, 1, null);
    newUploadedState.splice(index, 1, false);

    // Shift all files after the deleted one down by one
    const shiftFiles = [...newFiles.slice(index + 1), null];
    const shiftUploadedState = [...newUploadedState.slice(index + 1), false];

    // Update the state
    setFiles([...newFiles.slice(0, index), ...shiftFiles]);
    setIsUploadedFiles([...newUploadedState.slice(0, index), ...shiftUploadedState]);

    // Update currentIndex
    if (index === currentIndex && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (index === currentIndex && currentIndex === 0) {
      setCurrentIndex(0);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12} sm={7}>
          {/* Store Information Section */}
          <StoreInformationSection location={location} setLocation={setLocation} />

          {/* Circular Upload Boxes */}
          <CircularUploadBoxes
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          {/* Combined Image Upload and Thumbnail Controller */}
          <ImageAndThumbnailController
            files={files}
            currentIndex={currentIndex}
            isUploadedFiles={isUploadedFiles}
            handleFileChange={handleFileChange}
            handleDelete={handleDelete}
            setCurrentIndex={setCurrentIndex}
            fileInputRefs={fileInputRefs}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SimpleContainer1;
