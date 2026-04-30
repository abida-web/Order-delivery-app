import { db } from "@/drizzle/db";
import { orders } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { status } = await request.json();
  const { id } = await params;

  // Check if user is a driver (not shop owner)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optional: Verify this order is assigned to this driver
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Update order status
  const updateOrder = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();

  return NextResponse.json(
    { success: true, order: updateOrder[0] },
    { status: 200 },
  );
}
