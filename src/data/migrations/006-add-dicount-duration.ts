import { db } from "../db";

const columns = db.pragma("table_info(services)") as { name: string }[];
const hasDiscountStartDate = columns.some(col => col.name === "discount_start_date");
const hasDiscountEndDate = columns.some(col => col.name === "discount_end_date");

const runMigration006 = db.transaction(() => {
    if (!hasDiscountStartDate) {
        db.exec("ALTER TABLE services ADD COLUMN discount_start_date TEXT NOT NULL DEFAULT '2026-11-23 00:00:00'");
        console.log("Migration 006.1 Add Discount Date 1");
    } else {
        console.log("Skipped Migration 006.1");
    }

    if (!hasDiscountEndDate) {
        db.exec("ALTER TABLE services ADD COLUMN discount_end_date TEXT NOT NULL DEFAULT '2026-11-23 00:00:00'");
        console.log("Migration 006.2 Add Discount Date 2");
    } else {
        console.log("Skipped Migration 006.2");
    }
});

runMigration006();
