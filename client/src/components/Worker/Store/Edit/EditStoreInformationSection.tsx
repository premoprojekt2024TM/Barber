import type React from "react";
import { useState, useEffect, useRef } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { X } from "lucide-react";

const GOOGLE_MAPS_API_KEY = "AIzaSyCSJN2Qzyjhv-AFd1I2LVLD30hX7-lZhRE";
interface LocationType {
  label: string;
  value?: {
    description: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface InitialValuesType {
  name?: string;
  phone?: string;
  email?: string;
  location?: LocationType | null;
}

interface StoreInformationProps {
  onStoreInfoChange: (
    name: string,
    phone: string,
    email: string,
    location: LocationType | null,
  ) => void;
  initialValues?: InitialValuesType;
  disabled?: boolean;
}

export const EditStoreInfo = ({
  onStoreInfoChange,
  initialValues,
  disabled = false,
}: StoreInformationProps) => {
  const [storeName, setStoreName] = useState(initialValues?.name || "");
  const [storePhone, setStorePhone] = useState(() => {
    const phone = initialValues?.phone || "";
    return phone.startsWith("+36 ") ? phone.substring(4) : phone;
  });
  const [storeEmail, setStoreEmail] = useState(initialValues?.email || "");
  const [location, setLocation] = useState<LocationType | null>(
    initialValues?.location || null,
  );
  const [addressText, setAddressText] = useState(
    initialValues?.location?.label || "",
  );
  const [isManualInput, setIsManualInput] = useState(!!initialValues?.location);
  const [isTyping, setIsTyping] = useState(false);
  const placesRef = useRef<any>(null);

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Initialize with initial values if provided
  useEffect(() => {
    if (initialValues) {
      // Only update if values change to avoid infinite loops
      if (initialValues.name !== storeName) {
        setStoreName(initialValues.name || "");
      }

      // Handle phone number formatting
      if (initialValues.phone) {
        const formattedPhone = initialValues.phone.startsWith("+36 ")
          ? initialValues.phone.substring(4)
          : initialValues.phone;

        if (formattedPhone !== storePhone) {
          setStorePhone(formattedPhone);
        }
      }

      if (initialValues.email !== storeEmail) {
        setStoreEmail(initialValues.email || "");
      }

      if (
        initialValues.location &&
        location?.label !== initialValues.location.label
      ) {
        setLocation(initialValues.location);
        setAddressText(initialValues.location.label || "");
        setIsManualInput(true);
      }
    }
  }, [initialValues]);

  // Initial notification to parent component with valid values
  useEffect(() => {
    if (initialValues) {
      // Validate initial email if provided
      const isEmailValid =
        !initialValues.email || validateEmail(initialValues.email);

      // Validate initial phone if provided
      const phoneWithoutPrefix = initialValues.phone?.startsWith("+36 ")
        ? initialValues.phone.substring(4)
        : initialValues.phone || "";
      const isPhoneValid =
        !phoneWithoutPrefix || validatePhoneNumber(phoneWithoutPrefix);

      const validEmail = isEmailValid ? initialValues.email || "" : "";
      const validPhone = isPhoneValid ? initialValues.phone || "" : "";

      onStoreInfoChange(
        initialValues.name || "",
        validPhone,
        validEmail,
        initialValues.location || null, // Ensure null is handled
      );
    }
  }, []);

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
    if (disabled) return; // Don't process if disabled
    const name = e.target.value;
    setStoreName(name);
    onStoreInfoChange(
      name,
      storePhone ? "+36 " + storePhone : "",
      storeEmail,
      location, // Already can be null
    );
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return; // Don't process if disabled
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
      onStoreInfoChange(
        storeName,
        "",
        storeEmail,
        location, // Already can be null
      ); // Send empty string to parent on error
    } else {
      setPhoneError(null);
      onStoreInfoChange(
        storeName,
        fullPhoneNumber,
        storeEmail,
        location, // Already can be null
      );
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return; // Don't process if disabled
    const email = e.target.value;
    setStoreEmail(email);

    if (email && !validateEmail(email)) {
      setEmailError("Kérlek, érvényes email címet adj meg.");
      onStoreInfoChange(
        storeName,
        storePhone ? "+36 " + storePhone : "",
        "",
        location, // Already can be null
      ); // Send empty string to parent on error
    } else {
      setEmailError(null);
      onStoreInfoChange(
        storeName,
        storePhone ? "+36 " + storePhone : "",
        email,
        location, // Already can be null
      );
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return; // Don't process if disabled
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
    onStoreInfoChange(
      storeName,
      storePhone ? "+36 " + storePhone : "",
      storeEmail,
      locationObj,
    );
  };

  const handleAddressBlur = () => {
    setIsTyping(false);
  };

  const handlePlaceSelect = (value: any) => {
    if (disabled) return; // Don't process if disabled
    setLocation(value);
    setAddressText(value.label || "");
    setIsManualInput(true); // Switch to manual mode after selection
    onStoreInfoChange(
      storeName,
      storePhone ? "+36 " + storePhone : "",
      storeEmail,
      value,
    );
  };

  const clearAddress = () => {
    if (disabled) return;
    setAddressText("");
    setLocation(null);
    setIsManualInput(false);
    onStoreInfoChange(
      storeName,
      storePhone ? "+36 " + storePhone : "",
      storeEmail,
      null, // Explicitly pass null
    );

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
      opacity: disabled ? 0.7 : 1,
      pointerEvents: disabled ? "none" : "auto",
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

  const inputClass = `w-full px-4 py-2.5 bg-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${disabled ? "opacity-70 cursor-not-allowed" : ""}`;

  return (
    <div
      className={`w-full bg-white backdrop-blur-xl rounded-2xl border border-white shadow-lg p-6 flex flex-col gap-6 transition-all hover:shadow-xl relative overflow-visible ${disabled ? "opacity-90" : ""}`}
    >
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
          disabled={disabled}
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
              value: null, // Fixed: Don't pass location directly to avoid type mismatch
              noOptionsMessage: () => "Nincs találat",
              loadingMessage: () => "Keresés folyamatban...",
              styles: customStyles,
              menuPortalTarget: document.body,
              menuPosition: "fixed",
              isDisabled: disabled,
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
            disabled={disabled}
          />
          {!disabled && (
            <button
              type="button"
              onClick={clearAddress}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              title="Törlés"
              disabled={disabled}
            >
              <X className="h-5 w-5" />
            </button>
          )}
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
            disabled={disabled}
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
          disabled={disabled}
        />
        {emailError && (
          <p className="text-red-500 text-sm mt-1">{emailError}</p>
        )}
      </div>
    </div>
  );
};
