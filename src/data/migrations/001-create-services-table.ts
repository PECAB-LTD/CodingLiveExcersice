import { db } from "../db";

db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'QAR',
    category TEXT NOT NULL
  )
`);

console.log("Migration 001: services table ready");