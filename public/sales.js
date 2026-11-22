const loadBtn = document.getElementById("loadSalesBtn");
const listDiv = document.getElementById("list");

loadBtn.addEventListener("click", async () => {
    listDiv.innerHTML = "<em>Loading sales...</em>";

    // 1. Fetch data from your backend
    const res = await fetch("/api/sales");
    const sales = await res.json();

    // 2. Clear loading text
    listDiv.innerHTML = "";

    // 3. Render each service into the list container
    for (const s of sales) {
        const item = document.createElement("div");
        item.style.padding = "8px 0";
        item.style.borderBottom = "1px solid #eee";
        item.innerHTML = `${s.id} | ${s.service_id} | ${s.quantity} | ${s.total_price} | ${s.created_at} | ${s.currency}`;
        listDiv.appendChild(item);
    }
});