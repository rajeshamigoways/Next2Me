"use client"
import { Sidebar } from "../components/sidebar";
import { Navbar } from "../components/navbar";
import { StatsCard } from "../components/stats-card";
import { useState } from "react"
import { VacancyStats } from "../components/vacancy-stats";
import { ProfileSection } from "../components/profile-section";
import { RecentActivity } from "../components/recent-activity";
import { NetworkStats } from "../components/network-stats";
import { AvailableJobs } from "../components/available-jobs";
import { FeaturedCompanies } from "../components/featured-companies";
import { Chart } from "../components/chart";
import useAuthTokenVerification from "../hooks/useAuthVerification"

const statsData = [
  {
    title: "Interview Schedules",
    value: "342",
    change: "+0.5%",
    color: "#FF6B6B",
    data: [30, 35, 40, 35, 40, 35, 40, 35, 40, 35],
  },
  {
    title: "Application Sent",
    value: "984",
    change: "+0.5%",
    color: "#22C55E",
    data: [30, 35, 40, 35, 40, 35, 40, 35, 40, 35],
  },
  {
    title: "Profile Viewed",
    value: "1,567k",
    change: "-2.0%",
    color: "#3B82F6",
    data: [30, 35, 40, 35, 40, 35, 40, 35, 40, 35],
  },
  {
    title: "Unread Messages",
    value: "437",
    change: "+0.5%",
    color: "#EC4899",
    data: [30, 35, 40, 35, 40, 35, 40, 35, 40, 35],
  },
];

export default function DashboardPage() {
  useAuthTokenVerification()
  return ( <div className="p-4 sm:p-6">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-12">
            {/* Left Side */}
            <div className="xl:col-span-6 space-y-6 w-full">
              {/* Stats Cards */}
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2">
                {statsData.map((stat, index) => (
                  <StatsCard key={index} {...stat} />
                ))}
              </div>

              <VacancyStats />
              <Chart />
              <FeaturedCompanies />
            </div>

            {/* Right Side */}
            <div className="xl:col-span-6 space-y-6 w-full flex flex-col">
              <ProfileSection />
              <RecentActivity />
              <div className="flex flex-col gap-6 lg:flex-row xl:flex-col">
                <div className="lg:w-1/2 xl:w-full">
                  <NetworkStats />
                </div>
                <div className="lg:w-1/2 xl:w-full">
    <AvailableJobs />
  </div>
             
              </div>
            </div>
          </div>
        </div>
  
    // </div>
  )
}
