"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Menu, Settings } from "lucide-react";
import { cn } from "../lib/utils";
import { useState, useEffect } from "react";
import { useMenu } from "../context/MenuContext";
import Url from "../Urls"

export function Sidebar({ isCollapsed }) {
  const { menuItems } = useMenu();
  const [username, setUsername] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        console.error("No auth token found in localStorage");
        return;
      }
  
      try {
        const response = await fetch(`${Url}/user/me/`, {
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
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen bg-white dark:bg-black shadow-lg border-r dark:border-gray-700 z-40 flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div
        className={`p-4 flex items-center gap-3 border-b dark:border-gray-700 ${
          isCollapsed ? "justify-center" : "justify-start"
        } h-16`}
      >
        <User className="w-6 h-8 text-gray-500 dark:text-gray-400" />
        {!isCollapsed && (
          <p className="text-gray-800 dark:text-white text-sm">
            Welcome, <strong>{username || "Guest"}</strong>
          </p>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="px-3 py-4 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300",
                    isCollapsed ? "justify-center" : "justify-start",
                    isActive
                      ? "bg-indigo-600 text-white dark:bg-indigo-500"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
