import type React from "react";
import { useState, useEffect, useRef } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { X } from "lucide-react";

const GOOGLE_MAPS_API_KEY = "AIzaSyCSJN2Qzyjhv-AFd1I2LVLD30hX7-lZhRE"; // HARDCODED API KEY - SECURE YOURS!

interface StoreInformationProps {
  onStoreInfoChange: (
    name: string,
    phone: string,
    email: string,
    location: any,
  ) => void;
}

export const StoreInformationSection = ({
  onStoreInfoChange,
}: StoreInformationProps) => {
  const [storeName, setStoreName] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [location, setLocation] = useState<any>(null);
  const [addressText, setAddressText] = useState("");
  const [isManualInput, setIsManualInput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const placesRef = useRef<any>(null);

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (location && !isTyping) {
      setAddressText(location.label || location.value?.description || "");
    }
  }, [location, isTyping]);

  const validateEmail = (email: string): boolean => {
    // Basic email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    // Check if it matches 12 345 6789 format
    const phoneRegex = /^\d{2} \d{3} \d{4}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setStoreName(name);
    onStoreInfoChange(name, storePhone, storeEmail, location);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digitsOnly = inputValue.replace(/\D/g, "");

    let formattedPhone = "";
    if (digitsOnly.length > 0) {
      const groups = [2, 3, 4];
      let currentPosition = 0;

      for (
        let i = 0;
        i < groups.length && currentPosition < digitsOnly.length;
        i++
      ) {
        const group = digitsOnly.substring(
          currentPosition,
          currentPosition + groups[i],
        );
        formattedPhone += group;
        currentPosition += groups[i];
        if (currentPosition < digitsOnly.length) formattedPhone += " ";
      }
    }

    setStorePhone(formattedPhone);

    const fullPhoneNumber = "+36 " + formattedPhone;
    if (formattedPhone && !validatePhoneNumber(formattedPhone)) {
      setPhoneError(
        "Kérlek, érvényes telefonszámot adj meg (12 345 6789 formátum).",
      );
      onStoreInfoChange(storeName, "", storeEmail, location); // Send empty string to parent on error
    } else {
      setPhoneError(null);
      onStoreInfoChange(storeName, fullPhoneNumber, storeEmail, location);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setStoreEmail(email);

    if (email && !validateEmail(email)) {
      setEmailError("Kérlek, érvényes email címet adj meg.");
      onStoreInfoChange(storeName, storePhone, "", location); // Send empty string to parent on error
    } else {
      setEmailError(null);
      onStoreInfoChange(storeName, storePhone, email, location);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setAddressText(address);
    setIsTyping(true);

    const locationObj = {
      label: address,
      value: {
        description: address,
      },
    };

    setLocation(locationObj);
    onStoreInfoChange(storeName, storePhone, storeEmail, locationObj);
  };

  const handleAddressBlur = () => {
    setIsTyping(false);
  };

  const handlePlaceSelect = (value: any) => {
    setLocation(value);
    setAddressText(value.label || "");
    setIsManualInput(true); // Switch to manual mode after selection
    onStoreInfoChange(storeName, storePhone, storeEmail, value);
  };

  const clearAddress = () => {
    setAddressText("");
    setLocation(null);
    setIsManualInput(false);
    onStoreInfoChange(storeName, storePhone, storeEmail, null);

    // Reset the Google Places component
    if (placesRef.current) {
      placesRef.current.select.clearValue();
    }
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: "8px",
      backgroundColor: "white",
      border: "1px solid rgba(0, 0, 0, 0.2)",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 0, 0, 0.2)" : "none",
      borderColor: state.isFocused ? "#000" : "rgba(0, 0, 0, 0.2)",
      "&:hover": {
        borderColor: state.isFocused ? "#000" : "rgba(0, 0, 0, 0.3)",
      },
      padding: "2px",
    }),
    input: (provided: any) => ({
      ...provided,
      padding: "4px 0",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      position: "absolute",
      backgroundColor: "white",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(0, 0, 0, 0.2)",
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor: state.isSelected
        ? "rgba(0, 0, 0, 0.8)"
        : state.isFocused
          ? "rgba(0, 0, 0, 0.1)"
          : "transparent",
      color: state.isSelected ? "white" : "black",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      paddingLeft: "8px",
    }),
  };

  // Hungarian flag mini-SVG
  const HungarianFlag = () => (
    <svg width="24" height="16" viewBox="0 0 24 16" className="mr-1">
      <rect width="24" height="5.33" fill="#ce2b37" />
      <rect y="5.33" width="24" height="5.33" fill="#fff" />
      <rect y="10.66" width="24" height="5.33" fill="#008c45" />
    </svg>
  );

  const inputClass =
    "w-full px-4 py-2.5 bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black";

  return (
    <div className="w-full bg-white backdrop-blur-xl rounded-2xl border border-white shadow-lg p-6 flex flex-col gap-6 transition-all hover:shadow-xl relative overflow-visible">
      <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-[1]"></div>

      <h2 className="text-xl font-semibold text-black/80 mb-2 relative z-[2]">
        Bolt információk
      </h2>

      <div className="w-full">
        <label className="block mb-2 text-black/80 font-medium">
          Bolt neve
        </label>
        <input
          type="text"
          value={storeName}
          onChange={handleNameChange}
          placeholder="Bolt neve"
          className={inputClass}
        />
      </div>

      <div className="w-full">
        <label className="block mb-2 text-black/80 font-medium">
          Bolt helye
        </label>

        <div className={isManualInput ? "hidden" : "block"}>
          <GooglePlacesAutocomplete
            ref={placesRef}
            apiKey={GOOGLE_MAPS_API_KEY}
            selectProps={{
              placeholder: "Cím keresése",
              onChange: handlePlaceSelect,
              value: location,
              noOptionsMessage: () => "Nincs találat",
              loadingMessage: () => "Keresés folyamatban...",
              styles: customStyles,
              menuPortalTarget: document.body,
              menuPosition: "fixed",
            }}
            autocompletionRequest={{
              componentRestrictions: {
                country: ["hu"],
              },
              types: ["address"],
            }}
            debounce={300}
          />
        </div>

        <div className={isManualInput ? "block relative" : "hidden"}>
          <input
            type="text"
            value={addressText}
            onChange={handleAddressChange}
            onBlur={handleAddressBlur}
            placeholder="Cím megadása"
            className={inputClass}
          />
          <button
            type="button"
            onClick={clearAddress}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            title="Törlés"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="w-full">
        <label className="block mb-2 text-black/80 font-medium">
          Bolt telefonszáma
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <HungarianFlag />
            <span className="text-gray-800 font-medium mr-1">+36</span>
          </div>
          <input
            type="text"
            value={storePhone}
            onChange={handlePhoneChange}
            placeholder="12 345 6789"
            className={`${inputClass} pl-20`}
            maxLength={12}
          />
        </div>
        {phoneError && (
          <p className="text-red-500 text-sm mt-1">{phoneError}</p>
        )}
      </div>

      <div className="w-full">
        <label className="block mb-2 text-black/80 font-medium">
          Bolt email címe
        </label>
        <input
          type="email"
          value={storeEmail}
          onChange={handleEmailChange}
          placeholder="Email cím"
          className={inputClass}
        />
        {emailError && (
          <p className="text-red-500 text-sm mt-1">{emailError}</p>
        )}
      </div>
    </div>
  );
};
