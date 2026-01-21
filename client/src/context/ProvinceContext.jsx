// client/src/context/ProvinceContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { tryPost } from "../services/api";
import useLiveLocation from "../hooks/useLiveLocation";

const ProvinceContext = createContext(null);

export function ProvinceProvider({ children }) {
    const loc = useLiveLocation(); // { coords, status, error }
    const [province, setProvince] = useState(localStorage.getItem("province") || "Unknown");

    useEffect(() => {
        async function run() {
            if (!loc?.coords?.lat || !loc?.coords?.lng) return;
            try {
                const r = await tryPost("/location/resolve", { lat: loc.coords.lat, lng: loc.coords.lng });
                if (r?.province) {
                    setProvince(r.province);
                    localStorage.setItem("province", r.province);
                }
            } catch {
                // keep last known
            }
        }
        run();
    }, [loc?.coords?.lat, loc?.coords?.lng]);

    const value = useMemo(
        () => ({
            province,
            coords: loc?.coords || null,
            locStatus: loc?.status || "idle",
            locError: loc?.error || null,
            setProvince: (p) => {
                setProvince(p);
                localStorage.setItem("province", p);
            },
        }),
        [province, loc?.coords, loc?.status, loc?.error]
    );

    return <ProvinceContext.Provider value={value}>{children}</ProvinceContext.Provider>;
}

export function useProvince() {
    return useContext(ProvinceContext);
}
