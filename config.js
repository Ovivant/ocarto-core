// config.js
// Ce fichier centralise tous tes réglages personnels
export const CONFIG = {
    version: "0.19",
    appName: "ÔVIVANT Studio Bioclimatique",
    urls: {
        ctaAudit: "https://audit.ovivant.com",
        georisques: "https://errial.georisques.gouv.fr/#/dossier"
    },
defaultLocation: {
        lat: 46.603354, 
        lng: 1.888334,
        address: "France",
        zoom: 6 // On ajoute un niveau de zoom large pour voir toute la France
    },
    apis: {
        openMeteo: "https://archive-api.open-meteo.com/v1/archive",
        ignAlti: "https://data.geopf.fr/altimetrie/1.0/calcul/alti/rest",
        brgmRisques: "https://mapsref.brgm.fr/wxs/georisques/risques"
    }
};
