import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const shops = pgTable("shops", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  shopSlug: text("shop_slug").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
});
export const drivers = pgTable("drivers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  userId: text("user_id").references(() => user.id),
  shopId: uuid("shop_id")
    .notNull()
    .references(() => shops.id),
  createdAt: timestamp("created_at").defaultNow(),
});
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  shopId: uuid("shop_id")
    .notNull()
    .references(() => shops.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  address: text("address").notNull(),
  product: text("product").notNull(),
  status: text("status").notNull(),
  price: numeric("price"),
  size: text("size"),
  color: text("color"),
  currency: text("currency"),
  quantity: integer("quantity").notNull(),
  isSeen: boolean("is_seen").default(false),
  driverId: uuid("driver_id").references(() => drivers.id),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
