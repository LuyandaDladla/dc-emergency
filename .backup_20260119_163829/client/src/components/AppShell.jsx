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
        <div className="-translate-x-1/2 absolute -top-24 left-1/2 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="right-[-80px] absolute top-56 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="bottom-[-120px] left-[-120px] absolute h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Page content */}
      <div className="mx-auto max-w-3xl px-4 pb-28 pt-4">
        <Outlet />
      </div>

          {/* Floating SOS (always accessible) */}
          <button
              onClick={() => navigate("/sos")}
              className="fixed right-5 bottom-24 z-50 w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 transition shadow-2xl shadow-red-600/40 font-black"
              aria-label="SOS"
              title="SOS"
          >
              SOS
          </button>


      <BottomNav />
    </div>
  );
}