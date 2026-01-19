import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((toast) => {
    const id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now() + Math.random());
    const item = { id, type: "info", title: "", message: "", ttl: 3000, ...toast };
    setToasts((prev) => [item, ...prev].slice(0, 3));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, item.ttl);
  }, []);

  const api = useMemo(() => ({
    toast: push,
    success: (message, title = "Success") => push({ type: "success", title, message }),
    error: (message, title = "Error") => push({ type: "error", title, message, ttl: 4500 }),
    info: (message, title = "Info") => push({ type: "info", title, message }),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 left-0 right-0 z-[9999] pointer-events-none">
        <div className="mx-auto w-[92%] max-w-md space-y-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={
                "pointer-events-auto rounded-2xl border px-4 py-3 shadow-sm bg-white " +
                (t.type === "success" ? "border-emerald-200" : "") +
                (t.type === "error" ? "border-red-200" : "") +
                (t.type === "info" ? "border-zinc-200" : "")
              }
              role="status"
            >
              <div className="text-sm font-bold text-zinc-900">{t.title}</div>
              <div className="text-sm text-zinc-700">{t.message}</div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
