"use server";

import { db } from "@/drizzle/db";
import { orders, shops } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function markAsSeen(ordersToUpdate) {
  try {
    // Handle both single order and array of orders
    const orderIds = Array.isArray(ordersToUpdate)
      ? ordersToUpdate.map((order) => order.id)
      : [ordersToUpdate.id];

    if (orderIds.length === 0) return { success: true };

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const shop = await db.query.shops.findFirst({
      where: eq(shops.ownerId, session.user.id),
    });

    if (!shop?.id) {
      throw new Error("Shop not found");
    }

    // Update all unseen orders in a single query
    await db
      .update(orders)
      .set({ isSeen: true })
      .where(
        and(
          eq(orders.shopId, shop.id),
          inArray(orders.id, orderIds),
          eq(orders.isSeen, false),
        ),
      );

    revalidatePath("/dashboard/orders");
    return { success: true };
  } catch (error) {
    console.error("Error marking orders as seen:", error);
    return { success: false, error: error.message };
  }
}
// In mark-seen.ts
export async function getUnseenCount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return 0;

  const shop = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session.user.id),
  });

  if (!shop?.id) return 0;

  const unseenOrders = await db.query.orders.findMany({
    where: and(eq(orders.shopId, shop.id), eq(orders.isSeen, false)),
  });

  return unseenOrders.length;
}
