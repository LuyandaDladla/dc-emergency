import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const nav = useNavigate();
    const { login, loading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    async function submit(e) {
        e.preventDefault();
        setErr("");
        try {
            await login(email.trim(), password);
            nav("/");
        } catch (e2) {
            setErr(e2?.message || "Could not sign in.");
        }
    }

    return (
        <div className="min-h-screen px-4 pb-28 pt-10">
            <div className="mx-auto max-w-md">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
                    <p className="mt-1 text-white/60">
                        Sign in to access SOS, support, and your safety tools.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-xl">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="text-sm text-white/70">Email</label>
                            <input
                                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-white outline-none focus:border-white/25"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                inputMode="email"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/70">Password</label>
                            <input
                                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-white outline-none focus:border-white/25"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                type="password"
                                placeholder="••••••••"
                            />
                        </div>

                        {err ? (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                                {err}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={!!loading}
                            className="w-full rounded-xl bg-white py-3 font-medium text-black transition active:scale-[0.99] disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Continue"}
                        </button>

                        <p className="text-center text-sm text-white/60">
                            Don’t have an account?{" "}
                            <Link to="/register" className="text-white underline underline-offset-4">
                                Create one
                            </Link>
                        </p>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-white/45">
                    If you’re in danger, go to the SOS tab immediately.
                </p>
            </div>
        </div>
    );
}
