import React, { useMemo, useState } from "react";
import { tryPost } from "../services/api";
import { useLiveLocation } from "../hooks/useLiveLocation";

const QUICK_DIAL = [
    { name: "Police", number: "10111" },
    { name: "Ambulance/Fire", number: "10177" },
    { name: "GBV Command Centre", number: "0800428428" },
    { name: "Emergency (mobile)", number: "112" },
];

export default function SOS() {
    const { status, coords, province } = useLiveLocation();
    const [note, setNote] = useState("");
    const [sending, setSending] = useState(false);
    const [ok, setOk] = useState(false);
    const [err, setErr] = useState("");

    const locationText = useMemo(() => {
        if (!coords) return "";
        return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)} (±${Math.round(coords.accuracy)}m)`;
    }, [coords]);

    async function sendSOS() {
        setSending(true);
        setOk(false);
        setErr("");
        try {
            await tryPost("/sos", {
                note,
                province: province || "",
                coords: coords || null,
                locationText,
            });
            setOk(true);
            setNote("");
        } catch (e) {
            setErr(e?.message || "Failed to send SOS");
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="px-4 pb-24 pt-4">
            <div className="rounded-3xl border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
                <div className="text-lg font-semibold text-white">SOS</div>
                <div className="text-sm text-white/60">
                    {status === "ok" ? `Location ready · ${province || "Province unknown"}` : "Getting live location…"}
                </div>

                <div className="mt-4 flex justify-center">
                    <button
                        onClick={sendSOS}
                        disabled={sending}
                        className="h-40 w-40 rounded-full bg-red-600 text-2xl font-extrabold text-white shadow-2xl shadow-red-500/30 transition active:scale-95"
                    >
                        {sending ? "SENDING…" : "SOS"}
                    </button>
                </div>

                <div className="mt-4 text-xs text-white/60">
                    {coords ? `Coords: ${locationText}` : "Coords: not available yet"}
                </div>

                <div className="mt-4">
                    <label className="text-sm text-white/70">Optional note</label>
                    <textarea
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/60 p-3 text-white outline-none"
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What’s happening? (Optional)"
                    />
                </div>

                {ok && (
                    <div className="mt-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                        SOS sent (demo).
                    </div>
                )}
                {err && (
                    <div className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                        {err}
                    </div>
                )}
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl">
                <div className="font-semibold text-white">Quick dial</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                    {QUICK_DIAL.map((q) => (
                        <a
                            key={q.number}
                            href={`tel:${q.number}`}
                            className="rounded-2xl border border-white/10 bg-white/5 p-3"
                        >
                            <div className="font-semibold text-white">{q.name}</div>
                            <div className="text-sm text-white/60">{q.number}</div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
