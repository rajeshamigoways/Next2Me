"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../app/context/UserContext";
import { useTheme } from "../context/ThemeContext";
import {
  Bell,
  Mail,
  Settings,
  Plus,
  Moon,
  Search,
  LogOut,
  Sun,
  X,
  Menu,
  ArrowRight
} from "lucide-react";
import { Input } from "../components/input";

export function Navbar({ isCollapsed, setIsCollapsed }) {
  const { avatar } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);  // New state for notifications dropdown
  const dropdownRef = useRef(null);

  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const serverUrl = "http://localhost:5000";
  const imageUrl = avatar ? `${serverUrl}${avatar}` : "/default-avatar.png";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const storedEmail = localStorage.getItem("username");
      const response = await fetch("http://localhost:5000/user/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail: storedEmail }),
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      router.push("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSettings = () => {
    router.push("/admin/admin-sitesettings/company-detailsform");
  };

  const handlePostEdit = () => {
    router.push("/admin/profile-edit");
  };



  const handleCreateNotification = () => {
    router.push("/admin/notification");
  };

  return (
    <header className="w-full py-3 px-4 sm:px-6 bg-white dark:bg-gray-900 shadow border-b dark:border-gray-800">
      <div className="flex items-center justify-between flex-wrap">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-600 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
          >
            {isCollapsed ? <Menu className="w-6 h-6" /> : <ArrowRight className="w-6 h-6 text-[#4f46e5]" />}
          </button>

          {/* Profile Picture */}
          <div className="relative h-8 w-8 sm:h-10 sm:w-10">
            <img src={imageUrl} alt="User Avatar" className="rounded-full cursor-pointer" />
          </div>

          {/* Brand Name */}
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">PostZol</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
          </div>

          <span className="hidden lg:block text-lg font-medium text-gray-700 dark:text-gray-300">
            Dashboard
          </span>
        </div>

        {/* Search Section */}
        <div className="hidden sm:flex relative w-full max-w-md items-center">
          <Input type="text" label="Search here" />
          <Search className="absolute right-3 h-5 w-5 text-gray-400 cursor-pointer" />
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Add Icon (Hidden on XS) */}
          <Plus className="hidden sm:block h-6 w-6 lg:h-8 lg:w-8 text-gray-600 dark:text-gray-300 cursor-pointer" />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition bg-gray-200 dark:bg-gray-800 cursor-pointer"
          >
            {theme === "light" ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-300" />}
          </button>

          {/* Notifications */}
          <div className="relative cursor-pointer" onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}>
            <Bell className="h-6 w-6 lg:h-8 lg:w-8 text-gray-600 dark:text-gray-300" />
            {/* Notifications Dropdown */}
            {notificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={handleCreateNotification}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  New Notification
                </button>
                {/* You can add other notification options here */}
              </div>
            )}
          </div>

          {/* Messages (Hidden on XS) */}
          <div className="relative hidden sm:block cursor-pointer">
            <Mail className="h-6 w-6 lg:h-8 lg:w-8 text-gray-600 dark:text-gray-300" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 lg:h-5 lg:w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
              4
            </span>
          </div>

          {/* Settings (Hidden on XS) */}
          <div className="relative hidden sm:block cursor-pointer" onClick={handleSettings}>
            <Settings className="h-6 w-6 lg:h-8 lg:w-8 text-gray-600 dark:text-gray-300" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 lg:h-5 lg:w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
              15
            </span>
          </div>

          {/* Profile Image Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img src={imageUrl} alt="Profile" className="h-full w-full object-cover" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={handlePostEdit}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left cursor-pointer"
                >
                  <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left cursor-pointer"
                >
                  <LogOut className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
