// client/src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, ChevronDown, ShieldAlert } from "lucide-react";

const PROVINCES = [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "Northern Cape",
    "North West",
    "Western Cape",
];

// Simple SA province bounding-box approximation for DEMO auto-select.
// (Good enough for investor demo; phase 3 can swap to Google reverse geocode.)
const SA_PROVINCE_BBOX = [
    { name: "Western Cape", minLat: -35.2, maxLat: -30.0, minLon: 16.0, maxLon: 22.0 },
    { name: "Northern Cape", minLat: -33.5, maxLat: -26.0, minLon: 16.0, maxLon: 25.0 },
    { name: "Eastern Cape", minLat: -34.6, maxLat: -30.2, minLon: 22.0, maxLon: 30.5 },
    { name: "KwaZulu-Natal", minLat: -31.9, maxLat: -26.7, minLon: 28.0, maxLon: 32.9 },
    { name: "Free State", minLat: -30.8, maxLat: -26.4, minLon: 24.0, maxLon: 30.8 },
    { name: "Gauteng", minLat: -26.9, maxLat: -25.2, minLon: 27.0, maxLon: 28.6 },
    { name: "North West", minLat: -27.9, maxLat: -24.6, minLon: 23.0, maxLon: 28.9 },
    { name: "Mpumalanga", minLat: -27.5, maxLat: -24.4, minLon: 28.2, maxLon: 32.2 },
    { name: "Limpopo", minLat: -24.9, maxLat: -22.0, minLon: 27.2, maxLon: 32.0 },
];

function guessProvince(lat, lon) {
    for (const b of SA_PROVINCE_BBOX) {
        if (lat >= b.minLat && lat <= b.maxLat && lon >= b.minLon && lon <= b.maxLon) return b.name;
    }
    return null;
}

export default function Home() {
    const nav = useNavigate();
    const [province, setProvince] = useState(localStorage.getItem("dc_province") || "Gauteng");
    const [pickerOpen, setPickerOpen] = useState(false);
    const [locStatus, setLocStatus] = useState("idle"); // idle|ok|denied|error
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        localStorage.setItem("dc_province", province);
    }, [province]);

    useEffect(() => {
        // Auto-detect province from location (best effort)
        if (!navigator.geolocation) return;
        setLocStatus("idle");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setCoords({ lat, lon });
                const p = guessProvince(lat, lon);
                if (p) setProvince(p);
                setLocStatus("ok");
            },
            (err) => {
                if (err?.code === 1) setLocStatus("denied");
                else setLocStatus("error");
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
        );
    }, []);

    const locLabel = useMemo(() => {
        if (locStatus === "idle") return "Detecting location…";
        if (locStatus === "ok") return coords ? `Location ready • ${province}` : `Location ready • ${province}`;
        if (locStatus === "denied") return "Location blocked • Choose province manually";
        return "Location error • Choose province manually";
    }, [locStatus, coords, province]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xl font-semibold tracking-tight">DC Emergency</div>
                    <div className="text-xs text-white/60">Safety • Support • Community</div>
                </div>
                <button
                    onClick={() => setPickerOpen((v) => !v)}
                    className="glass px-3 py-2 rounded-2xl flex items-center gap-2"
                >
                    <MapPin size={16} />
                    <span className="text-sm">{province}</span>
                    <ChevronDown size={16} className="opacity-70" />
                </button>
            </div>

            {/* Location status */}
            <div className="glass rounded-3xl p-4">
                <div className="text-sm font-semibold">Province & Location</div>
                <div className="mt-1 text-xs text-white/70">{locLabel}</div>

                {pickerOpen && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {PROVINCES.map((p) => (
                            <button
                                key={p}
                                onClick={() => {
                                    setProvince(p);
                                    setPickerOpen(false);
                                }}
                                className={[
                                    "rounded-2xl px-3 py-2 text-left text-sm transition",
                                    p === province ? "bg-white/12" : "bg-white/6 hover:bg-white/10",
                                ].join(" ")}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* BIG SOS on Home */}
            <div className="glass rounded-3xl p-4">
                <div className="text-sm font-semibold">Main Feature</div>
                <div className="mt-1 text-xs text-white/70">
                    Press SOS to send your live location + alerts to contacts (demo-ready now).
                </div>

                <div className="mt-4 flex items-center justify-center">
                    <button
                        onClick={() => nav("/sos")}
                        className="sos-big active:scale-95 transition"
                        aria-label="Open SOS"
                    >
                        <ShieldAlert size={26} />
                        <div className="text-base font-semibold">SOS</div>
                        <div className="text-[11px] opacity-85">Tap for emergency actions</div>
                    </button>
                </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => (window.location.href = "tel:112")} className="glass rounded-3xl p-4 text-left">
                    <div className="flex items-center gap-2">
                        <Phone size={18} />
                        <div className="font-semibold">Call 112</div>
                    </div>
                    <div className="mt-1 text-xs text-white/70">SA emergency (mobile)</div>
                </button>

                <button onClick={() => nav("/community")} className="glass rounded-3xl p-4 text-left">
                    <div className="font-semibold">Community</div>
                    <div className="mt-1 text-xs text-white/70">Local + national feed</div>
                </button>

                <button onClick={() => nav("/hotspots")} className="glass rounded-3xl p-4 text-left">
                    <div className="font-semibold">Hotspots</div>
                    <div className="mt-1 text-xs text-white/70">Risk zones + alerts</div>
                </button>

                <button onClick={() => nav("/chat")} className="glass rounded-3xl p-4 text-left">
                    <div className="font-semibold">Live Chat</div>
                    <div className="mt-1 text-xs text-white/70">Support agent (demo)</div>
                </button>
            </div>
        </div>
    );
}
