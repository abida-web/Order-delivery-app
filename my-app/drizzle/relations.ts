import { relations } from "drizzle-orm";
import { drivers, orders, shops, user } from "./schema";

export const shopsRelations = relations(shops, ({ one, many }) => ({
  owner: one(user, {
    fields: [shops.ownerId],
    references: [user.id],
  }),
  orders: many(orders),
  derivers: many(drivers),
}));
export const driversRelations = relations(drivers, ({ one, many }) => ({
  shop: one(shops, {
    fields: [drivers.shopId],
    references: [shops.id],
  }),

  orders: many(orders),
}));
export const ordersRelations = relations(orders, ({ one }) => ({
  shop: one(shops, {
    fields: [orders.shopId],
    references: [shops.id],
  }),
  deriver: one(drivers, {
    fields: [orders.driverId],
    references: [drivers.id],
  }),
}));
