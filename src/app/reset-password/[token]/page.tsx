"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../components/button";
import resetimg from "../../../../public/images/reset-password.jpg";
import Url from "../../Urls"


export default function ResetPassword() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${Url}/email/verify-token/${token}`);
        const data = await response.json();

        if (response.ok) {
          setIsValidToken(true);
        } else {
          toast.error(data.message);
          router.push("/invalid-token");
        }
      } catch (error) {
        toast.error("Error verifying token");
        router.push("/invalid-token");
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${Url}/email/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully!");
        router.push("/admin-login"); // Redirect to login page after success
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const isFormValid = password.trim() !== "" && confirmPassword.trim() !== "";
  const isPasswordMatch = password === confirmPassword;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 py-16 px-6">
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />

      {isValidToken && (
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-lg flex overflow-hidden">
          {/* Left Side - Image */}
          <div className="w-2/5 hidden md:block relative ml-6">
            <Image
              src={resetimg}
              alt="Reset Password"
              layout="fill"
              objectFit="cover"
              className="rounded-l-3xl"
            />
          </div>

          {/* Right Side - Reset Password Form */}
          <div className="w-3/5 py-12 px-12 flex flex-col justify-center">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">Reset Password</h2>
              <p className="text-sm text-gray-500">Enter your new password below.</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6 mt-6">
              {/* New Password */}
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="block px-3 pb-3 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                  placeholder=" "
                />
                <label
                  className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-3 z-10 bg-white px-2
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                    peer-focus:top-3 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-indigo-600 left-3
                    ${passwordFocused || password ? "text-indigo-600" : "text-gray-500"}`}
                >
                  New Password
                </label>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                  className={`block px-3 pb-3 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${
                    !isPasswordMatch && confirmPassword ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-0 focus:border-indigo-600 peer`}
                  placeholder=" "
                />
                <label
                  className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-3 z-10 bg-white px-2
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                    peer-focus:top-3 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-indigo-600 left-3
                    ${confirmPasswordFocused || confirmPassword ? "text-indigo-600" : "text-gray-500"}`}
                >
                  Confirm Password
                </label>
                {!isPasswordMatch && confirmPassword && (
                  <p className="text-red-500 text-sm">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
                disabled={!isFormValid}
              >
                Reset Password
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
