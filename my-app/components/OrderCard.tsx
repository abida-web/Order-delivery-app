"use client";

import { MapPin, Package, Phone, Tag, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import Link from "next/link";

interface Driver {
  name: string;
  id?: string;
  phone?: string;
}

interface OrderProps {
  id: string;
  customerName: string;
  status: "pending" | "preparing" | "out for delivery" | "delivered" | string;
  customerPhone: string;
  address: string;
  product: string;
  driver?: Driver;
  size?: string;
  color?: string;
  quantity?: number;
  price?: string | null;
  currency?: string | null;
}

const OrderCard = ({
  order,
  onOrderUpdate,
}: {
  order: OrderProps;
  onOrderUpdate?: () => void;
}) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const res = await fetch("/api/create-driver");
        const data = await res.json();
        setDrivers(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    }
    fetchDrivers();
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 ring-1 ring-amber-600/20";
      case "preparing":
        return "bg-blue-100 text-blue-800 ring-1 ring-blue-600/20";
      case "out for delivery":
        return "bg-purple-100 text-purple-800 ring-1 ring-purple-600/20";
      case "delivered":
        return "bg-green-100 text-green-800 ring-1 ring-green-600/20";
      default:
        return "bg-gray-100 text-gray-800 ring-1 ring-gray-600/20";
    }
  };

  async function handleChangeStatus(status: string) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success("Preparing for delivery");
        onOrderUpdate?.();
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteOrder() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Order removed");
        onOrderUpdate?.();
      }
    } catch (error) {
      toast.error("Failed to delete the order");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAssignDriver(formData: FormData) {
    const orderId = formData.get("orderId");
    const driverId = formData.get("driverId");
    const currency = formData.get("currency");
    const price = formData.get("price");

    if (!driverId) {
      toast.error("Please select a driver");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "out for delivery",
          driverId,
          orderId,
          price,
          currency,
        }),
      });
      if (res.ok) {
        toast.success("Driver assigned and order out for delivery");
        onOrderUpdate?.();
      }
    } catch (error) {
      toast.error("Failed to assign driver");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Link
      href={`/dashboard/orders/${order.id}`}
      className="p-5 border-l-2 border-amber-400 bg-amber-100/5 rounded-xl hover:bg-amber-100/10 transition-all duration-200"
    >
      <div className="flex justify-between items-start">
        <span className="text-xl font-semibold text-white">
          {order.customerName}
        </span>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full shadow-sm transition-all duration-200 inline-flex items-center justify-center gap-1.5 capitalize ${getStatusStyles(
            order.status,
          )}`}
        >
          {order.status}
        </span>
      </div>

      <div className="py-2 border-y border-zinc-800 mt-5">
        <h2 className="text-lg flex gap-2 items-center text-zinc-200">
          <Package size={15} color="#E9B13B" />
          {order.product}
        </h2>
        {/* Size, Color, Quantity */}
        <div className="flex gap-4 mt-2 text-sm text-zinc-400">
          {order.size && (
            <span className="flex items-center gap-1">
              <span className="text-zinc-500">Size:</span> {order.size}
            </span>
          )}
          {order.color && (
            <span className="flex items-center gap-1">
              <span className="text-zinc-500">Color:</span>
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: order.color.toLowerCase() }}
              />
              {order.color}
            </span>
          )}
          {order.quantity && (
            <span className="flex items-center gap-1">
              <span className="text-zinc-500">Qty:</span> {order.quantity}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex gap-2 items-center hover:bg-amber-100/5 px-3 rounded-full py-1 transition-colors duration-200">
          <MapPin size={15} color="#ef4444" />
          <span className="text-zinc-300 text-sm">{order.address}</span>
        </div>

        <div className="flex gap-2 items-center hover:bg-amber-100/5 px-3 rounded-full py-1 transition-colors duration-200">
          <Phone size={15} color="#22c55e" />
          <span className="text-zinc-300 text-sm">{order.customerPhone}</span>
        </div>

        {order.status === "pending" && (
          <Button
            onClick={() => handleChangeStatus("preparing")}
            disabled={isLoading}
          >
            Prepare Order
          </Button>
        )}

        {order.driver && (
          <div className="flex gap-2 items-center hover:bg-amber-100/5 px-3 rounded-full py-1 transition-colors duration-200">
            <UserCircle size={15} color="#60a5fa" />
            <span className="text-zinc-300 text-sm">
              Driver: {order.driver.name}
            </span>
          </div>
        )}

        {order.status === "preparing" && (
          <form action={handleAssignDriver} className="space-y-2">
            <input type="hidden" name="orderId" value={order.id} />
            {order.price !== undefined && (
              <Input
                type="number"
                name="price"
                defaultValue={order.price || ""}
                className="px-3 py-2 rounded-md border border-zinc-700 bg-zinc-800 text-white"
                placeholder="Price"
              />
            )}
            {order.currency !== undefined && (
              <Input
                type="text"
                name="currency"
                defaultValue={order.currency || ""}
                className="px-3 py-2 rounded-md border border-zinc-700 bg-zinc-800 text-white"
                placeholder="Currency"
              />
            )}
            <Select name="driverId">
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Drivers</SelectLabel>
                  {drivers?.length ? (
                    drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No drivers available
                    </div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Assigning..." : "Assign Driver"}
            </Button>
          </form>
        )}
      </div>
    </Link>
  );
};

export default OrderCard;
