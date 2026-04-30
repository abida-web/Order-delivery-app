import { db } from "@/drizzle/db";
import { orders } from "@/drizzle/schema";
import { desc, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = await new URL(req.url);
  const query = await searchParams.get("q");
  const result = await db.query.orders.findMany({
    where: query
      ? or(
          ilike(orders.customerName, `%${query}%`),
          ilike(orders.customerPhone, `%${query}%`),
          ilike(orders.product, `%${query}%`),
        )
      : undefined,
    orderBy: desc(orders.createdAt),
    limit: 10,
  });
  return NextResponse.json(result);
}
