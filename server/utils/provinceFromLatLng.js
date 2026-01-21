// server/utils/provinceFromLatLng.js
// MVP bounding-box resolver for South Africa provinces.
// This is approximate. Upgrade later with proper reverse geocoding.

const provinces = [
  { name: "Western Cape", minLat: -35.2, maxLat: -30.0, minLng: 16.0, maxLng: 21.0 },
  { name: "Northern Cape", minLat: -32.8, maxLat: -27.0, minLng: 16.0, maxLng: 25.0 },
  { name: "Eastern Cape", minLat: -34.5, maxLat: -30.0, minLng: 22.0, maxLng: 30.5 },
  { name: "Free State", minLat: -30.8, maxLat: -26.0, minLng: 24.0, maxLng: 29.5 },
  { name: "KwaZulu-Natal", minLat: -31.8, maxLat: -26.8, minLng: 28.0, maxLng: 32.9 },
  { name: "North West", minLat: -28.5, maxLat: -24.5, minLng: 22.5, maxLng: 28.5 },
  { name: "Gauteng", minLat: -26.7, maxLat: -25.0, minLng: 27.0, maxLng: 28.7 },
  { name: "Mpumalanga", minLat: -27.6, maxLat: -24.3, minLng: 28.2, maxLng: 32.0 },
  { name: "Limpopo", minLat: -25.5, maxLat: -22.0, minLng: 27.0, maxLng: 32.5 },
];

export function resolveProvince(lat, lng) {
  const la = Number(lat);
  const lo = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return { province: "Unknown", label: "Unknown" };

  const hit = provinces.find(
    (p) => la >= p.minLat && la <= p.maxLat && lo >= p.minLng && lo <= p.maxLng
  );

  return {
    province: hit ? hit.name : "Unknown",
    label: hit ? hit.name : "Unknown",
  };
}
