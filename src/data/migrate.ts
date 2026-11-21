// 1. Run migrations in exact order
import "./migrations/001-create-services-table";
import "./migrations/002-add-services-inventory";
import "./migrations/003-create-sales-table";
import "./migrations/004-add-sales-currency";

// 2. Import the seeds
import { seedServices } from "./seeds/01-seed-services";
import { seedSales } from "./seeds/02-seed-sales";

export async function runMigrationsAndSeeds() {
    console.log("--- Starting Database Initialization ---");

    // 3. Run seeds in order
    seedServices();
    seedSales();

    console.log("--- Database Initialization Complete ---");
}