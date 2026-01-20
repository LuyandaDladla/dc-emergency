import React from "react";
import { NavLink } from "react-router-dom";
import { IconHome, IconSOS, IconCommunity, IconHotspots, IconRisk, IconProfile } from "./Icons";

const tabs = [
    { to: "/", label: "Home", Icon: IconHome },
    { to: "/community", label: "Community", Icon: IconCommunity },
    { to: "/sos", label: "SOS", Icon: IconSOS, accent: true },
    { to: "/hotspots", label: "Hotspots", Icon: IconHotspots },
    { to: "/risk", label: "Risk", Icon: IconRisk },
    { to: "/profile", label: "Profile", Icon: IconProfile },
];

export default function BottomNav() {
    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4"
            style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}
        >
            <nav className="glass w-full max-w-md rounded-3xl px-3 py-2">
                <div className="grid grid-cols-6 gap-1">
                    {tabs.map(({ to, label, Icon, accent }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                [
                                    "flex flex-col items-center justify-center gap-1 py-2 rounded-2xl",
                                    "text-[11px] leading-none",
                                    isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white",
                                ].join(" ")
                            }
                        >
                            <div
                                className={[
                                    "flex items-center justify-center",
                                    accent ? "text-red-400" : "",
                                ].join(" ")}
                            >
                                <Icon />
                            </div>
                            <div className={accent ? "text-red-300" : ""}>{label}</div>
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
}
