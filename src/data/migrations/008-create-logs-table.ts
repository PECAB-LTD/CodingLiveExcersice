import { db } from "../db";

db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_time TEXT NOT NULL,
    path TEXT NOT NULL,
    method TEXT NOT NULL
  )
`);

console.log("Migration 008: logs table ready");