import React, { useState, useRef } from "react";
import { FormData } from "./types";

const MAX_FILE_SIZE = 1 * 1024 * 1024;

interface ProfileProps {
  formData: FormData;
  avatar: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Profile = (props: ProfileProps) => {
  const { formData, avatar, handleChange } = props;
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickToChangeAvatar = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.type !== "image/jpeg") {
        setAvatarError("Csak JPEG formátumú kép tölthető fel.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setAvatarError("A fájl nem haladhatja meg az 1MB-ot.");
        return;
      } else {
        setAvatarError(null);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange({
          target: { name: "avatar", value: reader.result as string },
        } as any);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          <img
            src={avatar}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <button
          type="button"
          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          onClick={handleClickToChangeAvatar}
        >
          Profilkép módosítása
        </button>
        <input
          type="file"
          accept="image/jpeg"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAvatarChange}
        />
        {avatarError && (
          <p className="text-red-500 text-sm mt-2">{avatarError}</p>
        )}
      </div>
      <div className="h-px w-full bg-gray-200 my-4"></div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Vezetéknév
            </label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              Keresztnév
            </label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Felhasználónév
          </label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
          <p className="text-xs text-gray-500">Az email cím nem módosítható</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
