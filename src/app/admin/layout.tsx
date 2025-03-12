"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "../components/sidebar";
import { Navbar } from "../components/navbar";
import useAuthTokenVerification from "../hooks/useAuthVerification";



export default function AdminLayout({ children }) {
  useAuthTokenVerification()
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar state

  return (
    <div className="flex h-screen">
      <Sidebar isCollapsed={isCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
        <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
