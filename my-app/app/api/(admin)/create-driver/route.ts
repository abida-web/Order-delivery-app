import { db } from "@/drizzle/db";
import { drivers, shops, user } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shop = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session?.user.id),
  });
  const driver = await db.query.drivers.findFirst({
    where: eq(drivers.shopId, shop?.id),
  });

  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }
  if (!driver) {
    return NextResponse.json({ error: "driver not exist" }, { status: 404 });
  }
  const allDrivers = await db.query.drivers.findMany({
    where: eq(drivers.shopId, shop.id),
    with: {
      shop: true,
    },
  });
  return NextResponse.json(allDrivers);
}
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;

    // Get session
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find shop
    const shop = await db.query.shops.findFirst({
      where: eq(shops.ownerId, session.user.id),
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Check if user already exists
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Create user
    const userId = randomUUID();
    const [newUser] = await db
      .insert(user)
      .values({
        id: userId,
        name,
        email,
        password, // Make sure to hash this password!
        phone,
        role: "driver",
      })
      .returning();

    // Create driver
    const driverId = randomUUID();
    await db.insert(drivers).values({
      id: driverId,
      userId: newUser.id,
      shopId: shop.id,
      name: name,
      phone: phone,
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error creating driver:", error);
    return NextResponse.json(
      { error: "Failed to create driver" },
      { status: 500 },
    );
  }
}
