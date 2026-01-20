import React from "react";
import { useNavigate } from "react-router-dom";
import { useProvince } from "../context/ProvinceContext";

export default function Home() {
    const nav = useNavigate();
    const { province, locStatus } = useProvince();

    return (
        <div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                <div className="text-xs text-white/70">
                    Province: <span className="text-white">{province?.name}</span>{" "}
                    <span className="text-white/50">({locStatus === "ok" ? "auto" : "manual"})</span>
                </div>

                <div className="mt-2 text-2xl font-semibold leading-tight">
                    Emergency + Wellness
                    <div className="mt-1 text-sm text-white/70">
                        Demo build for NGOs & investors.
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                        onClick={() => nav("/sos")}
                        className="rounded-2xl bg-red-500/90 border border-white/15 py-3 font-semibold"
                    >
                        SOS
                        <div className="font-normal text-[11px] text-white/90">Send alert</div>
                    </button>

                    <button
                        onClick={() => nav("/community")}
                        className="rounded-2xl bg-white/10 border border-white/10 py-3 font-semibold"
                    >
                        Community
                        <div className="font-normal text-[11px] text-white/70">Chat + feed</div>
                    </button>

                    <button
                        onClick={() => nav("/hotspots")}
                        className="rounded-2xl bg-white/10 border border-white/10 py-3 font-semibold"
                    >
                        Hotspots
                        <div className="font-normal text-[11px] text-white/70">Nearby risk</div>
                    </button>

                    <button
                        onClick={() => nav("/risk")}
                        className="rounded-2xl bg-white/10 border border-white/10 py-3 font-semibold"
                    >
                        Risk Check
                        <div className="font-normal text-[11px] text-white/70">Quick assessment</div>
                    </button>
                </div>
            </div>

            {/* Speed Dial */}
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                <div className="font-semibold">Speed dial</div>
                <div className="mt-1 text-sm text-white/70">Instant access to authorities.</div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                    <a className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3" href="tel:10111">
                        Police (10111)
                        <div className="mt-1 text-xs text-white/60">South Africa</div>
                    </a>
                    <a className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3" href="tel:10177">
                        Ambulance (10177)
                        <div className="mt-1 text-xs text-white/60">South Africa</div>
                    </a>
                    <a className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3" href="tel:112">
                        Emergency (112)
                        <div className="mt-1 text-xs text-white/60">Mobile</div>
                    </a>
                </div>
            </div>

            {/* Demo CTA */}
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                <div className="font-semibold">Demo highlights</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
                    <li>Location-based province feed (auto detect)</li>
                    <li>Live chat demo & NGO support chat CTA</li>
                    <li>Hotspots warning list (demo dataset)</li>
                    <li>Admin demo panel for triage + analytics</li>
                </ul>

                <button
                    onClick={() => nav("/admin")}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 py-3 font-semibold"
                >
                    Open Admin Demo
                </button>
            </div>
        </div>
    );
}
