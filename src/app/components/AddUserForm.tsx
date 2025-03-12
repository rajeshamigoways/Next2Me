
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Button } from "./button";



import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface Role {
  id: string;
  roleName: string;
}

interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  address: {
    city: string;
    district: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

interface AddUserFormProps {
  closeModal: () => void;
  selectedUser: User | null;
  refreshUsers: () => void;
}

const formSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    username: z.string().min(3, "Username must be at least 3 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().min(10, "Please enter a valid phone number."),
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: "Password must be at least 6 characters.",
      }),
    confirmPassword: z.string().optional(),
    role: z.string().min(1, "Please select a role."),
    address: z.object({
      city: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 2, {
          message: "City name must be at least 2 characters.",
        }),
      district: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 2, {
          message: "District name must be at least 2 characters.",
        }),
      state: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 2, {
          message: "Enter a valid state.",
        }),
      country: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 2, {
          message: "Enter a valid country name.",
        }),
      postalCode: z
        .string()
        .optional()
        .refine((val) => !val || /^\d{4,8}$/.test(val), {
          message: "Postal Code must be between 4 and 8 digits.",
        }),
    }),
    
  })
  .refine((data) => {
    // Ensure confirmPassword matches only when password is entered
    if (data.password && data.confirmPassword !== data.password) {
      return false;
    }
    return true;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export default function AddUserForm({ closeModal, selectedUser, refreshUsers }: AddUserFormProps) {
  const {
    register,
    setValue,
    watch,
    getValues,
    trigger,
   
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: selectedUser?.fullName || "",
      username:  "",
      email: selectedUser?.email || "",
      phone: selectedUser?.phone || "",
      role: selectedUser?.role || "",
      password: "",
      
      confirmPassword: "",
      address: {
        city: selectedUser?.address?.city || "",
        district: selectedUser?.address?.district || "",
        state: selectedUser?.address?.state || "",
        country: selectedUser?.address?.country || "",
        postalCode: selectedUser?.address?.postalCode || "",
      },
    },
  });
  const [userLocation, setUserLocation] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch all countries
  useEffect(() => {
    fetch("http://localhost:5000/api/countries")
      .then((res) => res.json())
      .then((data) =>{
       
        setCountries(data)
      } )
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);
  useEffect(() => {
    if (!selectedCountry) return;
    fetch(`http://localhost:5000/api/countries/${selectedCountry}`)
      .then((res) => res.json())
      .then((data) => {
        setStates(data.states || []);
        if (data.states.length) {
          setSelectedState(data.states[0].name);
        }
      })
      .catch((err) => console.error("Error fetching states:", err));
  }, [selectedCountry]);
  useEffect(() => {
    if (!selectedCountry || !selectedState) return;
    fetch(`http://localhost:5000/api/countries/${selectedCountry}/states/${selectedState}/cities`)
      .then((res) => res.json())
      .then((data) => {
        setCities(data.cities || []);
        if (data.cities.length) {
          setSelectedCity(data.cities[0].name);
        }
      })
      .catch((err) => console.error("Error fetching cities:", err));
  }, [selectedCountry, selectedState]);
  useEffect(() => {
    if (userLocation.country) {
      setValue("address.country", userLocation.country);
      setSelectedCountry(userLocation.country);
    }
  }, [userLocation, setValue]);
  useEffect(() => {
    const fetchUserCountry = async () => {
        try {
            const res = await fetch('https://ipinfo.io/120.138.12.214?token=196a5f371d0da8');
          
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = await res.json();
            console.log("User Location:", data);

            setUserLocation(data);
        } catch (error) {
            console.error("Error fetching user country:", error);
        }
    };

    fetchUserCountry();
}, []); 
  useEffect(() => {
    if (selectedUser) {
      setValue("fullName", selectedUser.fullName);
      setValue("username", selectedUser.username);
      setValue("email", selectedUser.email);
      setValue("phone", selectedUser.phone);
      setValue("role", selectedUser.role);
      setValue("address.city", selectedUser.address.city);
      setValue("address.district", selectedUser.address.district);
      setValue("address.state", selectedUser.address.state);
      setValue("address.country", selectedUser.address.country);
      setValue("address.postalCode", selectedUser.address.postalCode);
  
      // Focus on each input field immediately after setting values
      const inputFields = document.querySelectorAll("input, select");
      inputFields.forEach((field) => {
        field.focus(); // Focus immediately
      });
    }
  }, [selectedUser, setValue]);
  const [roles, setRoles] = useState<Role[]>([]);

  const uniqueStates = states.filter(
    (state, index, self) =>
      index === self.findIndex((s) => s.name === state.name)
  );

  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await fetch("http://localhost:5000/rolesettings/");
        const data = await response.json();
        setRoles(data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    }
    fetchRoles();
  }, []);

  const handleManualSubmit = async () => {
    // Get current form values
    const values = getValues();
  
   
    console.log("its selected user",selectedUser)
    // If updating, filter only changed fields
    if (selectedUser) {
      const updatedFields: any = {};
      Object.keys(values).forEach((key) => {
        console.log(values)
        if (values[key] !== selectedUser[key as keyof User]) {
          updatedFields[key] = values[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        toast.info("No changes detected.");
        return;
      }
    }
    console.log("its testing...")
    // Validate only changed fields
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    console.log(values)
    // Proceed with API request
    const userData = {
      fullName: values.fullName,
      username: values.username,
      email: values.email,
      phone: values.phone,
      role: roles.find((role) => role.roleName === values.role)?._id,
      usertype: "subadmin",
      address: values.address,
    };
   
    if (values.password && values.password.trim() !== "") {
      userData.password = values.password;
    }
  
  
    try {
      const url = selectedUser
        ? `http://localhost:5000/user/${selectedUser._id}`
        : "http://localhost:5000/user/register";
      const method = selectedUser ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success(`User ${selectedUser ? "updated" : "registered"} successfully!`);
        refreshUsers();
        closeModal();
      } else {
        toast.error(`Error: ${data.message || "An error occurred"}`);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };
  const fetchStates = async (country) => {
    if (!country) return;
    try {
      const res = await fetch(`http://localhost:5000/api/countries/${country}`);
      const data = await res.json();
      setStates(data.states || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };
  
  const fetchCities = async (country, state) => {
    if (!country || !state) return;
    try {
      const res = await fetch(`http://localhost:5000/api/countries/${country}/states/${state}/cities`);
      const data = await res.json();
      setCities(data.cities || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  const isFieldRequired = (field: string) => {
    // Manually check for required validation rules in the schema for each field
    const requiredFields = ["fullName", "username", "email", "phone", "role"]; // Add all required field names here
  
    return requiredFields.includes(field);
  };
  
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
        <button 
    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    onClick={closeModal}
  >
    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
  </button>
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {selectedUser ? "Edit SubAdmin" : "New SubAdmin"}
        </CardTitle>
      </CardHeader>
      <CardContent>
      <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input 
      label={isFieldRequired("fullName") ? "Full Name *" : "Full Name"} 
      {...register("fullName")} 
      error={errors.fullName?.message} 
    />
    <Input 
      label={isFieldRequired("username") ? "Username *" : "Username"} 
      {...register("username")} 
      error={errors.username?.message} 
    />
    <Input 
      label={isFieldRequired("email") ? "Email *" : "Email"} 
      type="email" 
      {...register("email")} 
      error={errors.email?.message} 
    />
   <div className="flex items-center gap-2">
  <div className="w-24">
  <Select
  value={selectedCountry}
  {...register("address.country")}
  onValueChange={(value) => {
    setSelectedCountry(value);
    setValue("address.country", value);
  }}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="+Code" />
  </SelectTrigger>
  <SelectContent>
    {countries.map((country) => (
      <SelectItem key={country.iso2} value={country.iso2}>
        {`+${country.phonecode}`}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

  </div>

  <Input 
      label={isFieldRequired("phone") ? "Phone *" : "Phone"} 
      {...register("phone")} 
      error={errors.phone?.message} 
    />
</div>

  
  {/* <PhoneInputWithCountry
    value={watch("phone") || ""}
    onChange={(phone) => {
      setValue("phone", phone);
      trigger("phone");
    }}
    label="Phone Number"
    error={errors.phone?.message}
  /> */}


   

   
  <Input label={isFieldRequired("password") ? "Password *" : "Password"}  type="password" {...register("password")} error={errors.password?.message} />
  <Input label="Confirm Password" type="password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />
</div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Select
  value={selectedCountry}
  onValueChange={(value) => {
    setSelectedCountry(value);
    setSelectedState(""); // Reset state
    setSelectedCity(""); // Reset city
    setStates([]); // Clear states list
    setCities([]); // Clear cities list
    setValue("address.country", value);
    fetchStates(value); // Fetch new states based on selected country
  }}
>
  <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
  <SelectContent>
    {countries.map((c) => (
      <SelectItem key={c.iso2} value={c.iso2}>{c.name}</SelectItem>
    ))}
  </SelectContent>
</Select>

<Select
  value={selectedState}
  onValueChange={(value) => {
    setSelectedState(value);
    setSelectedCity(""); // Reset city
    setCities([]); // Clear cities list
    setValue("address.state", value);
    fetchCities(selectedCountry, value); // Fetch new cities based on selected state
  }}
  disabled={!states.length}
>
  <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
  <SelectContent>
    {states.map((s) => (
      <SelectItem key={s.state_code} value={s.name}>{s.name}</SelectItem>
    ))}
  </SelectContent>
</Select>

<Select
  value={selectedCity}
  onValueChange={(value) => {
    setSelectedCity(value);
    setValue("address.city", value);
  }}
  disabled={!selectedState} // Disable until state is selected
>
  <SelectTrigger>
    <SelectValue placeholder="Select City" />
  </SelectTrigger>
  <SelectContent>
    {cities.map((city) => (
      <SelectItem key={city.id} value={city.name}>
        {city.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>



<Input
  label="Postal Code"
  {...register("address.postalCode")}
  defaultValue={userLocation?.postal} // Ensure this updates when state changes
/>

    </div>
      <Select onValueChange={(value) => setValue("role", value)} value={watch("role") || ""}>
  <SelectTrigger>
    <SelectValue placeholder="Select Role">
      {watch("role")
        ? roles.find((r) => r.roleName === watch("role"))?.roleName
        : "Select Role"}
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    {roles
      .filter((role) => role.roleName !== "ADMIN") // Exclude ADMIN
      .map((role) => (
        <SelectItem key={role._id} value={role.roleName}>
          {role.roleName}
        </SelectItem>
      ))}
  </SelectContent>
</Select>

          <div className="flex justify-center">
            <Button type="button" className="bg-[#4f46e5] text-white px-8 py-2 rounded-md" onClick={handleManualSubmit}>
              {selectedUser ? "Update User" : "Register User"}
            </Button>
          </div>
        </form>
      </CardContent>
    
      <ToastContainer position="top-center" />
    </Card>
  );
}
