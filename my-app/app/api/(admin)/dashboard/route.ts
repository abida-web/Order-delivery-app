import { db } from "@/drizzle/db";
import { orders, shops } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 404 });
  }
  const shop = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session.user.id),
  });

  const allOrders = await db.query.orders.findMany({
    where: eq(orders?.shopId, shop?.id),
    with: {
      shop: true,
    },
  });
  return NextResponse.json({
    totalOrders: allOrders,
    pending: allOrders.filter((item) => item.status === "pending"),
    preparing: allOrders.filter((item) => item.status === "preparing"),
    outForDelivery: allOrders.filter(
      (item) => item.status === "out for delivery",
    ),
    delivered: allOrders.filter((item) => item.status === "delivered"),
  });
}
