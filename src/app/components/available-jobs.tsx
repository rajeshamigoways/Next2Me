"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { MapPin, DollarSign } from "lucide-react";
import { useTheme } from "next-themes";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  color: string;
}

function JobCard({ title, company, location, salary, color }: JobCardProps) {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-black shadow-sm flex-shrink-0 w-[80%] sm:w-full transition-colors">
      <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Color Badge */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${color} flex items-center justify-center`}>
          <div className="w-6 h-6 bg-white dark:bg-gray-700 rounded-full" />
        </div>

        {/* Job Info */}
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{company}</p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {location}
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm">
              <DollarSign className="w-4 h-4 mr-1" />
              {salary}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AvailableJobs() {
  const jobs = [
    { title: "UI Designer", company: "Bubbles Studios", location: "Manchester, England", salary: "$2,000 - $2,500", color: "bg-blue-500" },
    { title: "Researcher", company: "Kleon Studios", location: "Manchester, England", salary: "$2,000 - $2,500", color: "bg-pink-500" },
    { title: "Frontend Developer", company: "Green Comp.", location: "Manchester, England", salary: "$2,000 - $2,500", color: "bg-green-500" },
    { title: "Backend Developer", company: "Tech Solutions", location: "London, UK", salary: "$3,000 - $4,500", color: "bg-yellow-500" },
  ];

  return (
    <Card className="flex flex-col transition-colors bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-900 dark:text-white">Available Jobs For You</CardTitle>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-white rounded-md text-sm border border-gray-300 dark:border-gray-700">
            <option>Newest</option>
          </select>
          <button className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
            ⋮
          </button>
        </div>
      </CardHeader>

      <CardContent className="px-2">
        {/* Desktop & Tablet: Vertical Layout */}
        <div className="hidden sm:block space-y-4">
          {jobs.map((job) => (
            <JobCard key={job.title} {...job} />
          ))}
        </div>

        {/* Mobile Only: Horizontal Scroll Layout */}
        <div className="flex sm:hidden space-x-4 overflow-x-auto -mx-2 px-2">
          {jobs.map((job) => (
            <JobCard key={job.title} {...job} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
