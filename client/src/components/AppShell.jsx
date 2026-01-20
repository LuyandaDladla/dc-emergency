import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import ProvincePicker from "./ProvincePicker";
import { useProvince } from "../context/ProvinceContext";

export default function AppShell() {
    const { province } = useProvince();
    const [pickerOpen, setPickerOpen] = useState(false);
    const loc = useLocation();
    const nav = useNavigate();

    const hideShell = loc.pathname === "/login" || loc.pathname === "/register";

    if (hideShell) return <Outlet />;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Top bar */}
            <div className="sticky top-0 z-30">
                <div
                    className="mx-auto max-w-[520px] px-4 pt-4"
                    style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}
                >
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                        <div className="font-semibold">DC Emergency</div>
                        <button
                            onClick={() => setPickerOpen(true)}
                            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/90"
                            title="Change province"
                        >
                            {province?.name || "Select province"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Page */}
            <div className="mx-auto max-w-[520px] px-4 pb-28 pt-4">
                <Outlet />
            </div>

            {/* Floating SOS always accessible */}
            <button
                onClick={() => nav("/sos")}
                className="fixed z-50 right-5 bottom-24 w-20 h-20 rounded-full bg-red-500/90 border border-white/15 shadow-[0_0_60px_rgba(239,68,68,.35)] active:scale-[0.98] transition"
                style={{
                    right: "max(20px, env(safe-area-inset-right))",
                    bottom: "max(96px, calc(96px + env(safe-area-inset-bottom)))"
                }}
                aria-label="Open SOS"
            >
                <div className="font-black text-center tracking-wider">SOS</div>
                <div className="-mt-0.5 text-[10px] text-white/90">Emergency</div>
            </button>

            <BottomNav />
            <ProvincePicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
        </div>
    );
}
