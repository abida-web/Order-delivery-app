"use client";

import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalOrders: "",
    pending: "",
    preparing: "",
    outForDelivery: "",
    delivered: "",
  });
  useEffect(() => {
    async function fetchDashboard() {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setDashboard({
        totalOrders: data.totalOrders,
        pending: data.pending,
        preparing: data.preparing,
        outForDelivery: data.outForDelivery,
        delivered: data.delivered,
      });
    }
    fetchDashboard();
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-lg font-semibold  text-gray-200">
              Total Orders
            </h1>
            <span className="text-3xl font-bold text-blue-600">
              {dashboard.totalOrders.length}
            </span>
          </div>
        </Card>

        {/* Pending Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-lg font-semibold  text-gray-200">Pending</h1>
            <span className="text-3xl font-bold text-yellow-600">
              {dashboard.pending.length}
            </span>
          </div>
        </Card>
        {/* Out for Delivery Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-lg font-semibold  text-gray-200">Preparing</h1>
            <span className="text-3xl font-bold text-blue-600">
              {dashboard.preparing.length}
            </span>
          </div>
        </Card>
        {/* Out for Delivery Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-lg font-semibold  text-gray-200">
              Out for Delivery
            </h1>
            <span className="text-3xl font-bold text-orange-600">
              {dashboard.outForDelivery.length}
            </span>
          </div>
        </Card>

        {/* Delivered Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-lg font-semibold text-gray-200">Delivered</h1>
            <span className="text-3xl font-bold text-green-600">
              {dashboard.delivered.length}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
