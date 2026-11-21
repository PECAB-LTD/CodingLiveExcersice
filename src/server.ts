import { createServer } from "node:http";
import { runMigrationsAndSeeds } from "./data/migrate";

import { handleServicesRoute } from "./routes/services";
import { handleSalesRoutes } from "./routes/sales";

runMigrationsAndSeeds()

const server = createServer((req, res) => {

    const address = new URL(req.url, "http://127.0.0.1:3000");
    const pathname = address.pathname;
    console.log("Request received for path: " + address.pathname, " " + req.method, " " + address.searchParams.toString());
    if (pathname === "/" || pathname === "/home") {

        res.end("Welcome to E-Solutions API");

        return;
    }

    if (pathname === "/services") {
        handleServicesRoute(req, res);

        return;
    }

    if (pathname === "/sales") {
        handleSalesRoutes(req, res);
        return;
    }
    
    else {
        res.setHeader("Content-Type", "text/html");
        res.statusCode = 404;
        res.end("<h1>404 Not Found</h1>");

        return;
    }


});
server.listen(3000, "127.0.0.1", () => {
    console.log("E-Solutions API is running! on http://localhost:3000");
});