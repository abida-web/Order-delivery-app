import { db } from "@/drizzle/db";
import { orders, shops } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        shop: {
          with: {
            owner: true,
          },
        },
        deriver: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { status } = await request.json();
  const { id } = await params;

  const shopOwner = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session?.user.id),
  });

  if (!shopOwner) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const updateOrder = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();

  revalidatePath("/dashboard/orders");

  return NextResponse.json(
    { success: true, order: updateOrder[0] },
    { status: 200 },
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { id } = await params;

  const shopOwner = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session?.user.id),
  });

  if (!shopOwner) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const removeOrder = await db.delete(orders).where(eq(orders.id, id));

  return NextResponse.json({ success: true }, { status: 201 });
}
