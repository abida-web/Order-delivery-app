"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, PhoneIcon, Package, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Delivery {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  price: number;
  quantity: number;
  status: string;
  shop?: {
    derivers?: Array<{ name: string }>;
  };
}

const Driver = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callingNumber, setCallingNumber] = useState<string | null>(null);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/driver/orders");

      if (!res.ok) {
        throw new Error(`Failed to fetch deliveries: ${res.status}`);
      }

      const data = await res.json();
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching deliveries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const driverName = deliveries[0]?.shop?.derivers?.[0]?.name || "Driver";

  function dialNumber(phoneNumber: string) {
    setCallingNumber(phoneNumber);
    window.location.href = `tel:${phoneNumber}`;
    // Reset after a delay
    setTimeout(() => setCallingNumber(null), 1000);
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-400/80 text-yellow-800",
      processing: "bg-blue-400/80 text-blue-800",
      delivered: "bg-green-400/80 text-green-800",
      cancelled: "bg-red-400/80 text-red-800",
    };
    return statusColors[status.toLowerCase()] || "bg-gray-400/80 text-gray-800";
  };

  const getTotalAmount = (price: number, quantity: number) => {
    return price * quantity;
  };
  const router = useRouter();
  async function handleChangeStatus(status: string, orderId) {
    try {
      const res = await fetch(`/api/driver/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success("Preparing for delivery");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  }
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <p className="mt-4 text-gray-400">Loading deliveries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-400 mb-4">Error: {error}</p>
        <button
          onClick={fetchDeliveries}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold py-1">Hello, {driverName}! 👋</h1>
        <p className="pb-2 text-gray-400">Here are your deliveries for today</p>
      </div>

      <div className="flex flex-col">
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="flex gap-2 items-center text-lg font-semibold">
              <Package className="w-5 h-5" />
              Today's Deliveries
              <span className="bg-blue-400 text-[12px] text-white px-2 py-px font-semibold rounded-full">
                {deliveries.length}
              </span>
            </h1>
            <button
              onClick={fetchDeliveries}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {deliveries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No deliveries assigned for today</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {deliveries.map((delivery) => {
                const total = getTotalAmount(delivery.price, delivery.quantity);
                const statusColor = getStatusColor(delivery.status);

                return (
                  <div
                    key={delivery.id}
                    className="p-5 flex flex-col gap-3 border border-l-4 rounded-lg shadow-sm hover:shadow-md transition"
                    style={{ borderLeftColor: "#3b82f6" }}
                  >
                    <div className="flex justify-between items-center">
                      <h6 className="text-sm text-gray-500">
                        Order ID:{" "}
                        <span className="font-mono text-gray-600">
                          {delivery.id.slice(0, 15)}...
                        </span>
                      </h6>
                      <h1
                        className={`py-px rounded-lg px-3 inline-block text-sm font-medium ${statusColor}`}
                      >
                        {delivery.status}
                      </h1>
                    </div>

                    <h1 className="text-2xl font-semibold">
                      {delivery.customerName}
                    </h1>

                    <div className="flex flex-col gap-2">
                      <p className="flex gap-2 text-md text-gray-600">
                        <MapPin size={18} className="text-gray-500" />
                        <span>{delivery.address}</span>
                      </p>

                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-green-600">
                          Total: AFN {total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {delivery.quantity} × AFN {delivery.price}
                        </p>
                      </div>
                    </div>
                    {delivery.status === "out for delivery" && (
                      <Button
                        onClick={() =>
                          handleChangeStatus("delivered", delivery.id)
                        }
                      >
                        Mark as Delivered
                      </Button>
                    )}
                    <button
                      onClick={() => dialNumber(delivery.customerPhone)}
                      className="flex items-center justify-center gap-2 mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full sm:w-auto"
                      disabled={callingNumber === delivery.customerPhone}
                    >
                      <PhoneIcon size={18} />
                      {callingNumber === delivery.customerPhone
                        ? "Calling..."
                        : "Call Customer"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Driver;
