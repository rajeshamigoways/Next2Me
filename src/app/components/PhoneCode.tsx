"use client";
import * as React from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Input } from "../components/input"; // Your existing Input component

const countryCodes = ["+1", "+44", "+91", "+61", "+81", "+49", "+33", "+39", "+86", "+7"]; // Add more as needed

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (phone: string) => void;
  label: string;
  error?: string;
}

const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value,
  onChange,
  label,
  error,
}) => {
  const [countryCode, setCountryCode] = React.useState("+1"); // Default to US

  // Fetch country code based on IP
  React.useEffect(() => {
    async function fetchCountryCode() {
      try {
        const res = await fetch("https://ipwhois.app/json/");
        const data = await res.json();
        if (data?.country_phone) {
          setCountryCode(data.country_phone);
        }
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    }
    fetchCountryCode();
  }, []);

  // Handle phone number input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    onChange(inputValue);
  };

  return (
    <div className="relative w-full">
      <div className="flex">
        {/* Country Code Selector */}
        <select
          className="border rounded-l-md px-2 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          {countryCodes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>

        {/* Phone Input */}
        <Input
          type="tel"
          label={label}
          value={value}
          onChange={handlePhoneChange}
          className="w-full"
        />
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default PhoneInputWithCountry;
