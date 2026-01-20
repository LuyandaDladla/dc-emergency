import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const nav = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    async function submit(e) {
        e.preventDefault();
        setErr("");
        setBusy(true);
        try {
            await register(name.trim(), email.trim(), password);
            nav("/", { replace: true });
        } catch (ex) {
            setErr(ex?.message || "Register failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-xl">
                <h1 className="text-xl font-semibold">Create account</h1>
                <p className="mt-1 text-sm text-white/70">Quick demo signup.</p>

                <form onSubmit={submit} className="mt-4 space-y-3">
                    <input
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 outline-none"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                    />
                    <input
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 outline-none"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                    <input
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 outline-none"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        autoComplete="new-password"
                    />

                    {err ? (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                            {err}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full rounded-xl bg-white py-3 font-semibold text-black disabled:opacity-60"
                    >
                        {busy ? "Creating..." : "Create account"}
                    </button>

                    <button
                        type="button"
                        className="w-full rounded-xl border border-white/15 py-3 text-white/90"
                        onClick={() => nav("/login")}
                    >
                        Back to sign in
                    </button>
                </form>
            </div>
        </div>
    );
}
