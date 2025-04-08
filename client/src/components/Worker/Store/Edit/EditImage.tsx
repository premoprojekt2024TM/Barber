import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { CloudUpload, Trash2 } from "lucide-react";

const useSnackbar = () => {
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 3000);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return { snackbarMessage, snackbarOpen, showSnackbar, closeSnackbar };
};

interface EditImageProps {
  onImageChange: (
    base64Image: string | null,
    previewUrl: string | null,
  ) => void;
  previewUrl?: string | null;
  disabled?: boolean;
}

export const EditImage = ({
  onImageChange,
  previewUrl,
  disabled = false,
}: EditImageProps) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { snackbarMessage, snackbarOpen, showSnackbar, closeSnackbar } =
    useSnackbar();

  useEffect(() => {
    if (previewUrl) {
      setFilePreview(previewUrl);
      setIsUploaded(true);
    }
  }, [previewUrl]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const processFile = async (file: File) => {
    if (disabled) return;
    if (file) {
      if (file.size > 1024 * 1024) {
        showSnackbar("A fálj nem lehet nagyobb, mint 1 MB.");
        return;
      }
      if (file.type !== "image/jpeg") {
        showSnackbar("Csak JPEG fájl engedélyezett.");
        return;
      }

      try {
        const fileUrl = URL.createObjectURL(file);
        const base64String = await convertToBase64(file);

        setFilePreview(fileUrl);
        setIsUploaded(true);
        onImageChange(base64String, fileUrl);
      } catch (error) {
        showSnackbar("Hiba történt a fájl feldolgozása közben.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      processFile(uploadedFile);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    setFilePreview(null);
    setIsUploaded(false);
    onImageChange(null, null);
  };

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      if (!isUploaded) {
        setIsDragging(true);
      }
    },
    [isUploaded, disabled],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    [disabled],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      if (!isUploaded) {
        setIsDragging(true);
      }
    },
    [isUploaded, disabled],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!isUploaded) {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          const droppedFile = files[0];
          if (droppedFile.size > 1024 * 1024) {
            showSnackbar("A fálj nem lehet nagyobb mint 1 MB");
            return;
          }
          if (droppedFile.type !== "image/jpeg") {
            showSnackbar("Csak JPEG fájl típus engedélyezett.");
            return;
          }
          processFile(droppedFile);
        }
      }
    },
    [isUploaded, showSnackbar, disabled],
  );

  return (
    <div
      className={`w-full h-[700px] bg-white backdrop-blur-xl rounded-2xl border border-white shadow-lg p-6 flex flex-col justify-center items-center transition-all hover:shadow-xl overflow-hidden relative ${disabled ? "opacity-70 pointer-events-none" : ""}`}
    >
      <div
        className={`w-full h-4/5 ${
          isUploaded
            ? "border-none"
            : `border-2 border-dashed ${isDragging ? "border-black/30" : "border-black/10"}`
        } rounded-lg flex flex-col items-center justify-center ${
          isUploaded ? "bg-transparent" : isDragging ? "bg-white" : "bg-white"
        } ${isUploaded || disabled ? "cursor-default" : "cursor-pointer"} relative transition-all backdrop-blur-md`}
        onClick={() =>
          !isUploaded && !disabled && fileInputRef.current?.click()
        }
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
                : disabled
                  ? "A kép szerkesztése le van tiltva"
                  : "Húzd ide a képet vagy kattints a feltöltéshez"}
            </div>
          </>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploaded || disabled}
        />

        {filePreview && (
          <div
            className="absolute inset-0 bg-cover bg-center rounded-lg shadow-lg"
            style={{ backgroundImage: `url(${filePreview})` }}
          >
            {!disabled && (
              <div className="absolute top-3 right-3">
                <button
                  onClick={handleDelete}
                  className="bg-white backdrop-blur-md rounded-full p-2 shadow-lg transition-all hover:bg-white hover:scale-105"
                  disabled={disabled}
                >
                  <Trash2 className="h-5 w-5 text-black/70" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {snackbarOpen && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 z-50 bg-black/80 text-white py-3 px-6 rounded-lg shadow-lg backdrop-blur-md">
          {snackbarMessage}
          <button
            onClick={closeSnackbar}
            className="absolute top-3 right-3 text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
