import { services } from "../data/services";

export function handleServicesRoute(req, res) {

    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        res.statusCode = 405;
        res.setHeader("Content-Type", "text/html");
        res.end("<h1>405 Method Not Allowed</h1>");
        return;
    }

    res.setHeader("Content-Type", "application/json");

    const address = new URL(req.url, "http://127.0.0.1:3000");
    const budgetText = address.searchParams.get("budget");
    const categoryText = address.searchParams.get("category");
    const serviceNameText = address.searchParams.get("name");
    const serviceIdText = address.searchParams.get("id");

    let results = services;

    // If a category was typed in the URL (?category=Electronics)
    if (categoryText !== null) {
        results = results.filter(service => service.category.toLowerCase() === categoryText.toLowerCase());

        console.log("1. CATEGORY FILTER RAN!");
    };

    // If a service ID was typed in the URL (?id=1)
    if (serviceIdText !== null) {
        const serviceId = Number(serviceIdText);

        const singleServiceFindresult = results.find(service => service.id === serviceId);

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
        results = results.filter(service => service.price <= budget);

        console.log("3. BUDGET FILTER RAN!");
    }

    // If a service name was typed in the URL (?name=Iphone+18+Pro)
    if (serviceNameText !== null) {
        results = results.filter(service => service.name.toLowerCase().includes(serviceNameText.toLowerCase()));
        console.log("4. SERVICE NAME FILTER RAN!");
    }

    // Otherwise, just show all services
    res.end(JSON.stringify(results));
    return;
}