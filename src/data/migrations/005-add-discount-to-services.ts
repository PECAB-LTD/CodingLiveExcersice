import { db } from "../db";

const columns = db.pragma("table_info(services)") as {name: string}[];
const hasDiscount = columns.some(col => col.name === "discount");

if (!hasDiscount) {

    db.exec( "ALTER TABLE services ADD COLUMN discount INTEGER NOT NULL DEFAULT 0");
    console.log("Migration 005 Add Discount To Sales Completed")
} else {
    console.log("Skipped Migration 005");
}