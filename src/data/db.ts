import Database from "better-sqlite3";

// 1. Opens or creates the SQLite file on your drive
export const db = new Database("src/data/esolutions.db");

// 2. Creates the services table if it doesn't already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
  )
`);

// 3. If the table is brand new and empty, seed your initial 10 services!
const countRow = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };

if (countRow.count === 0) {
    const insertStmt = db.prepare("INSERT INTO services (name, price, category) VALUES (?, ?, ?)");

    const initialServices = [
        ["Iphone 18 Pro", 25, "Electronics"],
        ["Samsung Galaxy S23", 50, "Electronics"],
        ["Google Pixel 7", 75, "Electronics"],
        ["Diamond Necklace", 100, "Jewelery"],
        ["Gold Ring", 125, "Jewelery"],
        ["Silver Bracelet", 150, "Jewelery"],
        ["Cotton T-Shirt", 175, "Textiles"],
        ["Silk Scarf", 200, "Textiles"],
        ["Wool Sweater", 225, "Textiles"],
        ["Leather Jacket", 250, "Textiles"]
    ];

    for (const [name, price, category] of initialServices) {
        insertStmt.run(name, price, category);
    }

    console.log("Database initialized and seeded with 10 services!");
}