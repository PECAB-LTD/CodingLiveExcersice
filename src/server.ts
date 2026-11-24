import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { runMigrationsAndSeeds } from "./data/migrate";

import { handleServicesRoute } from "./routes/services";
import { handleSalesRoutes } from "./routes/sales";
import { handleUsersRoutes } from "./routes/users";
import { handleLogsRoute } from "./routes/logs";
import { time, timeStamp } from "node:console";
import path from "node:path/win32";

runMigrationsAndSeeds()



const defineTimeStamp = `[${new Date().toLocaleString()}]`;

const server = createServer((req, res) => {

    const address = new URL(req.url, "http://127.0.0.1:3000");
    const pathname = address.pathname;

    const defineTimeStamp = `[${new Date().toLocaleString()}]`;

    const serverLogs = defineTimeStamp + " " + "request received for path: " + address.pathname + " " + req.method + " " + address.searchParams.toString();
    
    console.log(serverLogs);

    // Serve HTML Dashboard
    if (pathname === "/" || pathname === "/home") {
        const home = readFileSync("public/index.html", "utf-8");
        res.setHeader("Content-Type", "text/html");
        res.end(home);
        return;
    }

    // Serve CSS Styling
    if (pathname === "/index.css") {
        const css = readFileSync("public/index.css", "utf-8");
        res.setHeader("Content-Type", "text/css");
        res.end(css);
        return;
    }

    // HTML Page: Services
    if (pathname === "/services") {
        const services = readFileSync("public/services.html", "utf-8");
        res.setHeader("Content-Type", "text/html");
        res.end(services);
        return;
    }

    // JSON API: Services
    if (pathname === "/api/services") {
        handleServicesRoute(req, res);
        return;
    }

    // Serve Services JavaScript
    if (pathname === "/services.js") {
        const js = readFileSync("public/services.js", "utf-8");
        res.setHeader("Content-Type", "application/javascript");
        res.end(js);
        return;
    }

    // HTML Page: Sales
    if (pathname === "/sales") {
        const sales = readFileSync("public/sales.html", "utf-8");
        res.setHeader("Content-Type", "text/html");
        res.end(sales);
        return;
    }



    // JSON API: Sales
    if (pathname === "/api/sales") {
        handleSalesRoutes(req, res);
        return;
    }


    // Serve Sales JavaScript
    if (pathname === "/sales.js") {
        const js = readFileSync("public/sales.js", "utf-8");
        res.setHeader("Content-Type", "application/javascript");
        res.end(js);
        return;
    }

    if (pathname === "/users") {
        const users = readFileSync("public/users.html", "utf-8");
        res.setHeader("Content-Type", "text/html");
        res.end(users);
        return;

    }

    if (pathname === "/api/users") {
        handleUsersRoutes(req, res);
        return;
    }

    if (pathname === "/users.js") {
        const js = readFileSync("public/users.js", "utf-8");
        res.setHeader("Content-Type", "application/javascript");
        res.end(js);
        return;
    }

    if (pathname === "/logs") {
        const users = readFileSync("public/logs.html", "utf-8");
        res.setHeader("Content-Type", "text/html");
        res.end(users);
        return;

    }

    if (pathname === "/api/logs") {
        handleUsersRoutes(req, res);
        return;
    }

    if (pathname === "/logs.js") {
        const js = readFileSync("public/logs.js", "utf-8");
        res.setHeader("Content-Type", "application/javascript");
        res.end(js);
        return;
    }

    else {
        res.setHeader("Content-Type", "text/html");
        const notFound = readFileSync("public/404.html", "utf-8")
        res.statusCode = 404;
        res.end(notFound);

        return;
    }

 serverLogs
});
server.listen(3000, "127.0.0.1", () => {
    console.log(defineTimeStamp,"E-Solutions API is running! on http://localhost:3000");
});