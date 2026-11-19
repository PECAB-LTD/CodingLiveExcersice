import { createServer } from "node:http";

import { handleServicesRoute } from "./routes/services";

const server = createServer((req, res) => {
    let pathName = req.url;
    console.log("Request received for path: " + pathName + req.method);
    if (pathName === "/") {

    }

    if (pathName === "/services") {
        handleServicesRoute(req, res);
    }

    else {
        res.setHeader("Content-Type", "text/html");
        res.end("<h1>404 Not Found</h1>");
    }

});
server.listen(3000, "127.0.0.1", () => {
    console.log("E-Solutions API is running! on http://localhost:3000");
});