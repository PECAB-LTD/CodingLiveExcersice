import { db } from "../db";

export async function seedSales() {

    const salesScan = db.prepare("SELECT COUNT(*) as count FROM sales").get() as { count: number };


    if (salesScan.count === 0) {

        const insertStmt = db.prepare(`
        INSERT INTO sales (service_id, quantity, total_price) 
        VALUES (?, ?, ?)
    `);

        const initialSales = [
            [1, 2, 50],
            [2, 1, 50],
            [3, 3, 225],
            [4, 1, 100],
            [5, 2, 250],
            [6, 1, 150],
            [7, 4, 700],
            [8, 2, 400],
            [9, 1, 225],
            [10, 3, 750]
        ];

        for (const [service_id, quantity, total_price] of initialSales) {
            insertStmt.run(service_id, quantity, total_price);
        };

    } else {
        console.log("Seed: sales already present, skipped.");
    }

}