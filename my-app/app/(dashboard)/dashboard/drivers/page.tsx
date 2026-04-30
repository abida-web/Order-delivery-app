"use client";
import React, { useEffect, useState } from "react";
import { Phone, User, Calendar, Store } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  phone: string;
  userId: string;
  shopId: string;
  createdAt: string;
  shop: {
    id: string;
    name: string;
    shopSlug: string;
    ownerId: string;
    createdAt: string;
  };
}

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const res = await fetch("/api/create-driver");
        const data = await res.json();
        setDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDrivers();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-zinc-400">Loading drivers...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Drivers</h1>
        <p className="text-zinc-400 mt-1">Manage your delivery drivers</p>
      </div>

      {drivers.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/50 rounded-lg">
          <p className="text-zinc-400">No drivers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 hover:bg-zinc-900 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-500/10 p-2 rounded-full">
                    <User size={20} className="text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {driver.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Phone size={16} className="text-green-400" />
                  <span className="text-sm">{driver.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-zinc-300">
                  <Store size={16} className="text-blue-400" />
                  <span className="text-sm">{driver.shop.name}</span>
                </div>

                <div className="flex items-center gap-2 text-zinc-300">
                  <Calendar size={16} className="text-purple-400" />
                  <span className="text-xs text-zinc-500">
                    Joined {formatDate(driver.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Drivers;
