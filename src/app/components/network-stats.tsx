"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"

interface StatProps {
  percentage: number
  title: string
  vacancy: number
}

function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 35
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-20 h-20 sm:w-24 sm:h-24">
        {/* Background Circle */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-gray-200"
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-[#4f46e5]"
        />
      </svg>
      {/* Percentage Label */}
      <span className="absolute text-xl font-semibold">{percentage}%</span>
    </div>
  )
}

function Stat({ percentage, title, vacancy }: StatProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <CircularProgress percentage={percentage} />
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-gray-500 text-sm">{vacancy.toLocaleString()} Vacancy</p>
    </div>
  )
}

export function NetworkStats() {
  const stats = [
    { percentage: 66, title: "Engineer", vacancy: 5050 },
    { percentage: 31, title: "Designer", vacancy: 10524 },
    { percentage: 75, title: "Manager", vacancy: 621 },
    { percentage: 62, title: "Programmer", vacancy: 9662 },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Network</CardTitle>
        <button className="text-gray-500 hover:text-gray-700">⋮</button>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Stat key={stat.title} {...stat} />
        ))}
      </CardContent>
    </Card>
  )
}
