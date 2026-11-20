import { db } from "../data/db";

//List of services from the database

export async function handleServicesRoute(req, res) {

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

        const newService = JSON.parse(body);
        const insertStmt = db.prepare("INSERT INTO services (name, price, category) VALUES (?, ?, ?)");
        const info = insertStmt.run(newService.name, newService.price, newService.category);
        newService.id = Number(info.lastInsertRowid);



        res.statusCode = 201;
        res.end(JSON.stringify(newService));
        console.log(newService, "NEW SERVICE ADDED!");
        return;
    }

    if (req.method === "DELETE") {
        const address = new URL(req.url, "http://127.0.0.1:3000");
        const serviceIdText = address.searchParams.get("id");

        if (serviceIdText === null) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Please provide a service ID to delete" }));
            return;
        }

        const serviceId = Number(serviceIdText);
        const deleteStmt = db.prepare("DELETE FROM services WHERE id = ?");
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

    //url parameters for filtering services
    const address = new URL(req.url, "http://127.0.0.1:3000");
    const budgetText = address.searchParams.get("budget");
    const categoryText = address.searchParams.get("category");
    const serviceNameText = address.searchParams.get("name");
    const serviceIdText = address.searchParams.get("id");


    // Start with all services and apply filters based on query parameters
    let results = db.prepare("SELECT * FROM services").all();

    // If a category was typed in the URL (?category=Electronics)
    if (categoryText !== null) {
        results = results.filter(s => s.category.toLowerCase() === categoryText.toLowerCase());

        console.log("1. CATEGORY FILTER RAN!");
    };

    // If a service ID was typed in the URL (?id=1)
    if (serviceIdText !== null) {
        const serviceId = Number(serviceIdText);

        const singleServiceFindresult = results.find(s => s.id === serviceId);

        if (singleServiceFindresult) {
            res.end(JSON.stringify(singleServiceFindresult));
            console.log("2. SERVICE ID FIND RAN!");
            return;
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Service not found" }));
            console.log("2. SERVICE ID NOT FOUND RAN!");
            return;
        };

    };
    // If a budget was typed in the URL (?budget=75)
    if (budgetText !== null) {
        const budget = Number(budgetText);
        results = results.filter(s => s.price <= budget);

        console.log("3. BUDGET FILTER RAN!");
    }

    // If a service name was typed in the URL (?name=Iphone+18+Pro)
    if (serviceNameText !== null) {
        results = results.filter(s => s.name.toLowerCase().includes(serviceNameText.toLowerCase()));
        console.log("4. SERVICE NAME FILTER RAN!");
    }

    // Otherwise, just show all services
    res.end(JSON.stringify(results));
    return;
}