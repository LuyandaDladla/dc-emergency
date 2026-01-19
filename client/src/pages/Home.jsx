import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ChevronDown, Siren, PhoneCall, Shield, Users, MessageCircle } from "lucide-react";

const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function guessProvinceFromText(text = "") {
  const t = text.toLowerCase();
  const map = [
    ["eastern cape", "Eastern Cape"],
    ["free state", "Free State"],
    ["gauteng", "Gauteng"],
    ["kwazulu", "KwaZulu-Natal"],
    ["kzn", "KwaZulu-Natal"],
    ["limpopo", "Limpopo"],
    ["mpumalanga", "Mpumalanga"],
    ["northern cape", "Northern Cape"],
    ["north west", "North West"],
    ["western cape", "Western Cape"],
  ];
  for (const [k, v] of map) if (t.includes(k)) return v;
  return null;
}

async function reverseGeocode(lat, lon) {
  // Free reverse geocode (good enough for demo). If it fails, we still show coords.
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
  });
  const data = await res.json();
  return data;
}

export default function Home() {
  const nav = useNavigate();

  const [province, setProvince] = useState(() => localStorage.getItem("dc_province") || "");
  const [pickerOpen, setPickerOpen] = useState(false);

  const [locStatus, setLocStatus] = useState("idle"); // idle | locating | ok | denied | error
  const [coords, setCoords] = useState(null);
  const [place, setPlace] = useState("");

  // Location auto-detect on load (demo)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!("geolocation" in navigator)) {
        setLocStatus("error");
        return;
      }

      setLocStatus("locating");

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (cancelled) return;
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setCoords({ lat, lon });

          try {
            const geo = await reverseGeocode(lat, lon);
            if (cancelled) return;
            const display = geo?.display_name || "";
            setPlace(display);

            const inferred =
              guessProvinceFromText(display) ||
              guessProvinceFromText(JSON.stringify(geo?.address || {})) ||
              "";

            if (inferred) {
              setProvince(inferred);
              localStorage.setItem("dc_province", inferred);
            }

            setLocStatus("ok");
          } catch {
            setLocStatus("ok");
          }
        },
        (err) => {
          if (cancelled) return;
          if (err?.code === 1) setLocStatus("denied");
          else setLocStatus("error");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 20000 }
      );
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (province) localStorage.setItem("dc_province", province);
  }, [province]);

  const provinceLabel = useMemo(() => {
    if (province) return province;
    if (locStatus === "locating") return "Detecting location…";
    if (locStatus === "denied") return "Location blocked (choose province)";
    return "Choose your province";
  }, [province, locStatus]);

  return (
    <div className="pt-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-2xl font-semibold leading-tight">DC Emergency</div>
            <div className="mt-1 text-sm text-white/70">
              Safety • Wellness • Support • Community
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className={cx(
              "shrink-0 rounded-xl border border-white/10 bg-black/30 px-3 py-2",
              "backdrop-blur-xl hover:bg-black/40 transition"
            )}
          >
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-white/70" />
              <span className="max-w-[150px] truncate">{provinceLabel}</span>
              <ChevronDown size={16} className="text-white/70" />
            </div>
          </button>
        </div>

        {/* Location line */}
        <div className="mt-3 rounded-xl border border-white/10 bg-black/25 p-3 text-xs text-white/70">
          {coords ? (
            <>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400/80" />
                Location detected
              </div>
              <div className="mt-1 truncate">
                {place || `Lat ${coords.lat.toFixed(5)}, Lon ${coords.lon.toFixed(5)}`}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className={cx("inline-block h-2 w-2 rounded-full", locStatus === "denied" ? "bg-amber-400/80" : "bg-white/30")} />
                {locStatus === "locating" && "Detecting location…"}
                {locStatus === "denied" && "Location permission blocked — you can still select a province"}
                {(locStatus === "idle" || locStatus === "error") && "Location not detected yet"}
              </div>
              <div className="mt-1">
                Tip: allow location for automatic province selection.
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main feature card: SOS */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">SOS (Main Feature)</div>
            <div className="mt-1 text-sm text-white/70">
              Send your live location + notify emergency contacts instantly.
            </div>
          </div>
          <button
            type="button"
            onClick={() => nav("/sos")}
            className="rounded-xl border border-red-300/20 bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-50 hover:bg-red-500/25 transition"
          >
            Open SOS
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => nav("/community")}
            className="rounded-xl border border-white/10 bg-black/25 p-4 text-left hover:bg-black/35 transition"
          >
            <div className="flex items-center gap-2">
              <Users size={18} className="text-white/80" />
              <div className="font-semibold">Community</div>
            </div>
            <div className="mt-1 text-xs text-white/70">Local + national chatrooms</div>
          </button>

          <button
            type="button"
            onClick={() => nav("/chat")}
            className="rounded-xl border border-white/10 bg-black/25 p-4 text-left hover:bg-black/35 transition"
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-white/80" />
              <div className="font-semibold">Live Chat</div>
            </div>
            <div className="mt-1 text-xs text-white/70">Talk to an agent (demo)</div>
          </button>

          <button
            type="button"
            onClick={() => nav("/risk")}
            className="rounded-xl border border-white/10 bg-black/25 p-4 text-left hover:bg-black/35 transition"
          >
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-white/80" />
              <div className="font-semibold">Risk Analysis</div>
            </div>
            <div className="mt-1 text-xs text-white/70">Assess danger + next steps</div>
          </button>

          <a
            href="tel:112"
            className="rounded-xl border border-white/10 bg-black/25 p-4 text-left transition hover:bg-black/35"
          >
            <div className="flex items-center gap-2">
              <PhoneCall size={18} className="text-white/80" />
              <div className="font-semibold">Call 112</div>
            </div>
            <div className="mt-1 text-xs text-white/70">SA emergency (mobile)</div>
          </a>
        </div>
          </div>

          <button
              onClick={() => nav("/admin")}
              className="rounded-2xl border border-white/10 bg-black/25 p-4 text-left hover:bg-black/35 transition"
          >
              <div className="text-sm font-semibold">Admin (Demo)</div>
              <div className="mt-1 text-xs text-white/70">Hotspots + monitoring</div>
          </button>


      {/* Province picker modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3">
          <div className="absolute inset-0 bg-black/70" onClick={() => setPickerOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black/70 shadow-2xl shadow-black/60 backdrop-blur-2xl">
            <div className="p-4">
              <div className="text-base font-semibold">Select Province</div>
              <div className="mt-1 text-sm text-white/70">
                Auto-detect is used when location is allowed.
              </div>

              <div className="mt-4 grid max-h-[55vh] grid-cols-1 gap-2 overflow-auto pr-1">
                {PROVINCES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setProvince(p);
                      setPickerOpen(false);
                    }}
                    className={cx(
                      "rounded-xl px-4 py-3 text-left",
                      "border border-white/10",
                      province === p ? "bg-white/12" : "bg-white/6 hover:bg-white/10"
                    )}
                  >
                    <div className="text-sm font-semibold">{p}</div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
