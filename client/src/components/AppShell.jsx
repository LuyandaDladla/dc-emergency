// client/src/components/AppShell.jsx
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import { ShieldAlert } from "lucide-react";

export default function AppShell() {
    const nav = useNavigate();
    const loc = useLocation();
    const hideNav = ["/login", "/register"].includes(loc.pathname);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* subtle background */}
            <div className="bg-[radial-gradient(1200px_700px_at_50%_-10%,rgba(255,255,255,0.12),transparent_60%)] pointer-events-none fixed inset-0" />
            <div className="bg-[radial-gradient(900px_500px_at_10%_10%,rgba(255,0,80,0.10),transparent_55%)] pointer-events-none fixed inset-0" />
            <div className="bg-[radial-gradient(900px_500px_at_90%_25%,rgba(0,180,255,0.10),transparent_55%)] pointer-events-none fixed inset-0" />

            <div className="relative mx-auto max-w-md px-4 pb-24 pt-5">
                <Outlet />
            </div>

            {/* Floating SOS - always accessible */}
            {!hideNav && (
                <button
                    onClick={() => nav("/sos")}
                    className="fixed z-50 right-5 bottom-24 active:scale-95 transition"
                    aria-label="Open SOS"
                >
                    <div className="sos-fab shadow-2xl">
                        <ShieldAlert size={20} />
                        <span className="text-xs font-semibold">SOS</span>
                    </div>
                </button>
            )}

            {!hideNav && <BottomNav />}
        </div>
    );
}
