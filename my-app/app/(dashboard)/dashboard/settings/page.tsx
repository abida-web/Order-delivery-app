// app/dashboard/settings/page.tsx
"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Share } from "lucide-react";

const ShopSettings = () => {
  const [shopData, setShopData] = useState({
    shopName: "",
    shopSlug: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch shop data when component mounts
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await fetch("/api/shopname");
        const data = await response.json();
        setShopData({
          shopName: data.shopName || "",
          shopSlug: data.shopSlug || "",
        });
      } catch (error) {
        console.error("Error fetching shop:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, []);

  // Only generate link if we're in the browser
  const orderLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/s/${shopData.shopSlug}`
      : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderLink);
    toast.success("Copied!");
  };
  const shareData = {
    title: "Check this out!",
    text: "Fill the form for Order.",
    url: orderLink,
  };
  const shareLink = () => {
    navigator.share(shareData);
  };
  if (isLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!shopData.shopSlug) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">No Shop Found</h2>
          <p className="text-gray-600">
            You don't have a shop yet. Please create a shop first.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Your Order Form Link</h2>
        <p className="text-gray-600 mb-2">
          Share this link with customers to receive orders:
        </p>
        <div className="flex gap-2">
          <Input value={orderLink} readOnly className="bg-gray-50" />
          <Button onClick={copyToClipboard}>Copy Link</Button>
          <Button onClick={shareLink} variant={"outline"}>
            <Share />
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Customers can use this link to place orders at {shopData.shopName}
        </p>
      </Card>
    </div>
  );
};

export default ShopSettings;
