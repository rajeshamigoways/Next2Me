"use client";

import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { useTheme } from "next-themes";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  color: string;
  data: number[];
}

export function StatsCard({ title, value, change, color, data }: StatsCardProps) {
  const { resolvedTheme } = useTheme(); // Get the current theme

  const chartData = {
    labels: new Array(10).fill(""),
    datasets: [
      {
        data: data,
        borderColor: color,
        borderWidth: 2,
        tension: 0.4,
        pointStyle: false,
        fill: true,
        backgroundColor: `${color}30`, // Adjusted for dark mode
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg p-4 shadow-sm transition-colors bg-white dark:bg-black text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl sm:text-3xl font-bold">
            {value}
          </motion.h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        </div>
        <div className="h-12 w-20 sm:h-16 sm:w-24 mt-2 sm:mt-0">
          <Line data={chartData} options={options} />
        </div>
      </div>
      <span
        className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${
          change.startsWith("+")
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        }`}
      >
        {change}
      </span>
    </motion.div>
  );
}
