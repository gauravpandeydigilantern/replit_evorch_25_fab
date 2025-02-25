import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  persona: text("persona"),
  email: text("email").notNull(),
  name: text("name").notNull(),
  dataSource: text("data_source"),
  dataSourceConfig: jsonb("data_source_config")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  dataSource: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const PersonaType = z.enum(["SALES", "MARKETING", "OPERATIONS"]);
export type Persona = z.infer<typeof PersonaType>;

export const DataSourceType = z.enum(["SALESFORCE", "CSV_UPLOAD", "API", "MANUAL"]);
export type DataSource = z.infer<typeof DataSourceType>;