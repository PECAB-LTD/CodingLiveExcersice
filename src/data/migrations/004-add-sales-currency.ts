import { db } from "../db";

const columns = db.pragma("table_info(sales)") as {name: string}[];
const hasCurrency = columns.some(col => col.name === "currency");

if (!hasCurrency) {

    db.exec( "ALTER TABLE sales ADD COLUMN currency TEXT NOT NULL DEFAULT 'QAR'");
    console.log("Migration 004 Completed")
} else {
    console.log("Skipped Migration 004");
}