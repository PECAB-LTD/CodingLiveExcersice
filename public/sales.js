const loadBtn = document.getElementById("loadSalesBtn");
const tbody = document.getElementById("salesTableBody");

loadBtn.addEventListener("click", async () => {
    // 1. Fetch data
    const res = await fetch("/api/sales");
    const sales = await res.json();

    // 2. Clear old rows
    tbody.innerHTML = "";

    // 3. Insert each row cleanly under the column headers
    for (const s of sales) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${s.id}</td>
            <td>${s.service_id}</td>
            <td>${s.service_name}</td>
            <td>${s.service_category}</td>
            <td>${s.quantity}</td>
            <td>${s.currency} ${s.total_price}</td>
            <td><small>${s.created_at}</small></td>
        `;
        tbody.appendChild(row);
    }
});