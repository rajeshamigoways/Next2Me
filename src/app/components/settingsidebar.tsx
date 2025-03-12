"use client";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useSettings } from "../context/RolesContext";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const { menuItems, expandedItem, toggleExpand, navigateTo } = useSettings();
  const { theme } = useTheme();
  const currentPath = usePathname();

  return (
    <div className={`w-64 min-h-screen p-4 shadow-md transition-colors ease-in-out duration-500 ${
      theme === "dark" ? "bg-black text-white" : "bg-white text-black"
    } fade-in-left`}>
      <h2 className="text-xl font-semibold mb-4">Site Settings</h2>

      {/* Menu List */}
      <ul className="space-y-1">
        {menuItems.map((item) => {
          const isActive =
            currentPath === item.path || item.subItems?.some((sub) => sub.path === currentPath);

          return (
            <li key={item.name}>
              <div
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition ${
                  isActive
                    ? theme === "dark"
                      ? "bg-gray-800 font-semibold"
                      : "bg-gray-200 font-semibold"
                    : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => (item.subItems ? toggleExpand(item.name) : navigateTo(item.path))}
              >
                <span className="flex-1">{item.name}</span>
                {item.subItems && (
                  <ChevronRight
                    className={`w-5 h-5 transform transition-transform ${
                      expandedItem === item.name ? "rotate-90" : ""
                    }`}
                  />
                )}
              </div>

              {/* Submenu */}
              {expandedItem === item.name && item.subItems && (
                <ul
                  className={`ml-4 mt-1 space-y-1 border-l-2 pl-3 transition-colors ${
                    theme === "dark" ? "border-gray-700" : "border-gray-300"
                  }`}
                >
                  {item.subItems.map((subItem) => {
                    const isSubActive = currentPath === subItem.path;
                    return (
                      <li
                        key={subItem.name}
                        className={`p-2 rounded-md cursor-pointer transition ${
                          isSubActive
                            ? theme === "dark"
                              ? "bg-gray-800 font-semibold"
                              : "bg-gray-300 font-semibold"
                            : theme === "dark"
                            ? "text-gray-300 hover:bg-gray-900"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => navigateTo(subItem.path)}
                      >
                        {subItem.name}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
