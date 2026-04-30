"use server";

import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { shops, drivers } from "@/drizzle/schema";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createDriver(formData: FormData) {
  try {
    // Extract data from FormData
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const ownerId = formData.get("ownerId") as string;

    // Validate required fields
    if (!name || !email || !password || !phone || !ownerId) {
      return { error: "All fields are required" };
    }

    // Find the shop owned by the current user
    const shop = await db.query.shops.findFirst({
      where: eq(shops.ownerId, ownerId),
    });

    if (!shop) {
      return { error: "No shop found for this user" };
    }

    // Create user using Better Auth API (server-side)
    const response = await auth.api.createUser({
      body: {
        name,
        email,
        password,
        role: "driver",
        data: {
          phone,
        },
      },
      headers: await headers(),
    });

    if (!response || response.error) {
      return { error: response?.error?.message || "Failed to create driver" };
    }

    const createdUserId = response.user?.id || response.id;

    if (!createdUserId) {
      return { error: "Failed to get created user ID" };
    }

    // Insert into drivers table
    await db.insert(drivers).values({
      userId: createdUserId,
      name: name,
      phone: phone,
      shopId: shop.id,
      createdAt: new Date(),
    });

    revalidatePath("/dashboard/drivers");

    return {
      success: true,
      message: "Driver created successfully",
      driver: {
        id: createdUserId,
        name,
        email,
        phone,
        shopId: shop.id,
      },
    };
  } catch (error) {
    console.error("Error creating driver:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
