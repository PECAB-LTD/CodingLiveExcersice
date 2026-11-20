import Database from "better-sqlite3";

// 1. Opens or creates the SQLite file on your drive
export const db = new Database("src/data/esolutions.db");

// 2. Creates the services table if it doesn't already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'QAR',
    category TEXT NOT NULL
  )
`);

// Migration: add currency column if it doesn't exist yet
const columns = db.pragma("table_info(services)") as { name: string }[];
const hasInventory = columns.some(col => col.name === "inventory");

if (!hasInventory) {
    db.exec("ALTER TABLE services ADD COLUMN inventory INTEGER NOT NULL DEFAULT 150");
    console.log("Migration ran: added inventory column");
}

// 3. If the table is brand new and empty, seed your initial 10 services!
const countRow = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };

if (countRow.count === 0) {
    const insertStmt = db.prepare("INSERT INTO services (name, price, currency, category) VALUES (?, ?, ?, ?)");

    const initialServices = [
        ["Iphone 18 Pro", 25, "QAR", "Electronics"],
        ["Samsung Galaxy S23", 50, "QAR", "Electronics"],
        ["Google Pixel 7", 75, "QAR", "Electronics"],
        ["Diamond Necklace", 100, "QAR", "Jewelery"],
        ["Gold Ring", 125, "QAR", "Jewelery"],
        ["Silver Bracelet", 150, "QAR", "Jewelery"],
        ["Cotton T-Shirt", 175, "QAR", "Textiles"],
        ["Silk Scarf", 200, "QAR", "Textiles"],
        ["Wool Sweater", 225, "QAR", "Textiles"],
        ["Leather Jacket", 250, "QAR", "Textiles"]
    ];

    for (const [name, price, currency, category] of initialServices) {
        insertStmt.run(name, price, currency, category);
    }

    console.log("Database initialized and seeded with 10 services!");
}