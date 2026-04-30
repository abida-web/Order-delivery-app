// app/api/user-shop/route.ts
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { shops, user } from "@/drizzle/schema";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fix: Join user with shops table correctly
    const result = await db
      .select({
        shopId: shops.id,
        shopName: shops.name,
        shopSlug: shops.shopSlug,
      })
      .from(shops) // Select from shops, not user
      .where(eq(shops.ownerId, session.user.id)); // Match ownerId with user.id

    if (result.length === 0) {
      return NextResponse.json({
        shopName: null,
        shopSlug: null,
      });
    }

    return NextResponse.json({
      shopId: result[0].shopId,
      shopName: result[0].shopName,
      shopSlug: result[0].shopSlug,
    });
  } catch (error) {
    console.error("Error fetching shop:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
