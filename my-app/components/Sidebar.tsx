"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: ClipboardList },
  { name: "Drivers", href: "/dashboard/drivers", icon: Truck },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };
  const sidebarContent = (
    <div className="flex flex-col flex-grow bg-zinc-900 border-r border-zinc-800 pt-5 pb-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <img src="./logo.png" className="h-16" alt="Logo" />
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 rounded-md text-zinc-400 hover:bg-zinc-800"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="hidden lg:flex items-center py-3 absolute top-0">
        <img src="./logo.png" className="h-20" alt="Logo" />
      </div>

      <nav className="lg:mt-19 flex-1 px-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-[#E9B13B] transition-colors duration-200"
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-zinc-500 group-hover:text-[#E9B13B]" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-zinc-800 pt-4 mt-auto px-4">
        <button
          onClick={handleSignOut}
          className="group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-zinc-400 hover:bg-red-950 hover:text-red-500 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-zinc-500 group-hover:text-red-500" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md text-zinc-400 hover:bg-zinc-800 bg-black border border-zinc-800"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        {sidebarContent}
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
