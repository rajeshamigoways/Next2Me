"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthTokenVerification from "../../hooks/useAuthVerification"

export default function AdminSiteSettings() {
  useAuthTokenVerification()
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/admin-sitesettings/company-detailsform");
  }, [router]);

  return null; // No need to render anything, just redirect
}
