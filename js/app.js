// js/app.js
import { CONFIG } from '../config.js';

// État global de l'application (AppState)
window.appState = {
    coords: CONFIG.defaultLocation,
    address: CONFIG.defaultLocation.address,
    climateLoaded: false
};

// 1. Gestion des Onglets (Tabs)
window.showTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-emerald-600', 'text-emerald-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    const activeBtn = document.querySelector(`[onclick="showTab('${tabId}')"]`);
    if (activeBtn) activeBtn.classList.add('border-emerald-600', 'text-emerald-600');
};

// 2. Initialisation de la Carte
window.initMap = function() {
    console.log("Initialisation de la carte sur :", CONFIG.defaultLocation.address);
    window.map = L.map('map').setView([CONFIG.defaultLocation.lat, CONFIG.defaultLocation.lng], CONFIG.defaultLocation.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(window.map);

    window.marker = L.marker([CONFIG.defaultLocation.lat, CONFIG.defaultLocation.lng], { draggable: true }).addTo(window.map);
    
    window.marker.on('dragend', function(e) {
        const pos = e.target.getLatLng();
        updateLocation(pos.lat, pos.lng);
    });
};

// 3. Mise à jour de la localisation
async function updateLocation(lat, lng, label = null) {
    window.appState.coords = { lat, lng };
    window.marker.setLatLng([lat, lng]);
    window.map.panTo([lat, lng]);
    
    if (label) {
        document.getElementById('addressSearch').value = label;
        window.appState.address = label;
    }
    console.log("Nouvelle position :", lat, lng);
    // Ici, on pourra ajouter les appels API pour le climat et les risques
}

// 4. Recherche d'adresse (Autocomplete simplifié)
window.initAutocomplete = function() {
    const input = document.getElementById('addressSearch');
    if (!input) return;

    input.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length < 4) return;
        
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=fr`);
            const data = await res.json();
            // Pour simplifier ici, on prend le premier résultat
            if (data && data.length > 0) {
                const first = data[0];
                updateLocation(parseFloat(first.lat), parseFloat(first.lon), first.display_name);
            }
        } catch (err) {
            console.error("Erreur recherche adresse:", err);
        }
    });
};

// Lancement au démarrage
window.startApp = function() {
    window.initMap();
    window.initAutocomplete();
    window.showTab('tab-climat'); // Affiche l'onglet climat par défaut
};

export { updateLocation };
