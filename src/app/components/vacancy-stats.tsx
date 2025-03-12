"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const timeRanges = ["Daily", "Weekly", "Monthly"] as const;
type TimeRange = (typeof timeRanges)[number];

const datasets = {
  Daily: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [
      [5, 8, 6, 9, 7, 10, 6], // Application Sent
      [2, 3, 4, 5, 6, 2, 4], // Interviews
      [3, 4, 5, 3, 4, 6, 5], // Rejected
    ],
  },
  Weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [
      [25, 30, 28, 35],
      [10, 15, 12, 18],
      [12, 10, 15, 17],
    ],
  },
  Monthly: {
    labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    data: [
      [35, 40, 40, 30, 35, 32, 40, 32],
      [20, 25, 35, 25, 22, 20, 21, 38],
      [30, 35, 40, 35, 38, 48, 40, 35],
    ],
  },
};

export function VacancyStats() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Monthly");
  const { resolvedTheme } = useTheme();

  // Define colors based on theme
  const isDarkMode = resolvedTheme === "dark";
  const gridColor = isDarkMode ? "#374151" : "#E5E7EB"; // Dark mode: Gray-700, Light mode: Gray-200
  const textColor = isDarkMode ? "#E5E7EB" : "#374151"; // Light text for dark mode

  const chartData = {
    labels: datasets[timeRange]?.labels || [],
    datasets: [
      {
        label: "Application Sent",
        data: datasets[timeRange]?.data[0] || [],
        borderColor: "#22C55E",
        borderWidth: 3,
        tension: 0.4,
        fill: false,
      },
      {
        label: "Interviews",
        data: datasets[timeRange]?.data[1] || [],
        borderColor: "#3B82F6",
        borderWidth: 3,
        tension: 0.4,
        fill: false,
      },
      {
        label: "Rejected",
        data: datasets[timeRange]?.data[2] || [],
        borderColor: "#EF4444",
        borderWidth: 3,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: textColor, // Adjust legend text color based on theme
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor, // Adjust grid lines based on theme
        },
        ticks: {
          color: textColor, // Adjust axis labels based on theme
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: textColor, // Adjust axis labels based on theme
        },
      },
    },
  };

  return (
    <div
   
      className="rounded-lg bg-card-bg p-6 shadow-sm w-full transition-colors"
    >
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <h2 className="text-xl font-semibold text-card-foreground">Vacancy Stats</h2>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(() => range)}
              className={`rounded-full px-4 py-1 text-sm transition-colors ${
                timeRange === range
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-6">
        {chartData.datasets.map((dataset, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: dataset.borderColor }} />
            <span className="text-sm text-muted-foreground">{dataset.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] sm:h-[400px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
