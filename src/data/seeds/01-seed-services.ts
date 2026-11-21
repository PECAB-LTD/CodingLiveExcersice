import { db } from "../db";

export function seedServices() {
    const countRow = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };

    if (countRow.count === 0) {
        const insertStmt = db.prepare(`
            INSERT INTO services (name, price, currency, category, inventory) 
            VALUES (?, ?, ?, ?, ?)
        `);

        const initialServices = [
            ["Iphone 18 Pro", 25, "QAR", "Electronics", 150],
            ["Samsung Galaxy S23", 50, "QAR", "Electronics", 150],
            ["Google Pixel 7", 75, "QAR", "Electronics", 150],
            ["Diamond Necklace", 100, "QAR", "Jewelery", 150],
            ["Gold Ring", 125, "QAR", "Jewelery", 150],
            ["Silver Bracelet", 150, "QAR", "Jewelery", 150],
            ["Cotton T-Shirt", 175, "QAR", "Textiles", 150],
            ["Silk Scarf", 200, "QAR", "Textiles", 150],
            ["Wool Sweater", 225, "QAR", "Textiles", 150],
            ["Leather Jacket", 250, "QAR", "Textiles", 150]
        ];

        for (const [name, price, currency, category, inventory] of initialServices) {
            insertStmt.run(name, price, currency, category, inventory);
        }

        console.log("Seed: 10 starter services added!");
    } else {
        console.log("Seed: services already present, skipped.");
    }
}