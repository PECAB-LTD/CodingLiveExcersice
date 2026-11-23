import { db } from "../db";

db.exec(`
    CREATE TABLE IF NOT EXISTS "admin-users" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        employee_number INTEGER NOT NULL,
        position TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log("Migration 007: users table ready");