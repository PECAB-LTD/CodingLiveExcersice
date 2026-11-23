import { db } from "../data/db";

export async function handleUsersRoutes(req, res) {

    if (req.method !== "GET" && req.method !== "POST" && req.method !== "DELETE") {
        res.setHeader("Allow", "GET, POST, DELETE");
        res.statusCode = 405;
        res.setHeader("Content-Type", "text/html");
        res.end("<h1>405 Method Not Allowed</h1>");
        return;
    }

    res.setHeader("Content-Type", "application/json");

    // Handle POST request: Create a new user
    if (req.method === "POST") {
        let body = "";
        for await (const chunk of req) {
            body += chunk;
        }

        const newUser = JSON.parse(body);
        const insertStmt = db.prepare("INSERT INTO 'admin-users' (name, employee_number, position, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)");
        const info = insertStmt.run(newUser.name, newUser.employee_number, newUser.position, newUser.email, newUser.phone, newUser.password);
        newUser.id = Number(info.lastInsertRowid);


        res.statusCode = 201;
        res.end(JSON.stringify(newUser));
        console.log(newUser, "NEW SALE ADDED!");
        return;
    }

    if (req.method === "DELETE") {
        const address = new URL(req.url, "http://127.0.0.1:3000");
        const userIdText = address.searchParams.get("id");

        if (userIdText === null) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Please provide a sales ID to delete" }));
            return;
        }

        const userId = Number(userIdText);
        const deleteStmt = db.prepare("DELETE FROM 'admin-users' WHERE id = ?");
        const info = deleteStmt.run(userId);

        if (info.changes === 0) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Service not found" }));
            return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ message: "User deleted successfully", id: userId }));
        return;
    }

    const userAddress = new URL(req.url, "http://127.0.0.1:3000");
    const salesPathname = userAddress.pathname;
    const userIdText = userAddress.searchParams.get("id");

    if (userIdText !== null) {
        const userId = Number(userIdText);
        const singleUser = db.prepare("SELECT * FROM sales WHERE id = ?").get(userId);

        if (singleUser) {

            res.end(JSON.stringify(singleUser));

            return;
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Sale not found" }));
            return;
        }
    }

    //data joined from services table
    const allUsers = db.prepare(`SELECT * FROM 'admin-users'`).all();
    res.end(JSON.stringify(allUsers));
    return;
};