import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppShell() {
    const nav = useNavigate();
    const { pathname } = useLocation();

    const hideChrome = pathname === "/login" || pathname === "/register";

    return (
        <div className="bg-app min-h-screen text-white">
            <div className={hideChrome ? "" : "pb-[110px]"}>
                <Outlet />
            </div>

            {!hideChrome && (
                <>
                    {/* Floating SOS */}
                    <button
                        onClick={() => nav("/sos")}
                        aria-label="SOS"
                        className="fixed right-4 z-50 rounded-full bg-red-600 shadow-2xl shadow-red-500/30 active:scale-95 transition
                       w-16 h-16 flex items-center justify-center font-extrabold"
                        style={{
                            bottom:
                                "calc(84px + max(16px, env(safe-area-inset-bottom)))",
                        }}
                    >
                        SOS
                    </button>

                    {/* Bottom Nav */}
                    <div
                        className="fixed bottom-0 left-0 right-0 z-40"
                        style={{
                            paddingBottom: "max(0px, env(safe-area-inset-bottom))",
                        }}
                    >
                        <BottomNav />
                    </div>
                </>
            )}
        </div>
    );
}
