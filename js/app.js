// js/app.js
import { CONFIG } from '../config.js';

// --- VARIABLES GLOBALES DE LA CARTE ---
let map, marker = null, polygonLayer = null, windLayerGroup = null; 
let satelliteLayer, planLayer, cadastreLayer, reliefLayer, risquesLayer, inondationLayer, littoralLayer;

// --- 1. INITIALISATION DE LA CARTE (Ton code restauré) ---
window.initMap = function() {
    if (typeof L === 'undefined') { setTimeout(window.initMap, 300); return; }
    if (map) return; // Évite d'initialiser deux fois

    console.log("Initialisation de la carte sur :", CONFIG.defaultLocation.address);

    // Centrage sur la France via la CONFIG
    map = L.map('map', { zoomControl: false }).setView(
        [CONFIG.defaultLocation.lat, CONFIG.defaultLocation.lng], 
        CONFIG.defaultLocation.zoom
    );
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Couches (Layers)
    satelliteLayer = L.tileLayer(
        'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=HR.ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
        { maxZoom: 19 }
    ).addTo(map);

    planLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 });

    reliefLayer = L.tileLayer(
        'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
        { maxZoom: 19, maxNativeZoom: 13, opacity: 1, className: 'multiply-blend' }
    );

    cadastreLayer = L.tileLayer.wms('https://data.geopf.fr/wms-r/wms', {
        layers: 'CADASTRALPARCELS.PARCELLAIRE_EXPRESS', format: 'image/png', transparent: true
    }).addTo(map);

    risquesLayer    = L.tileLayer.wms('https://mapsref.brgm.fr/wxs/georisques/risques', { layers: 'ALEARG',         format: 'image/png', transparent: true, opacity: 0.6 });
    inondationLayer = L.tileLayer.wms('https://mapsref.brgm.fr/wxs/georisques/risques', { layers: 'inondations_zi', format: 'image/png', transparent: true, opacity: 0.6 });
    littoralLayer   = L.tileLayer.wms('https://mapsref.brgm.fr/wxs/georisques/risques', { layers: 'PPRN',           format: 'image/png', transparent: true, opacity: 0.7 });

    windLayerGroup = L.layerGroup().addTo(map);
    
    // Marqueur initial au centre de la France
    marker = L.marker([CONFIG.defaultLocation.lat, CONFIG.defaultLocation.lng]).addTo(map);
};

// --- 2. CONTRÔLES DE LA CARTE (Ton code restauré pour les boutons HTML) ---
window.changeBasemap = function(type) {
    if (!map) return;
    if (type === 'satellite') { map.hasLayer(planLayer) && map.removeLayer(planLayer); satelliteLayer.addTo(map); }
    else                      { map.hasLayer(satelliteLayer) && map.removeLayer(satelliteLayer); planLayer.addTo(map); }
    window.bringOverlaysToFront();
};

window.toggleLayer = function(name, checked) {
    if (!map) return;
    const layers = { cadastre: cadastreLayer, relief: reliefLayer, risques: risquesLayer, inondation: inondationLayer, littoral: littoralLayer, wind: windLayerGroup };
    const l = layers[name]; if (!l) return;
    checked ? l.addTo(map) : map.removeLayer(l);
    window.bringOverlaysToFront();
};

window.bringOverlaysToFront = function() {
    [reliefLayer, inondationLayer, littoralLayer, risquesLayer, cadastreLayer].forEach(l => {
        if (l && map.hasLayer(l)) l.bringToFront();
    });
    if (polygonLayer && map.hasLayer(polygonLayer)) polygonLayer.bringToFront();
};

// --- 3. GESTION DES ONGLETS (Tabs) ---
window.showTab = function(tabId) {
    // Masque tout
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    // Affiche la cible
    const target = document.getElementById(tabId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }
    // Met à jour les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-target="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');
};

// --- 4. DÉMARRAGE DE L'APP ---
export function startApp() {
    window.initMap();
    
    // Branchement automatique des onglets
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const target = btn.getAttribute('data-target');
        if (target) {
            btn.onclick = () => window.showTab(target);
        }
    });

    console.log("Moteur ÔVIVANT démarré avec succès !");
}
