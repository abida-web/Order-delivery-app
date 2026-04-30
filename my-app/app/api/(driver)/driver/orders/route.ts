import { db } from "@/drizzle/db";
import { drivers, orders } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const driver = await db.query.drivers.findFirst({
      where: eq(drivers.userId, session.user.id),
    });

    const allOrders = await db.query.orders.findMany({
      where: eq(orders.driverId, driver?.id),
      with: {
        shop: {
          with: {
            derivers: true,
          },
        },
      },
      orderBy: desc(orders.updatedAt),
    });

    return NextResponse.json(allOrders);
  } catch (error) {
    console.error("Error fetching driver orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
