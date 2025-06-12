const apiUrl = 'http://localhost:8080';

document.addEventListener("DOMContentLoaded", () => {
    loadSirens();

    document.getElementById("create-siren-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const newSiren = {
            name: document.getElementById("siren-name").value,
            latitude: parseFloat(document.getElementById("siren-lat").value),
            longitude: parseFloat(document.getElementById("siren-lon").value),
            status: "SAFE",
            disabled: document.getElementById("siren-disabled").value === "true"
        };

        await fetch(`${apiUrl}/sirens`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSiren)
        });

        e.target.reset();
        loadSirens();
    });

    document.querySelector(".close-button").addEventListener("click", () => {
        document.getElementById("editModal").style.display = "none";
    });

    document.getElementById("edit-siren-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const siren = {
            id: parseInt(document.getElementById("edit-id").value),
            name: document.getElementById("edit-name").value,
            latitude: parseFloat(document.getElementById("edit-latitude").value),
            longitude: parseFloat(document.getElementById("edit-longitude").value),
            status: document.getElementById("edit-status").value,
            disabled: document.getElementById("edit-disabled").value === "true"
        };

        await fetch(`${apiUrl}/sirens/${siren.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(siren)
        });

        document.getElementById("editModal").style.display = "none";
        loadSirens();
    });
});

async function loadSirens() {
    const list = document.getElementById("sirens-list");
    list.innerHTML = "";

    const res = await fetch(`${apiUrl}/sirens`);
    const sirens = await res.json();

    sirens.forEach(siren => {
        const tr = document.createElement("tr");
        tr.dataset.siren = JSON.stringify(siren); // Store full siren object in dataset

        tr.innerHTML = `
      <td>${siren.id}</td>
      <td>${siren.name}</td>
      <td>${siren.latitude.toFixed(4)}</td>
      <td>${siren.longitude.toFixed(4)}</td>
      <td><span class="badge ${siren.status.toLowerCase()}">${siren.status}</span></td>
      <td>${siren.disabled ? "Yes" : "No"}</td>
      <td>
        <button class="edit-btn" onclick="openEditModal(this)">Edit</button>
        <button class="delete-btn" onclick="deleteSiren(${siren.id})">Delete</button>
      </td>
    `;

        list.appendChild(tr);
    });
}

async function deleteSiren(id) {
    await fetch(`${apiUrl}/sirens/${id}`, { method: "DELETE" });
    loadSirens();
}

function openEditModal(button) {
    const siren = JSON.parse(button.closest("tr").dataset.siren);

    document.getElementById("edit-id").value = siren.id;
    document.getElementById("edit-name").value = siren.name;
    document.getElementById("edit-latitude").value = siren.latitude;
    document.getElementById("edit-longitude").value = siren.longitude;
    document.getElementById("edit-status").value = siren.status;
    document.getElementById("edit-disabled").value = siren.disabled.toString();

    document.getElementById("editModal").style.display = "flex";
}


