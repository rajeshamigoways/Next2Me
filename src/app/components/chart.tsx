"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { motion } from "framer-motion"

export function Chart() {
  const [timeframe, setTimeframe] = useState("Monthly")

  // Different data sets
  const dataSets = {
    Day: [
      { value: 12, date: "12 AM" },
      { value: 30, date: "6 AM" },
      { value: 50, date: "12 PM" },
      { value: 25, date: "6 PM" },
      { value: 40, date: "12 AM" },
    ],
    Weekly: [
      { value: 40, date: "Mon" },
      { value: 55, date: "Tue" },
      { value: 35, date: "Wed" },
      { value: 70, date: "Thu" },
      { value: 45, date: "Fri" },
      { value: 65, date: "Sat" },
      { value: 50, date: "Sun" },
    ],
    Monthly: [
      { value: 49, date: "01" },
      { value: 35, date: "02" },
      { value: 10, date: "03" },
      { value: 45, date: "04" },
      { value: 39, date: "05" },
      { value: 49, date: "06" },
      { value: 60, date: "07" },
      { value: 35, date: "08" },
      { value: 10, date: "09" },
      { value: 49, date: "10" },
      { value: 34, date: "11" },
      { value: 35, date: "12" },
      { value: 49, date: "13" },
    ],
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-xl font-semibold">Chart</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-gray-50 p-1">
            {["Day", "Weekly", "Monthly"].map((option) => (
              <button
                key={option}
                onClick={() => setTimeframe(option)}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  timeframe === option
                    ? "bg-[#4f46e5] text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Legend */}
        <motion.div 
          className="flex items-center gap-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#4f46e5]" />
            <span className="text-sm font-medium">Delivered</span>
            <span className="text-sm">239</span>
            <span className="text-sm text-green-500">+0.4%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300" />
            <span className="text-sm font-medium">Expense</span>
            <span className="text-sm">$8,345</span>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div 
          className="h-[300px] w-full"
          key={timeframe}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={dataSets[timeframe]} 
              margin={{ top: 0, right: 0, bottom: 0, left: -15 }}
            >
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                domain={[0, 80]}
                ticks={[0, 20, 40, 60, 80]}
              />
              <Bar 
                dataKey="value" 
                fill="#4f46e5" 
                radius={[4, 4, 0, 0]} 
                barSize={16} 
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  )
}
