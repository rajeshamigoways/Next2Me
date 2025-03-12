"use client"
import { useUser } from "../../context/UserContext";

import { useState,useContext,useRef } from "react";
import axios from "axios";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";
import { Label } from "../../components/label";
import useAuthTokenVerification from "../../hooks/useAuthVerification"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProfile() {
  useAuthTokenVerification()
  const { updateUsername, avatar, updateAvatar } = useUser();
  const [profileDetails, setProfileDetails] = useState({
    fullName: "",
    phone: "",
  });

  // Account Details State
  const [accountDetails, setAccountDetails] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Error State
  const [passwordError, setPasswordError] = useState("");

  // Avatar State

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
  

  // Handle profile details change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileDetails({ ...profileDetails, [e.target.id]: e.target.value });
  };

  // Handle account details change
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountDetails({ ...accountDetails, [e.target.id]: e.target.value });
    setPasswordError(""); // Reset error when user starts typing
  };

  // Handle avatar selection
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      setAvatarFile(file); // Store file in state
    }
  };
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Correctly get updateUsername
  
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Unauthorized! Please log in again.");
      return;
    }
  
    const payload = { ...profileDetails };
  
    try {
      const response = await fetch("http://localhost:5000/profilesettings/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      if (response.ok) {
        updateUsername(data.admin.username); // Update username in context
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (accountDetails.newPassword !== accountDetails.confirmPassword) {
      setPasswordError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
  
    const authToken = localStorage.getItem("authToken"); // Retrieve authToken from localStorage
    if (!authToken) {
      toast.error("Unauthorized! Please log in again.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/profilesettings/changepassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Send authToken in headers
        },
        body: JSON.stringify({
          oldPassword: accountDetails.oldPassword,
          newPassword: accountDetails.newPassword,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success("Password changed successfully!");
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error("Please select an avatar file to upload.");
      return;
    }
  
    const authToken = localStorage.getItem("authToken"); // Retrieve stored auth token
  
    if (!authToken) {
      toast.error("Unauthorized: No auth token found.");
      return;
    }
  
    const formData = new FormData();
    formData.append("avatar", avatarFile);
  
    try {
      const response = await fetch("http://localhost:5000/profilesettings/avatar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`, // Send token in headers
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        updateAvatar(data.avatar);
        toast.success("Avatar uploaded successfully!");

        console.log("Updated Avatar Path:", data.avatar);
        // Update UI or state if necessary
      } else {
        toast.error(data.message || "Failed to upload avatar.");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Server error. Please try again later.");
    }
  };
  

  return (
    <div className="container mx-auto py-6 px-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile (Admin)</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile Details</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleProfileSubmit}>
              <Input id="fullName" label="Full Name *" value={profileDetails.fullName} onChange={handleProfileChange} />
              <Input id="phone" label="Phone" value={profileDetails.phone} onChange={handleProfileChange} />
              <Button type="submit" className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white">Update Profile</Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Account Details</CardTitle></CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleAccountSubmit}>
                <Input id="oldPassword" type="password" label="Old Password" value={accountDetails.oldPassword} onChange={handleAccountChange} />
                <Input id="newPassword" type="password" label="New Password" value={accountDetails.newPassword} onChange={handleAccountChange} />
                <Input id="confirmPassword" type="password" label="Confirm Password" value={accountDetails.confirmPassword} onChange={handleAccountChange} />
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                <Button type="submit" className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white">Change Password</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Avatar</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="avatar">Upload Avatar</Label>
              <div className="flex items-center gap-2">
                <input id="avatar" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                <Button type="button" onClick={() => document.getElementById("avatar")?.click()} className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white">Choose File</Button>
                <span className="text-sm text-gray-500">
  {avatarFile ? avatarFile.name : "No file chosen"}
</span>
              </div>
              <Button type="button" onClick={handleAvatarUpload} className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white">Upload Avatar</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
