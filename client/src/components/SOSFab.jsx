import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function SOSFab() {
    const nav = useNavigate();
    const { pathname } = useLocation();

    // Don�t show the FAB on the SOS page itself (optional)
    if (pathname === "/sos") return null;

    return (
        <button
            type="button"
            onClick={() => nav("/sos")}
            aria-label="Open SOS"
            className="
        fixed z-[60]
        right-4
        bottom-[92px]
        md:right-6 md:bottom-[104px]
        rounded-full
        px-4 py-3
        border border-red-400/30
        bg-red-500/20
        backdrop-blur-xl
        shadow-lg shadow-black/40
        active:scale-[0.98]
        transition
      "
        >
            <span className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/25 ring-1 ring-red-300/20">
                    <AlertTriangle className="text-red-200" size={18} />
                </span>
                <span className="text-sm font-semibold text-white">SOS</span>
            </span>
        </button>
    );
}

