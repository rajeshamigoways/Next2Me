"use client";
import Sidebar from "../../components/settingsidebar";
import useAuthTokenVerification from "../../hooks/useAuthVerification";

export default function AdminLayout({ children }) {
  useAuthTokenVerification();

  return (
    <div className="flex h-screen">
      <Sidebar  />
      <div className={`flex-1 flex flex-col transition-all duration-300`}>
       
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
