"use client";

import { authClient } from "@/lib/auth-client";
import { Bell, Search, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUnseenCount } from "./actions/mark-seen";
import Searchbar from "./Searchbar";

// Define proper types
interface User {
  name?: string;
  role?: string;
  image?: string;
  email?: string;
}

interface Session {
  user: User;
  session: {
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function DashboardHeader() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unseenCount, setUnseenCount] = useState(0);
  const pathname = usePathname();

  const loadUnseenCount = async () => {
    try {
      const count = await getUnseenCount();
      setUnseenCount(count);
    } catch (error) {
      console.error("Error loading unseen count:", error);
    }
  };

  useEffect(() => {
    async function getSession() {
      try {
        const { data } = await authClient.getSession();
        setSession(data as Session);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getSession();
  }, []);

  useEffect(() => {
    loadUnseenCount();
  }, [pathname]); // Consider adding other dependencies if needed

  const user = session?.user;
  const userRole = user?.role || "Owner";

  return (
    <header className="sticky top-0 z-10 bg-black border-b border-zinc-800 shadow-sm">
      <div className="flex h-16 items-center justify-end px-6 lg:px-8">
        <div className="flex items-center max-w-md w-full mr-auto">
          <div className="relative w-full">
            <Searchbar />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/orders"
            className="relative p-2 text-zinc-400 hover:bg-zinc-800 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unseenCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-[#E9B13B] rounded-full" />
            )}
          </Link>

          <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">
                {isLoading ? "Loading..." : user?.name || "Admin User"}
              </p>
              <p className="text-xs text-zinc-400">
                {isLoading ? "..." : userRole}
              </p>
            </div>

            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || "User avatar"}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <UserCircle
                className="h-9 w-9 text-zinc-400"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
