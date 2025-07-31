import { timestamp } from "drizzle-orm/pg-core";
export * from "./auth-schema";

const timestamps = {
   createdAt: timestamp("created_at").defaultNow(),
   updatedAt: timestamp("updated_at").defaultNow(),
};


