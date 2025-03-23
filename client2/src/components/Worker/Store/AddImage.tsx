import type React from "react";

import { useState, useRef, useCallback } from "react";
import { CloudUpload, Trash2 } from "lucide-react";

interface AddImageProps {
  onImageChange: (
    base64Image: string | null,
    previewUrl: string | null,
  ) => void;
}

export const AddImage = ({ onImageChange }: AddImageProps) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const processFile = async (file: File) => {
    if (file) {
      try {
        const fileUrl = URL.createObjectURL(file);
        const base64String = await convertToBase64(file);

        setFilePreview(fileUrl);
        setIsUploaded(true);
        onImageChange(base64String, fileUrl);
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      processFile(uploadedFile);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFilePreview(null);
    setIsUploaded(false);
    onImageChange(null, null);
  };

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isUploaded) {
        setIsDragging(true);
      }
    },
    [isUploaded],
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isUploaded) {
        setIsDragging(true);
      }
    },
    [isUploaded],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!isUploaded) {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          const droppedFile = files[0];
          if (droppedFile.type.match("image.*")) {
            processFile(droppedFile);
          } else {
            console.error("Please drop an image file");
          }
        }
      }
    },
    [isUploaded],
  );

  return (
    <div className="w-full h-[700px] bg-white backdrop-blur-xl rounded-2xl border border-white shadow-lg p-6 flex flex-col justify-center items-center transition-all hover:shadow-xl overflow-hidden relative">
      <div
        className={`w-full h-4/5 ${
          isUploaded
            ? "border-none"
            : `border-2 border-dashed ${isDragging ? "border-black/30" : "border-black/10"}`
        } rounded-lg flex flex-col items-center justify-center ${
          isUploaded ? "bg-transparent" : isDragging ? "bg-white" : "bg-white"
        } ${isUploaded ? "cursor-default" : "cursor-pointer"} relative transition-all backdrop-blur-md`}
        onClick={() => !isUploaded && fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!filePreview && (
          <>
            <CloudUpload
              className={`w-20 h-20 mb-4 ${
                isDragging ? "text-black/70" : "text-black/50"
              } transition-colors filter drop-shadow-lg`}
              strokeWidth={1.5}
            />
            <div className="text-black/80 text-center px-4">
              {isDragging
                ? "Engedd el a képet"
                : "Húzd ide a képet vagy kattints a feltöltéshez"}
            </div>
          </>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploaded}
        />

        {filePreview && (
          <div
            className="absolute inset-0 bg-cover bg-center rounded-lg shadow-lg"
            style={{ backgroundImage: `url(${filePreview})` }}
          >
            <div className="absolute top-3 right-3">
              <button
                onClick={handleDelete}
                className="bg-white backdrop-blur-md rounded-full p-2 shadow-lg transition-all hover:bg-white hover:scale-105"
              >
                <Trash2 className="h-5 w-5 text-black/70" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
