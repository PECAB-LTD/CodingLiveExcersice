const loadBtn = document.getElementById("loadLogsBtn");
const tbody = document.getElementById("logsTableBody");

loadBtn.addEventListener("click", async () => {
    // 1. Fetch data
    const res = await fetch("/api/logs");
    const logs = await res.json();

    // 2. Clear old rows
    tbody.innerHTML = "";

    // 3. Insert each row cleanly under the column headers
    for (const log of logs) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${log.id}</td>
            <td>${log.date_time}</td>
            <td>${log.name}</td>
            <td>${log.path}</td>
            <td>${log.method}</td>
        `;
        tbody.appendChild(row);
    }
});