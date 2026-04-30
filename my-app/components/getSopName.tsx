// app/actions/shop-actions.ts
"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Your auth setup
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";

export async function getShopName() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return { error: "Not authenticated", shopName: null };
  }

  const result = await db
    .select({ shopName: user.shopName })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  return { shopName: result[0]?.shopName || null };
}
