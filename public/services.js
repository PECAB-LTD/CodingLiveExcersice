const loadBtn = document.getElementById("loadServicesBtn");
const listDiv = document.getElementById("list");

loadBtn.addEventListener("click", async () => {
    listDiv.innerHTML = "<em>Loading services...</em>";

    // 1. Fetch data from your backend
    const res = await fetch("/api/services");
    const services = await res.json();

    // 2. Clear loading text
    listDiv.innerHTML = "";

    // 3. Render each service into the list container
    for (const s of services) {
        const item = document.createElement("div");
        item.style.padding = "8px 0";
        item.style.borderBottom = "1px solid #eee";
        item.innerHTML = `<strong>#${s.id} ${s.name}</strong> - Price: ${s.price} ${s.currency} | Stock: <strong>${s.inventory}</strong>`;
        listDiv.appendChild(item);
    }
});