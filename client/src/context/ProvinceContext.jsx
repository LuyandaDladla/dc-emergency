import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProvinceContext = createContext(null);

const PROVINCES = [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "North West",
    "Northern Cape",
    "Western Cape",
];

// Best-effort SA province guess by lat/lon (approx boxes; good enough for demo)
function guessProvince(lat, lon) {
    // Western Cape
    if (lat < -31.0 && lon > 17.0 && lon < 22.5) return "Western Cape";
    // Eastern Cape
    if (lat < -30.0 && lon >= 22.5 && lon < 30.5) return "Eastern Cape";
    // KZN
    if (lat < -27.0 && lat > -31.2 && lon >= 28.0 && lon < 33.2) return "KwaZulu-Natal";
    // Gauteng
    if (lat < -25.0 && lat > -27.5 && lon >= 27.0 && lon < 29.5) return "Gauteng";
    // Limpopo
    if (lat >= -25.0 && lon >= 27.0 && lon < 32.0) return "Limpopo";
    // Mpumalanga
    if (lat < -25.0 && lat >= -27.5 && lon >= 29.0 && lon < 32.8) return "Mpumalanga";
    // North West
    if (lat < -25.0 && lat > -28.8 && lon >= 23.0 && lon < 27.5) return "North West";
    // Free State
    if (lat <= -27.0 && lat > -30.8 && lon >= 24.0 && lon < 29.5) return "Free State";
    // Northern Cape fallback
    return "Northern Cape";
}

export function ProvinceProvider({ children }) {
    const [province, setProvince] = useState(() => localStorage.getItem("province") || "KwaZulu-Natal");
    const [pickerOpen, setPickerOpen] = useState(false);
    const [locStatus, setLocStatus] = useState("idle"); // idle | ok | denied | error
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        localStorage.setItem("province", province);
    }, [province]);

    useEffect(() => {
        // Auto detect on load (best effort)
        if (!navigator.geolocation) {
            setLocStatus("error");
            return;
        }
        setLocStatus("idle");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setCoords({ latitude, longitude });
                const p = guessProvince(latitude, longitude);
                setProvince(p);
                setLocStatus("ok");
            },
            (err) => {
                if (err?.code === 1) setLocStatus("denied");
                else setLocStatus("error");
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
        );
    }, []);

    const value = useMemo(
        () => ({
            province,
            provinceLabel: province,
            setProvince,
            pickerOpen,
            openPicker: () => setPickerOpen(true),
            closePicker: () => setPickerOpen(false),
            locStatus,
            coords,
            provinces: PROVINCES,
        }),
        [province, pickerOpen, locStatus, coords]
    );

    return (
        <ProvinceContext.Provider value={value}>
            {children}

            {/* Picker modal */}
            {pickerOpen && (
                <div className="z-[60] fixed inset-0 flex items-end justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70"
                        onClick={() => setPickerOpen(false)}
                    />
                    <div className="glass relative w-full max-w-md rounded-3xl p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="font-semibold">Select Province</div>
                            <button className="btn px-3 py-2 text-xs" onClick={() => setPickerOpen(false)}>
                                Close
                            </button>
                        </div>

                        <div className="mb-3 text-xs text-white/70">
                            Auto-detect: {locStatus === "ok" ? "On" : locStatus === "denied" ? "Blocked" : locStatus}
                        </div>

                        <div className="max-h-[55vh] overflow-auto rounded-2xl border border-white/10">
                            {PROVINCES.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => {
                                        setProvince(p);
                                        setPickerOpen(false);
                                    }}
                                    className={[
                                        "w-full text-left px-4 py-3 text-sm",
                                        "border-b border-white/5 last:border-b-0",
                                        p === province ? "bg-white/10 text-white" : "text-white/85 hover:bg-white/5",
                                    ].join(" ")}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </ProvinceContext.Provider>
    );
}

export function useProvince() {
    const ctx = useContext(ProvinceContext);
    if (!ctx) throw new Error("useProvince must be used inside ProvinceProvider");
    return ctx;
}
