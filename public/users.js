// ─── PAGE ELEMENTS ──────────────────────────────────────────────────────────
// These are the HTML elements on the page we will interact with
const loadUsersButton = document.getElementById("loadUsersBtn");
const usersTableBody  = document.getElementById("usersTableBody");

// ─── CART STATE ──────────────────────────────────────────────────────────────
// The basket. Holds the service objects the user has checked.
// Starts empty every time the page loads.
let selectedUsers = [];


// ─── FUNCTION: Fetch all services from the backend ──────────────────────────
// Goes to our Node server, asks for /api/services, returns the JSON list.
async function fetchUsers() {
    const response = await fetch("/api/users");
    const users = await response.json();
    return users;
}


// ─── FUNCTION: Build one table row for a single service ─────────────────────
// Takes one service object, creates a <tr> with all its data inside <td> cells.
// Returns the finished row element (not yet on the page).
function buildServiceRow(user) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="checkbox" class="cartCheckbox"></td>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.employee_number}</td>
        <td>${user.position}</td>
        <td>${user.phone}</td>
        <td>${user.email}</td>
        <td>${user.password}</td>
        <td>${user.created_at}</td>
    `;
    return row;
}


// ─── FUNCTION: Wire the checkbox inside a row to the cart ───────────────────
// Finds the checkbox inside the given row and listens for check/uncheck.
// When checked   → adds the service to the cart basket.
// When unchecked → removes the service from the cart basket.
// After every change → recalculates and displays the cart summary.
function wireCheckboxToCart(row, user) {
    const checkbox = row.querySelector(".cartCheckbox");

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            addServiceToCart(user);
        } else {
            removeServiceFromCart(user);
        }
    });
}


// ─── FUNCTION: Add a service to the cart ────────────────────────────────────
// Pushes the service object into the cart array, then refreshes the summary.
function addServiceToCart(user) {
    cart.push(user);
    updateCartSummary();
}


// ─── FUNCTION: Remove a service from the cart ───────────────────────────────
// Rebuilds the cart array excluding the service that was just unchecked.
// Uses .filter() — keeps every item whose id does NOT match the removed one.
function removeServiceFromCart(user) {
    cart = cart.filter(cartItem => cartItem.id !== user.id);
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
};


loadUsersButton.addEventListener("click", async () => {

    // Step 1: Get the data from the server
    const users = await fetchUsers();

    // Step 2: Clear any old rows from the table and reset the cart to empty
    usersTableBody.innerHTML = "";
    cart = [];
    updateCartSummary();

    // Step 3: Loop through every service and add it to the table
    for (const user of users) {

        // Build the visual row
        const row = buildServiceRow(user);

        // Attach the row to the visible table on the page
        usersTableBody.appendChild(row);

        // Connect this row's checkbox to the cart system
        wireCheckboxToCart(row, user);
    }
});
