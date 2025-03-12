"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Define the type for menu items
interface MenuItem {
  name: string;
  path: string;
  subItems?: MenuItem[];
}

// Define the context type
interface SettingsContextType {
  menuItems: MenuItem[];
  expandedItem: string | null;
  toggleExpand: (name: string) => void;
  navigateTo: (path: string) => void;
}

// Create context with default values
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Settings Provider Component
export function SettingsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState<string | null>(null); // 🔹 Track expanded menu

  const [menuItems] = useState<MenuItem[]>([
    { name: "General Settings", path: "/admin/admin-sitesettings/company-detailsform" },
    {
      name: "Email Settings",
      path: "/settings/email-settings",
      subItems: [
        { name: "Email Settings", path: "/admin/admin-sitesettings/email-settings" },
        { name: "Email Templates", path: "/admin/admin-sitesettings/email-templates" },
      ],
    },
    {
      name: "Message Settings",
      path: "/settings/message-settings",
      subItems: [
        { name: "Message Settings", path: "/admin/admin-sitesettings/message-settings" },
        { name: "Message Templates", path: "/admin/admin-sitesettings/message-templates" },
      ],
    },
   
    { name: "System Settings", path: "/admin/admin-sitesettings/systemsettings" },
    { name: "Translation Settings", path: "/admin/admin-sitesettings/translationsettings" },
    { name: "Theme Settings", path: "/admin/admin-sitesettings/themesettings" },
    { name: "Roles & Privileges", path: "/admin/admin-sitesettings/roles" },
    { name: "Social Media Links", path: "/admin/admin-sitesettings/socialmedialinks" },

  ]);

  // Toggle expand/collapse for specific menu
  const toggleExpand = (name: string) => {
    setExpandedItem((prev) => (prev === name ? null : name)); // 🔹 Expand only one item
  };

  // Navigate to a specific page
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <SettingsContext.Provider value={{ menuItems, expandedItem, toggleExpand, navigateTo }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook for using SettingsContext
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
