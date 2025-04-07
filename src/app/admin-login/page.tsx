"use client";

import { X } from "lucide-react";
import { useState,useEffect } from "react";
import { Button } from "../components/button";
import { useTheme } from "next-themes";

import { useRouter } from "next/navigation";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';  // Make sure to import both toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify's CSS

import { Checkbox } from "../components/checkbox";
import Link from "next/link";
import Url from "../Urls"

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  const [passwordFocused, setPasswordFocused] = useState(false);
  const { setTheme } = useTheme();
  const [errorMessage, setErrorMessage] = useState("");  // Error message state
  const router = useRouter();

  useEffect(() => {

    setTheme("light"); 
    const token = localStorage.getItem("authToken");
    
    if (token) {
      router.push("/admin");  // Redirect if token is missing
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  

    try {
      const response = await fetch(`${Url}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: email,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }
  
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("username", data.username);
  
      toast.success("Login successful!", { position: "top-center", autoClose: 4000 });
  
      router.push("/admin");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message, { position: "top-center" });
    }
  };
  
  
  const forgethandler=function(){
    router.push("/forget-password");
  }
  // Validate the form
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (

    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
   

        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back, Log in</h1>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                placeholder=" "
              />
              <label
                className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-indigo-600 ${
                  emailFocused || email ? "text-indigo-600 left-1" : "text-gray-500 left-1"
                }`}
              >
                User Name or Email Address
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                placeholder=" "
              />
              <label
                className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-indigo-600 ${
                  passwordFocused || password ? "text-indigo-600 left-1" : "text-gray-500 left-1"
                }`}
              >
                Password
              </label>
            </div>
          </div>

          {/* Display error message */}
          {errorMessage && (
            <div className="text-red-600 text-center mb-4">{errorMessage}</div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Button variant="link" className="text-indigo-600 hover:text-indigo-500 p-0"  onClick={forgethandler} >
              Forgot Password?
            </Button>
          </div>

          {/* Login Button */}
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
            onClick={handleLogin}
            disabled={!isFormValid} // Disable if form is not valid
          >
            Login
          </Button>
        </div>
      </div>

      {/* ToastContainer for displaying toasts */}
      <ToastContainer />
    </div>
  );
}


