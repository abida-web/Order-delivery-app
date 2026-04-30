"use client";

import { markAsSeen } from "@/components/actions/mark-seen";
import OrderCard from "@/components/OrderCard";
import { Package } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";

interface Order {
  id: string;
  product: string;
  customerName: string;
  customerPhone: string;
  status: string;
  isSeen: boolean;
  [key: string]: any; // For any additional fields
}

interface OrdersResponse {
  orders: Order[];
  totalPage?: number;
}

const Orders = () => {
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [selectStatus, setSelectStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      setIsRefreshing(true);

      const res = await fetch(`/api/orders?page=${page}`);
      if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);

      const data = await res.json();
      setData(data);
      setTotalPages(data?.totalPage || 1);

      // Safely get orders array
      const ordersArray = data?.orders || [];

      const unseenOrders = ordersArray.filter(
        (order: Order) => order.isSeen === false,
      );

      // Mark as seen using the updated server action
      if (unseenOrders.length > 0) {
        await markAsSeen(unseenOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load orders",
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Get all orders array safely
  const orders = useMemo(() => {
    return data?.orders || [];
  }, [data]);

  // Get unique statuses from orders
  const statuses = useMemo(() => {
    if (!orders.length) return ["All"];
    return ["All", ...new Set(orders.map((order) => order.status))];
  }, [orders]);

  // Filter orders based on selected status
  const filteredData = useMemo(() => {
    if (!selectStatus || selectStatus === "All") {
      return orders;
    }
    return orders.filter((order) => order.status === selectStatus);
  }, [orders, selectStatus]);

  // Loading state
  if (!data && !error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <div className="text-gray-400">Loading orders...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading orders</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-amber-100/10 rounded-lg sm:rounded-xl">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-200">
                Orders
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                Manage and track all customer orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isRefreshing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
            )}
            <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-500 text-white rounded-full text-xs sm:text-sm font-semibold w-fit">
              Total Orders: {orders.length}
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Buttons */}
      {statuses.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {statuses.map((status, i) => (
            <button
              key={i}
              onClick={() => setSelectStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectStatus === status
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {status}
              {status !== "All" && (
                <span className="ml-2 text-xs opacity-75">
                  ({orders.filter((order) => order.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Orders Grid */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No orders found</p>
          <p className="text-gray-500 text-sm mt-1">
            {selectStatus && selectStatus !== "All"
              ? `No orders with status "${selectStatus}"`
              : "No orders have been placed yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {filteredData.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onOrderUpdate={fetchOrders}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-gray-800">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              page === 1
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-300 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              page === totalPages
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
