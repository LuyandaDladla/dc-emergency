import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useProvince } from "../context/ProvinceContext";

export default function AppShell({ children }) {
    const nav = useNavigate();
    const loc = useLocation();
    const { provinceLabel, openPicker, locStatus } = useProvince();

    const showChrome = !["/login", "/register"].includes(loc.pathname);

    return (
        <div className="bg-premium min-h-screen">
            <div className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-4">
                {showChrome && (
                    <header className="glass flex items-center justify-between rounded-3xl px-4 py-3">
                        <div className="font-semibold tracking-tight">DC Emergency</div>

                        <button
                            className="btn px-3 py-2 text-xs"
                            onClick={openPicker}
                            title="Change province"
                        >
                            {locStatus === "idle" ? "Detecting…" : provinceLabel}
                        </button>
                    </header>
                )}

                <main className="pt-5">{children}</main>
            </div>

            {showChrome && (
                <>
                    {/* Floating SOS always accessible */}
                    <button
                        onClick={() => nav("/sos")}
                        className="fixed right-5 z-50 sos-ring"
                        style={{
                            bottom: "calc(88px + env(safe-area-inset-bottom))",
                            width: 74,
                            height: 74,
                            borderRadius: 999,
                            background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 55%), #ff2f45",
                            border: "1px solid rgba(255,255,255,0.18)",
                            color: "white",
                        }}
                    >
                        <div className="flex flex-col items-center justify-center leading-none">
                            <div className="text-lg font-extrabold">SOS</div>
                            <div className="text-[10px] opacity-90">Emergency</div>
                        </div>
                    </button>

                    <BottomNav />
                </>
            )}
        </div>
    );
}
