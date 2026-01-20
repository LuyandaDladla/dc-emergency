// PWA service worker registration
export function registerServiceWorker() {
  if (import.meta.env.DEV) return; // let Vite dev stay simple
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
}
