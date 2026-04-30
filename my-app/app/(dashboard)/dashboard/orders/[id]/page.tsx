"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  User,
  Phone,
  MapPin,
  ShoppingBag,
  Ruler,
  Palette,
  Hash,
  CreditCard,
  Truck,
  Store,
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Order {
  id: string;
  shopId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  product: string;
  status: string;
  price: number | null;
  size: string | null;
  color: string | null;
  currency: string | null;
  quantity: number;
  isSeen: boolean;
  driverId: string | null;
  updatedAt: string;
  createdAt: string;
  shop: {
    id: string;
    name: string;
    shopSlug: string;
    ownerId: string;
    createdAt: string;
    owner: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
  deriver: null | {
    id: string;
    name: string;
    phone: string;
  };
}

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params?.id as string;

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch order: ${response.status}`);
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <div className="text-gray-400">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="text-red-500 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg font-semibold">Error loading order</p>
          <p className="text-sm mt-2">{error || "Order not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100/10 rounded-xl">
              <Package className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-200">
                Order Details
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                ID: {order.id.slice(0, 8)}...{order.id.slice(-8)}
              </p>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(
              order.status,
            )}`}
          >
            {getStatusIcon(order.status)}
            <span className="text-sm font-medium capitalize">
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            Order Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Package className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="text-gray-200 font-medium">{order.product}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="text-gray-200 font-medium">{order.quantity}</p>
                </div>
              </div>

              {order.size && (
                <div className="flex items-start gap-3">
                  <Ruler className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="text-gray-200 font-medium">{order.size}</p>
                  </div>
                </div>
              )}

              {order.color && (
                <div className="flex items-start gap-3">
                  <Palette className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-zinc-700"
                        style={{ backgroundColor: order.color.toLowerCase() }}
                      />
                      <p className="text-gray-200 font-medium">{order.color}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {order.price && (
                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-gray-200 font-medium">
                      {order.currency || "USD"} {order.price}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="text-gray-200 font-medium">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-200 font-medium">
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            Customer Information
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="text-gray-200 font-medium">
                  {order.customerName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-gray-200 font-medium">
                  {order.customerPhone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Delivery Address</p>
                <p className="text-gray-200 font-medium">{order.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Information */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-500" />
            Shop Information
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Store className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Shop Name</p>
                <p className="text-gray-200 font-medium">{order.shop.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Shop Owner</p>
                <p className="text-gray-200 font-medium">
                  {order.shop.owner.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Owner Contact</p>
                <p className="text-gray-200 font-medium">
                  {order.shop.owner.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Information (if assigned) */}
        {order.deriver && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              Driver Information
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Driver Name</p>
                  <p className="text-gray-200 font-medium">
                    {order.deriver.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Driver Phone</p>
                  <p className="text-gray-200 font-medium">
                    {order.deriver.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
