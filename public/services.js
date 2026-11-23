const loadBtn = document.getElementById("loadServicesBtn");
const tbody = document.getElementById("salesTableBody");

loadBtn.addEventListener("click", async () => {

    
    // 1. Fetch data from your backend
    const res = await fetch("/api/services");
    const services = await res.json();

    // 2. Clear loading text
    tbody.innerHTML = "";

    // 3. Render each service into the list container
        for (const s of services) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.price} ${s.currency}</td>
            <td>${s.category}</td>
            <td>${s.inventory}</td>
            <td>${s.last_sale}</td>
        `;
        tbody.appendChild(row);
    }
});