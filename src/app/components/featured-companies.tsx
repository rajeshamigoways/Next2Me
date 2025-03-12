"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Button } from "../components/button"

interface CompanyProps {
  name: string
  color: string
}

function CompanyCard({ name, color }: CompanyProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-4 border-b last:border-b-0">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <div className="w-6 h-6 bg-white rounded-full" />
      </div>
      <div>
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-500 text-sm">Design Team Agency</p>
      </div>
    </div>
  )
}

export function FeaturedCompanies() {
  const companies = [
    { name: "Kleon Team", color: "bg-blue-500" },
    { name: "Ziro Studios Inc", color: "bg-purple-500" },
    { name: "Qerza", color: "bg-pink-500" },
    { name: "Kripton Studios", color: "bg-purple-900" },
    { name: "Omah Ku Inc.", color: "bg-blue-600" },
    { name: "Ventic", color: "bg-teal-500" },
    { name: "Sakola", color: "bg-blue-500" },
    { name: "Uena Foods", color: "bg-yellow-500" },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Featured Companies</CardTitle>
        <button className="text-gray-500 hover:text-gray-700">⋮</button>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {companies.map((company, index) => (
          <CompanyCard key={index} {...company} />
        ))}
      </CardContent>
      <div className="p-6 flex justify-center">
        <Button variant="outline" className="text-[#4f46e5] border-[#4f46e5] hover:bg-[#4f46e5] hover:text-white">
          View more
        </Button>
      </div>
    </Card>
  )
}

