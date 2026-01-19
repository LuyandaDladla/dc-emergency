import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import { Siren } from "lucide-react";

function cls() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(" ");
}

export default function AppShell() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#070A12] to-black" />
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute top-56 right-[-80px] h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-120px] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Page content */}
      <div className="mx-auto max-w-3xl px-4 pb-28 pt-4">
        <Outlet />
      </div>

      {/* Floating SOS (always accessible) */}
      <button
        type="button"
        onClick={() => nav("/sos")}
        className={cls(
          "fixed bottom-[92px] right-5 z-[60]",
          "h-14 w-14 rounded-2xl",
          "border border-red-300/20 bg-red-500/20",
          "backdrop-blur-2xl shadow-2xl shadow-black/50",
          "flex items-center justify-center",
          "active:scale-[0.98] transition"
        )}
        aria-label="Open SOS"
        title="SOS"
      >
        <Siren size={20} className="text-red-100" />
      </button>

      <BottomNav />
    </div>
  );
}