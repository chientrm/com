import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const productsTable = sqliteTable("products", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  url: text("url"),
  tags: text("tags"), // comma-separated tags or use a join table for many-to-many
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const appConfigTable = sqliteTable("app_config", {
  id: text("id").primaryKey().default("singleton"), // always "singleton"
  appName: text("app_name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  publicKey: text("public_key"),
});
