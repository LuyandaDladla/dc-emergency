// Simple SA province detection using bounding boxes (approx).
// Not perfect, but great for demo + offline.
const PROVINCES = [
  { name: "Western Cape", minLat: -34.9, maxLat: -30.0, minLng: 16.0, maxLng: 23.0 },
  { name: "Eastern Cape", minLat: -34.5, maxLat: -30.0, minLng: 22.0, maxLng: 30.5 },
  { name: "Northern Cape", minLat: -33.8, maxLat: -24.0, minLng: 16.0, maxLng: 25.5 },
  { name: "Free State", minLat: -30.7, maxLat: -26.0, minLng: 24.0, maxLng: 29.8 },
  { name: "KwaZulu-Natal", minLat: -31.2, maxLat: -26.7, minLng: 28.0, maxLng: 32.9 },
  { name: "North West", minLat: -27.8, maxLat: -24.2, minLng: 22.5, maxLng: 28.3 },
  { name: "Gauteng", minLat: -26.9, maxLat: -25.1, minLng: 27.0, maxLng: 28.6 },
  { name: "Mpumalanga", minLat: -26.9, maxLat: -24.4, minLng: 28.3, maxLng: 32.2 },
  { name: "Limpopo", minLat: -25.9, maxLat: -22.0, minLng: 26.0, maxLng: 32.9 },
];

export function detectProvince(lat, lng) {
  if (typeof lat !== "number" || typeof lng !== "number") return "";
  const hit = PROVINCES.find(
    (p) => lat >= p.minLat && lat <= p.maxLat && lng >= p.minLng && lng <= p.maxLng
  );
  return hit?.name || "";
}
