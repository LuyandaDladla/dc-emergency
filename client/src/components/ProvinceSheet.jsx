import React, { useMemo, useState } from "react";
import { useProvince } from "../context/ProvinceContext";

function cls(...a) {
  return a.filter(Boolean).join(" ");
}

export default function ProvinceSheet({ open, onClose }) {
  const { province, setProvince, provinces, locStatus, locError, detectProvince } = useProvince();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return provinces;
    return provinces.filter((p) => p.toLowerCase().includes(query));
  }, [q, provinces]);

  if (!open) return null;

  return (
    <div className="z-[60] fixed inset-0">
      {/* overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-label="Close province picker"
      />

      {/* sheet */}
      <div
        className={cls(
          "absolute inset-x-0 bottom-0 mx-auto w-full max-w-md",
          "dc-glass dc-card",
          "p-4"
        )}
        style={{
          paddingBottom: "max(14px, env(safe-area-inset-bottom))",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white/60">Location</div>
            <div className="text-lg font-semibold tracking-tight">Choose your province</div>
          </div>

          <button type="button" onClick={onClose} className="dc-btn dc-press text-sm">
            Done
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="dc-input w-full text-sm"
            placeholder="Search provinces�"
          />

          <button
            type="button"
            onClick={detectProvince}
            className="dc-btn dc-press whitespace-nowrap text-sm"
            title="Use live location"
          >
            {locStatus === "locating" ? "Locating�" : "Use GPS"}
          </button>
        </div>

        {(locError || locStatus === "resolved") && (
          <div className="mt-2 text-xs">
            {locStatus === "resolved" ? (
              <span className="text-emerald-200/90">Detected province updated.</span>
            ) : (
              <span className="text-red-200/90">{locError}</span>
            )}
          </div>
        )}

        <div className="mt-3 max-h-[46vh] overflow-auto">
          {filtered.map((p) => {
            const active = p === province;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setProvince(p)}
                className={cls(
                  "w-full text-left dc-press",
                  "px-4 py-3",
                  "rounded-2xl",
                  "border",
                  active
                    ? "bg-white/12 border-white/20"
                    : "bg-white/6 border-white/10 hover:bg-white/8"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{p}</div>
                  {active && <div className="text-xs text-white/70">Selected</div>}
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-4 text-sm text-white/60">No matches.</div>
          )}
        </div>
      </div>
    </div>
  );
}
