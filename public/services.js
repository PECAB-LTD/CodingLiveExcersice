// ─── PAGE ELEMENTS ──────────────────────────────────────────────────────────
// These are the HTML elements on the page we will interact with
const loadServicesButton = document.getElementById("loadServicesBtn");
const servicesTableBody  = document.getElementById("servicesTableBody");

// ─── CART STATE ──────────────────────────────────────────────────────────────
// The basket. Holds the service objects the user has checked.
// Starts empty every time the page loads.
let cart = [];


// ─── FUNCTION: Fetch all services from the backend ──────────────────────────
// Goes to our Node server, asks for /api/services, returns the JSON list.
async function fetchServices() {
    const response = await fetch("/api/services");
    const services = await response.json();
    return services;
}


// ─── FUNCTION: Build one table row for a single service ─────────────────────
// Takes one service object, creates a <tr> with all its data inside <td> cells.
// Returns the finished row element (not yet on the page).
function buildServiceRow(service) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="checkbox" class="cartCheckbox"></td>
        <td>${service.id}</td>
        <td>${service.name}</td>
        <td>${service.price} ${service.currency}</td>
        <td>${service.category}</td>
        <td>${service.inventory}</td>
        <td>${service.last_sale ?? "No sales yet"}</td>
    `;
    return row;
}


// ─── FUNCTION: Wire the checkbox inside a row to the cart ───────────────────
// Finds the checkbox inside the given row and listens for check/uncheck.
// When checked   → adds the service to the cart basket.
// When unchecked → removes the service from the cart basket.
// After every change → recalculates and displays the cart summary.
function wireCheckboxToCart(row, service) {
    const checkbox = row.querySelector(".cartCheckbox");

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            addServiceToCart(service);
        } else {
            removeServiceFromCart(service);
        }
    });
}


// ─── FUNCTION: Add a service to the cart ────────────────────────────────────
// Pushes the service object into the cart array, then refreshes the summary.
function addServiceToCart(service) {
    cart.push(service);
    updateCartSummary();
}


// ─── FUNCTION: Remove a service from the cart ───────────────────────────────
// Rebuilds the cart array excluding the service that was just unchecked.
// Uses .filter() — keeps every item whose id does NOT match the removed one.
function removeServiceFromCart(service) {
    cart = cart.filter(cartItem => cartItem.id !== service.id);
    updateCartSummary();
}


// ─── FUNCTION: Recalculate and paint the cart summary on screen ─────────────
// Counts items and sums prices from whatever is currently in the cart array.
// Then writes those numbers into the Cart Summary table cells.
function updateCartSummary() {
    // Count how many items are in the cart
    const totalItems = cart.length;

    // Add up the price of every item in the cart
    let totalPrice = 0;
    for (const cartItem of cart) {
        totalPrice += cartItem.price;
    }

    // Write the results into the Cart Summary table on the page
    document.getElementById("summaryItemsCount").textContent   = totalItems;
    document.getElementById("summaryItemsPrice").textContent   = totalPrice + " QAR";
    document.getElementById("summaryItemsPayable").textContent = totalPrice + " QAR";
}


// ─── EVENT: "Load Services" button clicked ──────────────────────────────────
// This is the main trigger. When the user clicks the button:
//   1. Fetch all services from the backend
//   2. Clear the table and reset the cart
//   3. For each service: build a row, wire its checkbox, attach it to the page
loadServicesButton.addEventListener("click", async () => {

    // Step 1: Get the data from the server
    const services = await fetchServices();

    // Step 2: Clear any old rows from the table and reset the cart to empty
    servicesTableBody.innerHTML = "";
    cart = [];
    updateCartSummary();

    // Step 3: Loop through every service and add it to the table
    for (const service of services) {

        // Build the visual row
        const row = buildServiceRow(service);

        // Attach the row to the visible table on the page
        servicesTableBody.appendChild(row);

        // Connect this row's checkbox to the cart system
        wireCheckboxToCart(row, service);
    }
});
