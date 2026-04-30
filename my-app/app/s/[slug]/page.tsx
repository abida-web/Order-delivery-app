"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Wand2,
  User,
  Phone,
  MapPin,
  Package,
  DollarSign,
  X,
  CheckCircle,
  Ruler,
  Palette,
  Hash,
} from "lucide-react";

const NewOrder = () => {
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    product: "",
    size: "",
    color: "",
    quantity: "",
    status: "pending",
  });

  const params = useParams();
  const slug = params.slug;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: orderForm.customerName,
          customerPhone: orderForm.customerPhone,
          address: orderForm.address,
          product: orderForm.product,
          size: orderForm.size,
          color: orderForm.color,
          quantity: parseInt(orderForm.quantity),
          status: orderForm.status,
          shopSlug: slug,
        }),
      });

      if (response.ok) {
        console.log("Order created successfully");
        setOrderForm({
          customerName: "",
          customerPhone: "",
          address: "",
          product: "",
          size: "",
          color: "",
          quantity: "",
          status: "pending",
        });
        alert("Order placed successfully!");
      } else {
        console.error("Failed to create order");
        alert("Failed to place order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOrderForm({
      customerName: "",
      customerPhone: "",
      address: "",
      product: "",
      size: "",
      color: "",
      quantity: "",
      status: "pending",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900/4 via-amber-800/50 to-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl shadow-lg shadow-amber-500/20">
              <Wand2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Create New Order
            </h1>
          </div>
          <p className="text-gray-400 ml-2">
            Fill in the customer details below
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden bg-black backdrop-blur-sm border border-gray-700">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-600 h-2"></div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                  <User className="h-4 w-4 text-amber-500" />
                  Customer Name
                </label>
                <Input
                  placeholder="Enter customer name"
                  value={orderForm.customerName}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      customerName: e.target.value,
                    })
                  }
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-500" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={orderForm.customerPhone}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      customerPhone: e.target.value,
                    })
                  }
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Address - Full Width */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  Delivery Address
                </label>
                <textarea
                  placeholder="Enter complete delivery address"
                  value={orderForm.address}
                  className="w-full outline-none border border-gray-600 rounded-lg px-4 py-3 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 transition-all duration-200 resize-none"
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      address: e.target.value,
                    })
                  }
                  required
                  rows={3}
                />
              </div>

              {/* Product */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                  <Package className="h-4 w-4 text-amber-500" />
                  Product Name
                </label>
                <Input
                  placeholder="Enter product name"
                  value={orderForm.product}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      product: e.target.value,
                    })
                  }
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Size - Manual Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-amber-500" />
                  Size
                </label>
                <Input
                  placeholder="Enter size (e.g., M, XL, 42, etc.)"
                  value={orderForm.size}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      size: e.target.value,
                    })
                  }
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Color - Manual Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-amber-500" />
                  Color
                </label>
                <Input
                  placeholder="Enter color (e.g., Red, Blue, Black, etc.)"
                  value={orderForm.color}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      color: e.target.value,
                    })
                  }
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-amber-500" />
                  Quantity
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={orderForm.quantity}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      quantity: e.target.value,
                    })
                  }
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8 pt-6 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="gap-2 border-gray-600 hover:bg-gray-700 text-gray-300 transition-all duration-200"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg shadow-amber-500/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Create Order
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Card */}
        <div className="mt-6 p-4 bg-amber-900/20 rounded-lg border border-amber-800/50">
          <p className="text-sm text-amber-300 text-center">
            💡 Tip: Double-check customer details before submitting the order
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
