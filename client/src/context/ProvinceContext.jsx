import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProvinceContext = createContext(null);

// South Africa province keyword mapping (best-effort)
const PROVINCES = [
    { name: "Eastern Cape", keys: ["eastern cape"] },
    { name: "Free State", keys: ["free state"] },
    { name: "Gauteng", keys: ["gauteng"] },
    { name: "KwaZulu-Natal", keys: ["kwazulu-natal", "kzn", "kwa zulu natal"] },
    { name: "Limpopo", keys: ["limpopo"] },
    { name: "Mpumalanga", keys: ["mpumalanga"] },
    { name: "Northern Cape", keys: ["northern cape"] },
    { name: "North West", keys: ["north west", "northwest"] },
    { name: "Western Cape", keys: ["western cape"] },
];

function matchProvince(text = "") {
    const t = (text || "").toLowerCase();
    for (const p of PROVINCES) {
        if (p.keys.some((k) => t.includes(k))) return p.name;
    }
    return null;
}

// Reverse geocode via Nominatim (no API key needed for demo; we’ll rate-limit)
async function reverseGeocode(lat, lon) {
    const url =
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    const res = await fetch(url, {
        headers: { "Accept": "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    const display = data?.display_name || "";
    const state = data?.address?.state || "";
    return { display, state };
}

export function ProvinceProvider({ children }) {
    const [coords, setCoords] = useState(null);
    const [province, setProvince] = useState(localStorage.getItem("dc_province") || "");
    const [locStatus, setLocStatus] = useState("idle"); // idle | ok | denied | error

    async function detect() {
        setLocStatus("idle");

        if (!navigator.geolocation) {
            setLocStatus("error");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    setCoords({ lat, lon });

                    // cache coords
                    localStorage.setItem("dc_lat", String(lat));
                    localStorage.setItem("dc_lon", String(lon));

                    // reverse geocode (best-effort)
                    const { display, state } = await reverseGeocode(lat, lon);
                    const found = matchProvince(state) || matchProvince(display) || "";
                    if (found) {
                        setProvince(found);
                        localStorage.setItem("dc_province", found);
                    }
                    setLocStatus("ok");
                } catch {
                    setLocStatus("error");
                }
            },
            (err) => {
                // denied, timeout, etc.
                setLocStatus(err?.code === 1 ? "denied" : "error");
            },
            { enableHighAccuracy: true, timeout: 9000, maximumAge: 30000 }
        );
    }

    useEffect(() => {
        // auto-detect once on load
        detect();
      
    }, []);

    const value = useMemo(
        () => ({
            coords,
            province,
            locStatus,
            detectLocation: detect,
        }),
        [coords, province, locStatus]
    );

    return <ProvinceContext.Provider value={value}>{children}</ProvinceContext.Provider>;
}

export function useProvince() {
    const ctx = useContext(ProvinceContext);
    if (!ctx) throw new Error("useProvince must be used inside ProvinceProvider");
    return ctx;
}
