import React from "react";
import { NavLink } from "react-router-dom";
import { Home, AlertTriangle, Users, Shield, User } from "lucide-react";

const items = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/sos", label: "SOS", Icon: AlertTriangle, danger: true },
    { to: "/community", label: "Community", Icon: Users },
    { to: "/risk", label: "Risk", Icon: Shield },
    { to: "/profile", label: "Profile", Icon: User },
];

function cls(...a) {
    return a.filter(Boolean).join(" ");
}

export default function BottomNav() {
    return (
        <nav
            className={cls(
                "fixed inset-x-0 bottom-0 z-50",
                "border-t border-white/10",
                "bg-black/55 backdrop-blur-2xl"
            )}
            style={{
                paddingBottom: "max(10px, env(safe-area-inset-bottom))",
            }}
        >
            <div className="mx-auto max-w-md px-4">
                <div className="grid grid-cols-5 py-2">
                    {items.map(({ to, label, Icon, danger }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                cls(
                                    "dc-press",
                                    "flex flex-col items-center justify-center gap-1",
                                    "py-2",
                                    isActive ? "text-white" : "text-white/55 hover:text-white/80"
                                )
                            }
                        >
                            <div
                                className={cls(
                                    "grid place-items-center",
                                    "h-9 w-9 rounded-2xl",
                                    "dc-shadow-inset",
                                    danger
                                        ? "bg-red-500/14 border border-red-300/20"
                                        : "bg-white/6 border border-white/10"
                                )}
                            >
                                <Icon
                                    size={20}
                                    className={danger ? "text-red-200" : "text-white"}
                                />
                            </div>
                            <div
                                className={cls(
                                    "text-[11px] leading-none",
                                    danger ? "text-red-200/90" : ""
                                )}
                            >
                                {label}
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
}
