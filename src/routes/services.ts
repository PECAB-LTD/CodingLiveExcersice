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

    // If a budget was typed in the URL (?budget=75)
    if (budgetText !== null) {
        const budget = Number(budgetText);
        const withinBudget = services.filter(service => service.price <= budget);
        res.end(JSON.stringify(withinBudget));
        return;
    }

    // Otherwise, just show all services
    res.end(JSON.stringify(services));
}