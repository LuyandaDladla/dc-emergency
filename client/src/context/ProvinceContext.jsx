import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PROVINCES, findProvinceByLatLng } from "../utils/saProvinces";

const ProvinceContext = createContext(null);

const LS_KEY = "dc_province";

export function ProvinceProvider({ children }) {
    const [province, setProvince] = useState(() => {
        const saved = localStorage.getItem(LS_KEY);
        if (!saved) return PROVINCES.find((p) => p.key === "GP") || PROVINCES[0];
        const match = PROVINCES.find((p) => p.key === saved);
        return match || PROVINCES[0];
    });

    const [locStatus, setLocStatus] = useState("idle"); // idle | ok | denied | error
    const [coords, setCoords] = useState(null);

    async function detectProvince() {
        setLocStatus("idle");

        if (!navigator.geolocation) {
            setLocStatus("error");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const p = findProvinceByLatLng(lat, lng);
                if (p) {
                    setProvince(p);
                    localStorage.setItem(LS_KEY, p.key);
                }
                setCoords({ lat, lng, accuracy: pos.coords.accuracy });
                setLocStatus("ok");
            },
            (err) => {
                if (err?.code === 1) setLocStatus("denied");
                else setLocStatus("error");
            },
            { enableHighAccuracy: true, timeout: 6000, maximumAge: 20000 }
        );
    }

    function setProvinceByKey(key) {
        const p = PROVINCES.find((x) => x.key === key);
        if (!p) return;
        setProvince(p);
        localStorage.setItem(LS_KEY, p.key);
    }

    useEffect(() => {
        // auto-detect once per session for demo
        detectProvince();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo(
        () => ({
            province,
            provinces: PROVINCES,
            setProvinceByKey,
            detectProvince,
            locStatus,
            coords
        }),
        [province, locStatus, coords]
    );

    return <ProvinceContext.Provider value={value}>{children}</ProvinceContext.Provider>;
}

export function useProvince() {
    return useContext(ProvinceContext);
}
