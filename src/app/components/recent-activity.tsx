"use client";

import { motion } from "framer-motion";
import { MoreVertical } from "lucide-react";
import { useTheme } from "next-themes";

const activities = [
  {
    company: "Bubles Studios",
    message: "have 5 available positions for you",
    time: "8 min ago",
    color: "#EC4899",
  },
  {
    company: "Elextra Studios",
    message: "has invited you to interview meeting tomorrow",
    time: "8 min ago",
    color: "gray",
  },
  {
    company: "Highspeed Design Team",
    message: "have 2 available positions for you",
    time: "8 min ago",
    color: "gray",
  },
  {
    company: "Kleon Studios",
    message: "have 5 available positions for you",
    time: "8 min ago",
    color: "gray",
  },
];

export function RecentActivity() {
  const { resolvedTheme } = useTheme(); // Get current theme

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg p-6 shadow-sm transition-colors bg-white dark:bg-black text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
    >
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="flex items-center gap-4">
          <button className="mt-2 sm:mt-0 rounded-full bg-red-50 px-4 py-1 text-sm text-red-500 dark:bg-red-900 dark:text-red-300">
            Oldest
          </button>
          <button className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative space-y-8">
        <div className="absolute left-2.5 top-0 h-full w-px bg-gray-200 dark:bg-gray-600" />

        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4"
          >
            <div className="h-5 w-5 rounded-full" style={{ backgroundColor: activity.color }} />
            <div>
              <p className="font-medium">{activity.company} {activity.message}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
