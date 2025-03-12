"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuthTokenVerification = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.push("/admin-login"); // Redirect if no token found
      return;
    }

    const verifyAuthToken = async () => {
      try {
        const response = await fetch("http://localhost:5000/user/verify-authtoken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!data.valid) {
          console.error("Invalid token:", data.message);
          localStorage.removeItem("authToken"); // Remove invalid token
          router.push("/admin-login"); // Redirect to login
        }
      } catch (error) {
        console.error("Token verification error:", error);
        router.push("/admin-login"); // Redirect on error
      }
    };

    verifyAuthToken();
  }, [router]);
};

export default useAuthTokenVerification;
