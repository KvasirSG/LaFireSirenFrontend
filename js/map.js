const apiUrl = 'http://localhost:8080'; // Update if needed for production

// Initialize Leaflet map centered on Los Angeles
const map = L.map('map').setView([34.05, -118.25], 11);

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load sirens and fires after page loads
document.addEventListener("DOMContentLoaded", () => {
    loadSirens();
    loadFires();
});

// Load and display sirens from backend
async function loadSirens() {
    try {
        const res = await fetch(`${apiUrl}/sirens`);
        const sirens = await res.json();

        sirens.forEach(siren => {
            let color;
            if (siren.disabled) {
                color = 'yellow'; // 🟨 Disabled sirens
            } else if (siren.status === "DANGER") {
                color = 'red'; // 🟥 Danger status
            } else {
                color = 'green'; // 🟩 Safe status
            }

            const marker = L.circleMarker([siren.latitude, siren.longitude], {
                radius: 8,
                color: color,
                fillColor: color,
                fillOpacity: 0.8
            }).addTo(map);

            marker.bindPopup(`
        <strong>${siren.name}</strong><br>
        Status: ${siren.status}<br>
        Disabled: ${siren.disabled ? "Yes" : "No"}
      `);
        });
    } catch (error) {
        console.error("Error loading sirens:", error);
    }
}

// Load and display active fires from backend
async function loadFires() {
    try {
        const res = await fetch(`${apiUrl}/fires?status=active`);
        const fires = await res.json();

        fires.forEach(fire => {
            const fireIcon = L.divIcon({
                html: "🔥",
                className: "",
                iconSize: [24, 24]
            });

            const marker = L.marker([fire.latitude, fire.longitude], { icon: fireIcon }).addTo(map);
            marker.bindPopup("🔥 Active Fire");

            // 🔵 Add 10km alert radius around fire
            const alertCircle = L.circle([fire.latitude, fire.longitude], {
                radius: 10000, // 10,000 meters = 10km
                color: 'orange',
                fillColor: 'orange',
                fillOpacity: 0.15,
                weight: 1,
                dashArray: '5, 5'
            }).addTo(map);
        });
    } catch (error) {
        console.error("Error loading fires:", error);
    }
}
