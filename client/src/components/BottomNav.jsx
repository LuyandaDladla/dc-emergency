// client/src/components/BottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, MapPin, MessageCircle, User } from "lucide-react";

const items = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/community", label: "Community", Icon: Users },
    { to: "/hotspots", label: "Hotspots", Icon: MapPin },
    { to: "/chat", label: "Live Chat", Icon: MessageCircle },
    { to: "/profile", label: "Profile", Icon: User },
];

export default function BottomNav() {
    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
            <div className="mx-auto max-w-md px-3 pb-3">
                <div className="glass-nav rounded-3xl px-2 py-2">
                    <div className="grid grid-cols-5">
                        {items.map(({ to, label, Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    [
                                        "flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition",
                                        isActive ? "bg-white/10" : "hover:bg-white/5",
                                    ].join(" ")
                                }
                            >
                                <Icon size={18} className="opacity-90" />
                                <span className="leading-none text-[11px] opacity-85">{label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
