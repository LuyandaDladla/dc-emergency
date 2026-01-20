// Rough bounding boxes for demo (not legally precise)
export const PROVINCES = [
    { key: "EC", name: "Eastern Cape", bbox: { minLat: -34.5, maxLat: -30.0, minLng: 22.0, maxLng: 30.5 } },
    { key: "FS", name: "Free State", bbox: { minLat: -30.9, maxLat: -27.0, minLng: 24.0, maxLng: 29.5 } },
    { key: "GP", name: "Gauteng", bbox: { minLat: -26.9, maxLat: -25.2, minLng: 27.0, maxLng: 28.9 } },
    { key: "KZN", name: "KwaZulu-Natal", bbox: { minLat: -31.2, maxLat: -26.6, minLng: 28.0, maxLng: 32.9 } },
    { key: "LP", name: "Limpopo", bbox: { minLat: -25.2, maxLat: -22.0, minLng: 26.5, maxLng: 32.0 } },
    { key: "MP", name: "Mpumalanga", bbox: { minLat: -27.2, maxLat: -24.4, minLng: 28.3, maxLng: 32.0 } },
    { key: "NC", name: "Northern Cape", bbox: { minLat: -33.2, maxLat: -26.5, minLng: 16.2, maxLng: 25.5 } },
    { key: "NW", name: "North West", bbox: { minLat: -28.6, maxLat: -24.8, minLng: 22.8, maxLng: 28.2 } },
    { key: "WC", name: "Western Cape", bbox: { minLat: -34.9, maxLat: -31.0, minLng: 17.6, maxLng: 23.2 } }
];

export function findProvinceByLatLng(lat, lng) {
    if (typeof lat !== "number" || typeof lng !== "number") return null;

    // First: bbox match
    for (const p of PROVINCES) {
        const b = p.bbox;
        if (lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng) return p;
    }

    // Fallback: nearest center
    const withCenters = PROVINCES.map((p) => {
        const b = p.bbox;
        const cLat = (b.minLat + b.maxLat) / 2;
        const cLng = (b.minLng + b.maxLng) / 2;
        const d = (lat - cLat) ** 2 + (lng - cLng) ** 2;
        return { p, d };
    }).sort((a, b) => a.d - b.d);

    return withCenters[0]?.p || null;
}
