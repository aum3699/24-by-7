import { pgTable, serial, text, timestamp, numeric, integer, pgEnum, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { servicesTable } from "./services";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
]);

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => usersTable.id).notNull(),
  serviceId: integer("service_id").references(() => servicesTable.id).notNull(),
  providerId: integer("provider_id").references(() => usersTable.id).notNull(),
  bookingDate: date("booking_date").notNull(),
  timeSlot: text("time_slot").notNull(),
  location: text("location").notNull(),
  notes: text("notes"),
  status: bookingStatusEnum("status").notNull().default("pending"),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  hasReview: boolean("has_review").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
