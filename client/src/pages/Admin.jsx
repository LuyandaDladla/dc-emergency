import React, { useEffect, useMemo, useState } from "react";
import { Shield, Flame, Users, Siren, MessageCircle, Plus, Save, Trash2, MapPin } from "lucide-react";
import { loadHotspots, saveHotspots } from "../data/hotspotsStore";

function cx(...c) { return c.filter(Boolean).join(" "); }

const DEMO_ADMIN_KEY = "dc_admin_demo_unlocked_v1";

function StatCard({ icon, label, value, sub }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">{label}</div>
                <div className="text-white/80">{icon}</div>
            </div>
            <div className="mt-2 text-2xl font-semibold">{value}</div>
            {sub ? <div className="mt-1 text-xs text-white/60">{sub}</div> : null}
        </div>
    );
}

function HotspotRow({ item, onChange, onRemove }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-2">
                <div className="sm:col-span-3">
                    <label className="text-xs text-white/60">Province</label>
                    <input
                        value={item.province}
                        onChange={(e) => onChange({ ...item, province: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
                        placeholder="Gauteng"
                    />
                </div>

                <div className="sm:col-span-4">
                    <label className="text-xs text-white/60">Name</label>
                    <input
                        value={item.name}
                        onChange={(e) => onChange({ ...item, name: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
                        placeholder="Taxi rank / CBD / etc"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="text-xs text-white/60">Risk</label>
                    <select
                        value={item.risk}
                        onChange={(e) => onChange({ ...item, risk: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>

                <div className="sm:col-span-1">
                    <label className="text-xs text-white/60">Lat</label>
                    <input
                        value={String(item.lat)}
                        onChange={(e) => onChange({ ...item, lat: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
                        placeholder="-26.20"
                    />
                </div>

                <div className="sm:col-span-1">
                    <label className="text-xs text-white/60">Lon</label>
                    <input
                        value={String(item.lon)}
                        onChange={(e) => onChange({ ...item, lon: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
                        placeholder="28.04"
                    />
                </div>

                <div className="flex items-end sm:col-span-1">
                    <button
                        type="button"
                        onClick={onRemove}
                        className="w-full rounded-xl border border-white/10 bg-red-500/10 px-3 py-2 text-sm transition hover:bg-red-500/15"
                        title="Remove"
                    >
                        <span className="inline-flex items-center justify-center gap-2">
                            <Trash2 size={16} />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Admin() {
    const [unlocked, setUnlocked] = useState(() => localStorage.getItem(DEMO_ADMIN_KEY) === "1");
    const [code, setCode] = useState("");
    const [hotspots, setHotspots] = useState(() => loadHotspots());
    const [savedAt, setSavedAt] = useState("");

    const province = useMemo(() => localStorage.getItem("dc_province") || "", []);

    const stats = useMemo(() => {
        // Demo stats: you can wire these later from /api/analytics
        const hotspotCount = hotspots.length;
        const myProvinceCount = province ? hotspots.filter(h => h.province === province).length : 0;
        return {
            hotspotCount,
            myProvinceCount,
            users: 1240,
            sos: 86,
            chats: 312
        };
    }, [hotspots, province]);

    useEffect(() => {
        // Keep in sync if you edit hotspots elsewhere
    }, []);

    function unlock() {
        const t = code.trim();
        if (t === "DC-DEMO") {
            localStorage.setItem(DEMO_ADMIN_KEY, "1");
            setUnlocked(true);
            setCode("");
        } else {
            alert("Wrong demo code. Use: DC-DEMO");
        }
    }

    function addHotspot() {
        setHotspots((h) => [
            {
                id: crypto.randomUUID(),
                province: province || "Gauteng",
                name: "New hotspot (demo)",
                lat: -26.2041,
                lon: 28.0473,
                risk: "Medium",
            },
            ...h,
        ]);
    }

    function save() {
        saveHotspots(hotspots);
        setSavedAt(new Date().toLocaleTimeString());
    }

    if (!unlocked) {
        return (
            <div className="pt-6">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="text-2xl font-semibold">Admin (Demo)</div>
                            <div className="mt-1 text-sm text-white/70">
                                Investor/NGO demo panel. Unlock to view hotspots management.
                            </div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80">
                            <span className="inline-flex items-center gap-2">
                                <Shield size={14} /> Restricted
                            </span>
                        </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
                        <div className="text-sm font-semibold">Enter demo code</div>
                        <div className="mt-2 text-xs text-white/60">Use: <span className="font-mono text-white/80">DC-DEMO</span></div>

                        <div className="mt-3 flex gap-2">
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="DC-DEMO"
                                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/10"
                            />
                            <button
                                type="button"
                                onClick={unlock}
                                className="rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold transition hover:bg-white/12"
                            >
                                Unlock
                            </button>
                        </div>

                        <div className="mt-3 text-xs text-white/60">
                            Tomorrow: swap this for real admin claim via <span className="font-mono">user.isAdmin</span> from <span className="font-mono">/api/users/me</span>.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-2xl font-semibold">Admin</div>
                        <div className="mt-1 text-sm text-white/70">
                            Hotspots + monitoring (demo). Province: <span className="text-white/85">{province || "Unknown"}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            localStorage.removeItem(DEMO_ADMIN_KEY);
                            setUnlocked(false);
                        }}
                        className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs hover:bg-black/40 transition"
                    >
                        Lock
                    </button>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                    <StatCard icon={<Flame size={18} />} label="Hotspots" value={stats.hotspotCount} sub={`${stats.myProvinceCount} in your province`} />
                    <StatCard icon={<Users size={18} />} label="Users (demo)" value={stats.users} sub="Last 30 days" />
                    <StatCard icon={<Siren size={18} />} label="SOS sent (demo)" value={stats.sos} sub="This week" />
                    <StatCard icon={<MessageCircle size={18} />} label="Chats (demo)" value={stats.chats} sub="This month" />
                    <StatCard icon={<MapPin size={18} />} label="Location mode" value="ON" sub="GPS-based province" />
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={addHotspot}
                        className="w-full rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold transition hover:bg-white/12 sm:w-auto"
                    >
                        <span className="inline-flex items-center gap-2">
                            <Plus size={16} /> Add hotspot
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={save}
                        className="w-full rounded-xl border border-white/10 bg-emerald-500/10 px-4 py-3 text-sm font-semibold transition hover:bg-emerald-500/15 sm:w-auto"
                    >
                        <span className="inline-flex items-center gap-2">
                            <Save size={16} /> Save (demo publish)
                        </span>
                    </button>

                    <div className="flex items-center text-xs text-white/60 sm:ml-auto">
                        {savedAt ? `Saved at ${savedAt}` : "Not saved yet"}
                    </div>
                </div>

                {/* Editor */}
                <div className="mt-4 space-y-3">
                    {hotspots.map((h) => (
                        <HotspotRow
                            key={h.id}
                            item={h}
                            onChange={(next) => setHotspots((arr) => arr.map((x) => (x.id === h.id ? next : x)))}
                            onRemove={() => setHotspots((arr) => arr.filter((x) => x.id !== h.id))}
                        />
                    ))}
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-xs text-white/60">
                    Next (post-demo): connect Save → <span className="font-mono text-white/70">POST /api/admin/hotspots</span> and load →{" "}
                    <span className="font-mono text-white/70">GET /api/hotspots</span>.
                </div>
            </div>
        </div>
    );
}
