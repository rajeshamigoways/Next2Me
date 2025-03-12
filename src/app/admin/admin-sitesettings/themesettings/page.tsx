"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/select";
import { Label } from "../../../components/label";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ThemeSettings() {
  const [formData, setFormData] = useState({
    sitename: "",
    systemFont: "circularstd",
    sidebarTheme: "dark",
    themeColor: "primary",
    topBarColor: "white",
    loginTitle: "",
    logoType: "logo-sitename",
    companyLogo: null,
    favicon: null,
    appleIcon: null,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.files[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch("http://localhost:5000/themesettings", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Theme settings saved successfully!");
      } else {
        toast.error(result.error || "Failed to save settings.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1 className="text-2xl font-semibold mb-6">Theme Settings</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input id="sitename" name="sitename" label="Enter Site Name" value={formData.sitename} onChange={handleChange} className="max-w-xl" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoType">Logo</Label>
            <Select name="logoType" value={formData.logoType} onValueChange={(value) => setFormData((prev) => ({ ...prev, logoType: value }))}>
              <SelectTrigger className="max-w-xl">
                <SelectValue placeholder="Select logo type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="logo-sitename">Logo & Sitename</SelectItem>
                <SelectItem value="logo">Logo Only</SelectItem>
                <SelectItem value="sitename">Sitename Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Fields */}
          {["companyLogo", "favicon", "appleIcon"].map((field) => (
            <div className="space-y-2" key={field}>
              <Label htmlFor={field}>{field.replace(/([A-Z])/g, " $1")}</Label>
              <div className="flex items-center gap-4 max-w-xl">
                <Label htmlFor={`${field}-upload`} className="cursor-pointer flex bg-[#4f46e5] items-center gap-2 px-4 py-2  text-white rounded-md hover:bg-[#4f46e5]/90">
                  <Upload className="w-4 h-4" />
                  Choose File
                </Label>
                <input id={`${field}-upload`} name={field} type="file" className="hidden" onChange={handleFileChange} />
                <span className="text-sm text-muted-foreground">{formData[field]?.name || "No file chosen"}</span>
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="systemFont">System Font</Label>
            <Select name="systemFont" value={formData.systemFont} onValueChange={(value) => setFormData((prev) => ({ ...prev, systemFont: value }))}>
              <SelectTrigger className="max-w-xl">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circularstd">CircularStd</SelectItem>
                <SelectItem value="arial">Arial</SelectItem>
                <SelectItem value="helvetica">Helvetica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* More Select Fields */}
          {[
            { name: "sidebarTheme", options: ["dark", "light"] },
            { name: "themeColor", options: ["primary", "secondary", "accent"] },
            { name: "topBarColor", options: ["white", "dark", "primary"] },
          ].map(({ name, options }) => (
            <div className="space-y-2" key={name}>
              <Label htmlFor={name}>{name.replace(/([A-Z])/g, " $1")}</Label>
              <Select name={name} value={formData[name]} onValueChange={(value) => setFormData((prev) => ({ ...prev, [name]: value }))}>
                <SelectTrigger className="max-w-xl">
                  <SelectValue placeholder={`Select ${name}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <div className="space-y-2">
            <Input id="loginTitle" name="loginTitle" label="Enter Login Title" value={formData.loginTitle} onChange={handleChange} className="max-w-xl" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white px-8">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
