"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/card";
import { Input } from "../../../components/input";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthTokenVerification from "../../../hooks/useAuthVerification";
import { useTheme } from "../../../context/ThemeContext";

export default function SocialMediaForm() {
  useAuthTokenVerification();
  const { theme } = useTheme();

  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    pinterest: "",
    linkedin: "",
    snapchat: "",
    discord: "",
    reddit: "",
    telegram: "",
    whatsapp: "",
  });

  const [originalLinks, setOriginalLinks] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch("http://localhost:5000/socialmediasettings");
        const data = await response.json();
        if (response.ok && data.data) {
          setSocialLinks(data.data);
          setOriginalLinks(data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch social media links.");
        console.error("Error fetching social media links:", error);
      }
    };
    fetchSocialLinks();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedLinks = Object.fromEntries(
      Object.entries(socialLinks).filter(([key, value]) => value.trim() !== "" && value !== originalLinks[key])
    );

    if (Object.keys(updatedLinks).length === 0) {
      toast.error("No changes detected. Please update a link before saving.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/socialmediasettings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLinks),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedKeys = Object.keys(updatedLinks).map((key) => key.toUpperCase()).join(", ");
        toast.success(`${updatedKeys} LINK is Updated`);
        setOriginalLinks((prev) => ({ ...prev, ...updatedLinks }));
      } else {
        toast.error(data.message || "Failed to update links.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error updating links:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen px-4 transition-all duration-300 ${theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme={theme === "dark" ? "dark" : "light"} />

      <Card className={`w-full max-w-2xl p-4 md:p-6 shadow-lg transition-all duration-300 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Social Media Links</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:gap-5" onSubmit={handleSubmit}>
            {Object.keys(socialLinks).map((key) => (
              <div key={key} className="grid gap-2">
                <Input
                  id={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1) + " Link"}
                  type="url"
                  value={socialLinks[key]}
                  onChange={handleChange}
                /> 
              </div>
            ))}
            <div className="mt-4 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className={`w-full md:w-auto px-6 py-3 rounded-lg transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-[#4f46e5] hover:bg-[#4338ca] text-white"
                } disabled:opacity-50`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
