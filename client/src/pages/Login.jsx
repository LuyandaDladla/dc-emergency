import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");
        setBusy(true);
        try {
            await login(email.trim(), password);
            nav("/");
        } catch (e2) {
            setErr(e2?.message || "Login failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-4">
                    <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
                    <p className="mt-1 text-sm text-white/60">Sign in to continue</p>
                </div>

                {err ? (
                    <div className="mb-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                        {err}
                    </div>
                ) : null}

                <form onSubmit={onSubmit} className="space-y-3">
                    <input
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-white/30"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                    <input
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-white/30"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full rounded-2xl bg-white py-3 font-medium text-black hover:bg-white/90 disabled:opacity-60"
                    >
                        {busy ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="mt-4 text-sm text-white/60">
                    No account?{" "}
                    <Link className="text-white hover:underline" to="/register">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
}
