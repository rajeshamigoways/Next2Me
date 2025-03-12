"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "../../app/context/UserContext";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "next-themes";

ChartJS.register(ArcElement, Tooltip, Legend);

const skills = [
  { name: "Figma", progress: 90, color: "#3B82F6" },
  { name: "Adobe XD", progress: 68, color: "#EC4899" },
  { name: "Photoshop", progress: 85, color: "#3B82F6" },
];

export function ProfileSection() {
  const { avatar } = useUser();
  const [username, setUsername] = useState("Loading...");
  const [error, setError] = useState("");
  const { resolvedTheme } = useTheme(); // Get current theme
  const serverUrl = "http://localhost:5000";
  const imageUrl = avatar ? `${serverUrl}${avatar}` : "/default-avatar.png";


  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        console.error("No auth token found in localStorage");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:5000/user/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData.message);
          return;
        }
  
        const data = await response.json();
        console.log("Fetched user data:", data);
        setUsername(data.username);  // Store username in state
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
  
    fetchUserDetails();
  }, []);
  const doughnutData = {
    datasets: [
      {
        data: skills.map((skill) => skill.progress),
        backgroundColor: skills.map((skill) => skill.color),
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-card-bg text-card-foreground p-4 sm:p-6 shadow-sm transition-colors"
    >
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4 mb-4 sm:mb-0">
          <div className="h-16 w-16 overflow-hidden rounded-lg">
          <Image
              src={imageUrl}
              alt="Profile"
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{username}</h2>
            <p className="text-muted-foreground">UI / UX Designer</p>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Medan, Sumatera Utara - ID</span>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <button className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 w-full sm:w-auto">
          Update Profile
        </button>
      </div>

      {/* Skills & Chart Section */}
      <div className="mt-8 flex flex-col sm:flex-row sm:gap-8 lg:grid lg:grid-cols-2">
        {/* Skills Section */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Skills</h3>
          {skills.map((skill, index) => (
            <div key={index} className="mt-4">
              <div className="flex justify-between text-sm font-medium">
                <span>{skill.name}</span>
                <span>{skill.progress}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: skill.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Doughnut Chart Section */}
        <div className="flex items-center justify-center mt-6 sm:mt-0">
          <div className="h-40 w-40 sm:h-48 sm:w-48">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
