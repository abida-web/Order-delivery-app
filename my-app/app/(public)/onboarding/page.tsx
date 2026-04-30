"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { ArrowRight, Copy, Share, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const OnBoarding = () => {
  const router = useRouter();
  const [steps, setSteps] = useState(1);
  const { data: session, isPending } = authClient.useSession();
  const [shopData, setShopData] = useState({
    shopName: "",
    shopSlug: "",
  });
  const [mainUrl, setMainUrl] = useState("");
  const [isCreatingShop, setIsCreatingShop] = useState(false);

  // Generate slug automatically from shop name
  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }

  // Update slug when shop name changes
  useEffect(() => {
    if (shopData.shopName) {
      const slug = generateSlug(shopData.shopName);
      setShopData((prev) => ({ ...prev, shopSlug: slug }));
    }
  }, [shopData.shopName]);

  // Set URL only on client-side
  useEffect(() => {
    if (shopData.shopSlug) {
      setMainUrl(`${window.location.origin}/orders/${shopData.shopSlug}`);
    }
  }, [shopData.shopSlug]);

  // Handle redirect for onboarded users
  useEffect(() => {
    if (!isPending && session?.user?.onBoarded === true) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const isBoarded = session.user.onBoarded === true;
  if (isBoarded) {
    return null;
  }

  const prevStep = () => {
    setSteps((prev) => prev - 1);
  };

  const handleCreateShop = async () => {
    if (!shopData.shopName.trim()) {
      toast.error("Please enter a shop name");
      return;
    }

    setIsCreatingShop(true);
    try {
      const response = await fetch("/api/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: shopData.shopName,
          shopSlug: shopData.shopSlug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create shop");
      }

      toast.success("Shop created successfully!");

      // After creating shop, update user's onboarding status
      await authClient.updateUser({
        onBoarded: true,
      });

      // Move to next step (share link)
      setSteps(3);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create shop",
      );
    } finally {
      setIsCreatingShop(false);
    }
  };

  const nextStep = async () => {
    if (steps === 2) {
      // Create shop when moving from step 2 to step 3
      await handleCreateShop();
    } else if (steps === 3) {
      setSteps(4);
    } else if (steps === 4) {
      router.push("/dashboard");
    } else {
      setSteps((prev) => prev + 1);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mainUrl);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: shopData.shopName || "My Shop",
        text: `Check out my shop: ${shopData.shopName}`,
        url: mainUrl,
      });
      toast.success("Shared successfully");
    } catch (error) {
      toast.error("Failed to share");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Progress indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-[#E9B13B] transition-all duration-500"
          style={{ width: `${(steps / 4) * 100}%` }}
        />
      </div>

      {steps === 1 && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold">
              Welcome to{" "}
              <span className="text-[#E9B13B]">
                {shopData.shopName || "your shop"}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Let's get your shop ready to accept orders!
            </p>
            <Button
              onClick={nextStep}
              className="bg-gradient-to-bl from-[#E9B13B] to-[#654808] text-white font-bold shadow-xl transition-all hover:scale-105 duration-500"
              size="lg"
            >
              <span>Get Started</span>
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      )}

      {steps === 2 && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center space-y-8 animate-fade-in w-full max-w-md">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Your Shop Details
            </h2>
            <div className="space-y-4">
              <div className="p-6 bg-card rounded-lg shadow-lg space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-left">
                    Shop Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your shop name"
                    value={shopData.shopName}
                    onChange={(e) =>
                      setShopData({
                        ...shopData,
                        shopName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-left">
                    Shop Slug (URL)
                  </label>
                  <Input
                    type="text"
                    placeholder="shop-url"
                    value={shopData.shopSlug}
                    onChange={(e) =>
                      setShopData({
                        ...shopData,
                        shopSlug: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-left">
                    Your shop will be available at: /orders/
                    {shopData.shopSlug || "your-shop"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={prevStep} variant="outline" size="default">
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!shopData.shopName.trim() || isCreatingShop}
                className="bg-gradient-to-bl from-[#E9B13B] to-[#654808] text-white font-bold shadow-xl transition-all hover:scale-105 duration-500 disabled:opacity-50"
                size="default"
              >
                {isCreatingShop ? "Creating Shop..." : "Continue"}
                {!isCreatingShop && <ArrowRight size={18} className="ml-2" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {steps === 3 && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center space-y-8 max-w-2xl w-full animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Share Your Shop Link
            </h2>
            <p className="text-muted-foreground">
              Share this link with your customers to start receiving orders
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={mainUrl}
                readOnly
                className="flex-1 font-mono text-sm"
                aria-label="Shop URL"
              />
              <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" size="default">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>

                <Button onClick={handleShare} variant="outline" size="default">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={prevStep} variant="outline" size="default">
                Back
              </Button>
              <Button
                onClick={nextStep}
                className="bg-gradient-to-bl from-[#E9B13B] to-[#654808] text-white font-bold shadow-xl transition-all hover:scale-105 duration-500"
                size="default"
              >
                <span>Continue</span>
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {steps === 4 && (
        <div className="flex flex-col gap-5 items-center justify-center min-h-screen px-4">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">
              Your shop is ready!
            </h1>
            <p className="text-lg text-muted-foreground">
              You can now start managing your shop and receiving orders.
            </p>
            <Button
              onClick={nextStep}
              className="bg-gradient-to-bl from-[#E9B13B] to-[#654808] text-white font-bold shadow-xl transition-all hover:scale-105 duration-500"
              size="lg"
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnBoarding;
