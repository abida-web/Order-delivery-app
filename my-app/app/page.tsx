"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Automatic redirect to dashboard after 1 second
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
      <h1 className="text-2xl font-bold text-gray-200">Order Delivery App</h1>
      <p className="text-gray-400 mt-2">Redirecting to dashboard...</p>
    </div>
  );
}
