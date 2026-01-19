import { Home, AlertTriangle, Users, Shield, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/sos", label: "SOS", icon: AlertTriangle, danger: true },
    { to: "/community", label: "Community", icon: Users },
    { to: "/risk", label: "Risk", icon: Shield },
    { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur">
            <div className="grid grid-cols-5 py-2">
                {items.map(({ to, label, icon: Icon, danger }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 text-xs transition
               ${isActive
                                ? danger
                                    ? "text-red-400"
                                    : "text-white"
                                : "text-white/50 hover:text-white"}`
                        }
                    >
                        <Icon
                            size={22}
                            className={danger ? "text-red-500" : ""}
                        />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
