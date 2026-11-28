import { json, text } from "node:stream/consumers";
import { db } from "../data/db";

export async function handleLogsRoute(req, res) {

    //unsupported methods block

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

        const newLogs = JSON.parse(body);
        const insertStmt = db.prepare("INSERT INTO logs (date_time, path, method) VALUES (?, ?, ?)");
        const info = insertStmt.run(newLogs.date_time, newLogs.path, newLogs.method);
        newLogs.id = Number(info.lastInsertRowid);



        res.statusCode = 201;
        res.end(JSON.stringify(newLogs));
        console.log(newLogs, "NEW SERVICE ADDED!");
        return;
    }


    if (req.method === "DELETE") {
        const address = new URL(req.url, "http://127.0.0.1:3000");
        const logIdText = address.searchParams.get("id");

        if (logIdText === null) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Please provide a service ID to delete" }));
            return;
        }

        const logId = Number(logIdText);
        const deleteStmt = db.prepare("DELETE FROM logs WHERE id = ?");
        const info = deleteStmt.run(logId);

        if (info.changes === 0) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Logs not found" }));
            return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ message: "Logs deleted successfully", id: logId }));
        return;
    }

    //url parameters for filtering services
    const address = new URL(req.url, "http://127.0.0.1:3000");
    //const budgetText = address.searchParams.get("budget");
    const logMethodText = address.searchParams.get("category");
    //const serviceNameText = address.searchParams.get("name");
    const logIdText = address.searchParams.get("id");

    const logDateText = address.searchParams.get("date")


    // Start with all services and apply filters based on query parameters
    let results = db.prepare("SELECT * FROM logs").all();

    // If a category was typed in the URL (?category=Electronics)
    if (logMethodText !== null) {
        results = results.filter(methodText => methodText.method.toLowerCase() === logMethodText.toLowerCase());

        console.log("METHOD FILTER RAN!");
    };

    // If a service ID was typed in the URL (?id=1)
    if (logIdText !== null) {
        const logId = Number(logIdText);

        const singleLogFindresult = results.find(s => s.id === logId);

        if (singleLogFindresult) {
            res.end(JSON.stringify(singleLogFindresult));
            console.log("LOG ID FIND RAN!");
            return;
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Service not found" }));
            console.log("2. LOG ID NOT FOUND RAN!");
            return;
        };

    };
    // If a budget was typed in the URL (?budget=75)
    if (logDateText !== null) {
        const logDate = logDateText;
        results = results.filter(s => s.date_time.includes(logDate));
        res.end(JSON.stringify(results));
        console.log("DATE FILTER RAN!");
        return;
    }

        //data joined from sales table
    const allLogs = db.prepare(`
    SELECT * FROM logs`).all();
    res.end(JSON.stringify(allLogs));
    return;
};
