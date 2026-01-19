import { HOTSPOTS } from "./hotspots";

const KEY = "dc_hotspots_v1";

export function loadHotspots() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return HOTSPOTS;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) return HOTSPOTS;
        return parsed;
    } catch {
        return HOTSPOTS;
    }
}

export function saveHotspots(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
}
