import React from "react";
import { useProvince } from "../context/ProvinceContext";

export default function ProvincePicker({ open, onClose }) {
    const { provinces, province, setProvinceByKey, detectProvince, locStatus } = useProvince();

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div
                className="-translate-x-1/2 absolute bottom-0 left-1/2 w-full max-w-[520px] rounded-t-3xl border border-white/10 bg-black/80 p-4 shadow-2xl backdrop-blur-2xl"
                style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-semibold text-white">Select province</div>
                        <div className="mt-1 text-xs text-white/60">
                            Location:{" "}
                            {locStatus === "idle"
                                ? "Detecting�"
                                : locStatus === "ok"
                                    ? "Detected"
                                    : locStatus === "denied"
                                        ? "Permission denied"
                                        : "Unavailable"}
                        </div>
                    </div>

                    <button
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                        onClick={() => detectProvince()}
                    >
                        Detect
                    </button>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                    {provinces.map((p) => {
                        const active = p.key === province.key;
                        return (
                            <button
                                key={p.key}
                                onClick={() => {
                                    setProvinceByKey(p.key);
                                    onClose();
                                }}
                                className={[
                                    "text-left rounded-2xl px-4 py-3 border transition",
                                    active
                                        ? "border-white/25 bg-white/10"
                                        : "border-white/10 bg-black/30 hover:bg-white/5"
                                ].join(" ")}
                            >
                                <div className="font-medium text-white">{p.name}</div>
                                <div className="text-xs text-white/60">{p.key}</div>
                            </button>
                        );
                    })}
                </div>

                <button className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 py-3" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}
