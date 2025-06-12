const apiUrl = 'http://localhost:8080';

document.addEventListener("DOMContentLoaded", () => {
    loadActiveFires();

    document.getElementById("fire-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const lat = document.getElementById("latitude").value;
        const lon = document.getElementById("longitude").value;

        await fetch(`${apiUrl}/fires?latitude=${lat}&longitude=${lon}`, {
            method: "POST"
        });

        alert("Fire reported. Nearby sirens activated.");
        e.target.reset();
        loadActiveFires();
    });
});

async function loadActiveFires() {
    const tbody = document.getElementById("active-fires");
    tbody.innerHTML = "";

    try {
        const res = await fetch(`${apiUrl}/fires?status=active`);
        const fires = await res.json();

        fires.forEach(fire => {
            const tr = document.createElement("tr");
            const timestamp = new Date(fire.timestamp).toLocaleString();

            tr.innerHTML = `
        <td>${fire.id}</td>
        <td>${fire.latitude.toFixed(4)}</td>
        <td>${fire.longitude.toFixed(4)}</td>
        <td>${timestamp}</td>
        <td><span class="badge danger">Active</span></td>
        <td>
          <button class="edit-btn" onclick="closeFire(${fire.id})">Mark as extinguished</button>
        </td>
      `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Failed to load active fires:", error);
    }
}

async function closeFire(id) {
    await fetch(`${apiUrl}/fires/${id}/closure`, { method: "PUT" });
    alert("Fire closed.");
    loadActiveFires();
}
