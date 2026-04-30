// app/dashboard/layout.tsx
// Main dashboard layout with black & gold theme (#E9B13B)

import { DashboardHeader } from "@/components/DasboardHeader";
import { Sidebar } from "@/components/Sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Fixed: Added the missing 'if' keyword
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />

      <div className="lg:pl-72">
        <DashboardHeader />
        <main className="py-8 px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
