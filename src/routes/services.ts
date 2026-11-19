import { services } from "../data/services";

export function handleServicesRoute(req, res) {

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(services));
    
}