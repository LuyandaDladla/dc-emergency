// Demo hotspots dataset (investor demo). Later: pull from backend + admin-managed.
export const HOTSPOTS = [
  // Gauteng
  { id: "g1", province: "Gauteng", name: "CBD Hotspot (Demo)", lat: -26.2041, lon: 28.0473, risk: "High" },
  { id: "g2", province: "Gauteng", name: "Transport Hub (Demo)", lat: -26.1952, lon: 28.0341, risk: "Medium" },

  // Western Cape
  { id: "wc1", province: "Western Cape", name: "City Centre (Demo)", lat: -33.9249, lon: 18.4241, risk: "High" },

  // KwaZulu-Natal
  { id: "k1", province: "KwaZulu-Natal", name: "CBD Zone (Demo)", lat: -29.8587, lon: 31.0218, risk: "High" },

  // Default fallback hotspots (national)
  { id: "n1", province: "National", name: "National Demo Hotspot", lat: -28.4793, lon: 24.6727, risk: "Medium" },
];
