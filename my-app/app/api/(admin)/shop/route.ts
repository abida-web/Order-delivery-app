import { db } from "@/drizzle/db";
import { shops } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get session
    const session = await auth.api.getSession({ headers: await headers() });

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { shopSlug, name } = await req.json();

    // Validate required fields
    if (!shopSlug || !name) {
      return NextResponse.json(
        { error: "Missing required fields: shopSlug and name are required" },
        { status: 400 },
      );
    }

    // Create shop
    const newShop = await db
      .insert(shops)
      .values({
        shopSlug: shopSlug,
        name: name,
        ownerId: session.user.id, // Now guaranteed to be a string
      })
      .returning();

    return NextResponse.json({ success: true, shop: newShop }, { status: 201 });
  } catch (error) {
    console.error("Error creating shop:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
