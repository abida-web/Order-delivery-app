import { db } from "@/drizzle/db";
import { orders, shops } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = await new URL(req.url);
  const page = Number(searchParams.get("page")) || 1; // Default to 1 if not provided
  const limit = 4;
  const offset = (page - 1) * limit;

  const shop = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session.user.id),
  });

  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  // Get paginated orders
  const allOrders = await db.query.orders.findMany({
    where: eq(orders.shopId, shop.id),
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    limit,
    offset,
  });

  // Get total count of orders
  const totalOrdersResult = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.shopId, shop.id));

  const totalOrders = totalOrdersResult[0]?.count || 0;
  const totalPage = Math.ceil(totalOrders / limit);

  return NextResponse.json(
    {
      orders: allOrders,
      shop: shop,
      page,
      totalPage, // Now this will be correct
    },
    { status: 200 },
  );
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      quantity,
      size,
      color,
      address,
      product,
      status,
      shopSlug,
    } = body;

    // Validate required fields
    if (
      !customerName ||
      !customerPhone ||
      !size ||
      !color ||
      !quantity ||
      !address ||
      !product ||
      !shopSlug
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Find the shop by slug
    const shop = await db.query.shops.findFirst({
      where: eq(shops.shopSlug, shopSlug),
    });

    if (!shop) {
      return NextResponse.json(
        { error: "Shop not found with this slug" },
        { status: 404 },
      );
    }

    // Insert order into database with the shop's UUID
    const newOrder = await db
      .insert(orders)
      .values({
        customerName,
        customerPhone,
        address,
        quantity,
        size,
        color,
        product,
        status: status || "pending",
        shopId: shop.id, // Use the UUID from the found shop
      })
      .returning();

    return NextResponse.json(newOrder[0], { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { status, driverId, orderId, currency, price } = await request.json();

  const shopOwner = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session?.user.id),
  });

  if (!shopOwner) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const updateOrder = await db
    .update(orders)
    .set({ status, updatedAt: new Date(), driverId: driverId, currency, price })
    .where(eq(orders.id, orderId))
    .returning();
  revalidatePath("/dashboard/orders");
  return NextResponse.json(
    { success: true, order: updateOrder[0] },
    { status: 200 },
  );
}
