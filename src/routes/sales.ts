import { db } from "../data/db";

export async function handleSalesRoutes(req, res) {
    
    if (req.method !== "GET" && req.method !== "POST" && req.method !== "DELETE") {
        res.setHeader("Allow", "GET, POST, DELETE");
        res.statusCode = 405;
        res.setHeader("Content-Type", "text/html");
        res.end("<h1>405 Method Not Allowed</h1>");
        return;
    }

    res.setHeader("Content-Type", "application/json");

    // Handle POST request: Create a new service
    if (req.method === "POST") {
        let body = "";
        for await (const chunk of req) {
            body += chunk;
        }

        const newSale = JSON.parse(body);
        const insertStmt = db.prepare("INSERT INTO sales (service_id, quantity, total_price) VALUES (?, ?, ?)");
        const info = insertStmt.run(newSale.service_id, newSale.quantity, newSale.total_price);
        newSale.id = Number(info.lastInsertRowid);



        res.statusCode = 201;
        res.end(JSON.stringify(newSale));
        console.log(newSale, "NEW SALE ADDED!");
        return;
    }

    if (req.method === "DELETE") {
        const address = new URL(req.url, "http://127.0.0.1:3000");
        const salesIdText = address.searchParams.get("id");

        if (salesIdText === null) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Please provide a sales ID to delete" }));
            return;
        }

        const serviceId = Number(salesIdText);
        const deleteStmt = db.prepare("DELETE FROM sales WHERE id = ?");
        const info = deleteStmt.run(serviceId);

        if (info.changes === 0) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Service not found" }));
            return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ message: "Service deleted successfully", id: serviceId }));
        return;
    }

    const salesAddress = new URL(req.url, "http://127.0.0.1:3000");
    const salesPathname = salesAddress.pathname;
    const salesIdText = salesAddress.searchParams.get("id");

    if (salesIdText !== null) {
        const salesId = Number(salesIdText);
        const singleSale = db.prepare("SELECT * FROM sales WHERE id = ?").get(salesId);

        if (singleSale) {

            res.end(JSON.stringify(singleSale));

            return;
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Sale not found" }));
            return;
        }
    }
    const allSales = db.prepare("SELECT * FROM sales").all();
    res.end(JSON.stringify(allSales));
    return;
}

