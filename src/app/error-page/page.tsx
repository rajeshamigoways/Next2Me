"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Error() {
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const status = window?.location?.pathname.includes("404") ? 404 : 500; // Default to 500
    setStatusCode(status);
    
    // Optional: Redirect to home page after 5 seconds
    setTimeout(() => {
      router.push("/admin");
    }, 5000);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">
        {statusCode ? `Error ${statusCode}` : "An error occurred"}
      </h1>
      <p className="text-lg text-gray-700 mt-4">
        {statusCode === 404
          ? "The page you are looking for was not found."
          : "Something went wrong. Please try again later."}
      </p>
      <a
        href="/admin"
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go Home
      </a>
    </div>
  );
}
