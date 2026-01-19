import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
                "icons/icon-192.png",
                "icons/icon-512.png",
                "icons/maskable-192.png",
                "icons/maskable-512.png",
            ],
            manifest: {
                name: "DC Emergency",
                short_name: "DC Emergency",
                description: "Emergency + wellness support (demo)",
                theme_color: "#0b0f14",
                background_color: "#0b0f14",
                display: "standalone",
                scope: "/",
                start_url: "/",
                icons: [
                    { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
                    { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
                    {
                        src: "/icons/maskable-192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable",
                    },
                    {
                        src: "/icons/maskable-512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
            workbox: {
                navigateFallback: "/index.html",
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) => url.origin.includes("dc-emergency.onrender.com"),
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "api-cache",
                            networkTimeoutSeconds: 3,
                            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 },
                        },
                    },
                ],
            },
        }),
    ],
});
