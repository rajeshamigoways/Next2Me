"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import useAuthTokenVerification from "../../../hooks/useAuthVerification";
import { useTheme } from "../../../context/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Url from "../../../Urls"
// import useLocation from "@/app/hooks/useLocation";


const companySchema = z.object({
  companyName: z.string().min(2, "Company Name is required"),
  legalName: z.string().min(2, "Legal Name is required"),
  contactPerson: z.string().optional(),
  companyAddress: z.string().min(5, "Company Address is required"),
  postalCode: z.string().min(3, "Postal Code is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  country: z.string().min(2, "Country is required"),
  companyEmail: z.string().email("Invalid email format"),
  companyPhone: z
    .string()
    .regex(/^\d+$/, "Only numbers are allowed")
    .min(5, "Company Phone is required"),
  companyPhone2: z.string().regex(/^\d+$/, "Only numbers are allowed").optional(),
  mobilePhone: z
    .string()
    .regex(/^\d+$/, "Only numbers are allowed")
    .min(5, "Mobile Phone is required"),
  fax: z.string().regex(/^\d+$/, "Only numbers are allowed").optional(),
  companyRegistration: z.string().optional(),
  website: z.string().optional(),
  companyVAT: z.string().optional(),
});


export default function CompanyDetailsForm() {

  useAuthTokenVerification();
  const { theme } = useTheme();

  const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {},
  });

  // useLocation(setValue, !username)
  const formValues = watch();
  const [focusedField, setFocusedField] = useState<Record<string, boolean>>({});

  const handleFocus = (fieldName: string) => {
    setFocusedField((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName: string) => {
    if (!formValues[fieldName]) {
      setFocusedField((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  useEffect(() => {
    if (!username) return;
  
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(`${Url}/companysettings?username=${username}`);
        if (!response.ok) return
  
        const data = await response.json();
  
        console.log("Fetched Company Data:", data);
  
        if (Object.keys(data).length === 0) {
          // If the response is an empty object, reset the form but do not show errors
          reset({});
        } else {
          Object.keys(data).forEach((key) => {
            setValue(key as keyof typeof companySchema, data[key]);
          });
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };
  
    fetchCompanyDetails();
  }, [username, setValue, reset]);
  

  const onSubmit = async (data: any) => {
    if (!username) {
      toast.error("User not authenticated. Please log in.");
      return;
    }
  
    const requestData = { ...data, username };
    console.log("Submitting Data:", requestData);
  
    try {
      const response = await fetch(`${Url}/companysettings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Server responded with an error.");
      }
  
      const responseData = await response.json();
      console.log("Response Data:", responseData);
  
      if (responseData.company) {
        // Update form values
        Object.keys(responseData.company).forEach((key) => {
          setValue(key as keyof typeof companySchema, responseData.company[key]);
        });
  
        // Handle changes comparison
        if (responseData.changes && Object.keys(responseData.changes).length > 0) {
          const updatedFields = Object.keys(responseData.changes)
            .map((key) => `${key}`)
            .join(", ");
          toast.success(`${updatedFields} updated`);
        } else {
          toast.info("No changes detected. Data remains the same.");
        }
      } else {
        toast.error("Unexpected response format. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during submission:", error.message || error);
      toast.error(`Failed to save: ${error.message}`);
    }
  };
  
  
  

  return (
    <div
      className={`p-8 rounded-lg flex-1 shadow-md w-full transition-colors ease-in-out duration-500 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Company Details</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "companyName", label: "Company Name", required: true },
            { name: "legalName", label: "Legal Name", required: true },
            { name: "contactPerson", label: "Contact Person", required: false },
            { name: "companyAddress", label: "Company Address", required: true },
            { name: "postalCode", label: "Postal or Zip Code", required: true },
            { name: "city", label: "City", required: true },
            { name: "state", label: "State/Province", required: true },
            { name: "country", label: "Country", required: true },
            { name: "companyEmail", label: "Company Email", required: true },
            { name: "companyPhone", label: "Company Phone", required: true },
            { name: "companyPhone2", label: "Company Phone 2", required: false },
            { name: "mobilePhone", label: "Mobile Phone", required: true },
            { name: "fax", label: "Fax", required: false },
            { name: "companyRegistration", label: "Company Registration", required: false },
            { name: "website", label: "Website", required: false },
            { name: "companyVAT", label: "Company VAT", required: false },
          ].map((field, index) => (
            <div key={index} className="relative">
              <input
                {...register(field.name)}
                type="text"
                onFocus={() => handleFocus(field.name)}
                onBlur={() => handleBlur(field.name)}
                className={`peer w-full pt-5 pb-2 px-3 border rounded-md focus:ring-2 focus:outline-none transition-colors ${
                  theme === "dark"
                    ? "bg-gray-900 text-white border-gray-700 focus:ring-indigo-400"
                    : "bg-white text-black border-gray-300 focus:ring-indigo-500"
                } ${errors[field.name] ? "border-red-500" : ""}`}
              />
              <label
                className={`absolute left-3 px-1 transition-all duration-500 ease-out ${
                  theme === "dark" ? "bg-black text-white" : "bg-white text-gray-400"
                } ${
                  focusedField[field.name] || formValues[field.name]
                    ? "text-indigo-500 text-xs -top-2 scale-95 bg-white"
                    : "top-5 scale-100"
                }`}
              >
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]?.message as string}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md transition-colors ${
              theme === "dark"
                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                : "bg-indigo-500 text-white hover:bg-indigo-400"
            } disabled:opacity-50`}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
}
