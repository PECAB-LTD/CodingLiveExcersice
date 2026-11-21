import { db } from "../db";

// 1. Inspect table columns
const columns = db.pragma("table_info(services)") as { name: string }[];
const hasInventory = columns.some(col => col.name === "inventory");

// 2. Add column only if missing
if (!hasInventory) {
    db.exec("ALTER TABLE services ADD COLUMN inventory INTEGER NOT NULL DEFAULT 150");
    console.log("Migration 002: added inventory column");
} else {
    console.log("Migration 002: inventory column already exists, skipped");
}