import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const nav = useNavigate();
    const { register, loading, authError } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [localErr, setLocalErr] = useState(null);

    async function submit(e) {
        e.preventDefault();
        setLocalErr(null);
        try {
            await register({ email, password, name });
            nav("/");
        } catch (err) {
            // 409 = already exists
            setLocalErr(err?.message || "Registration failed");
        }
    }

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h1 className="font-black text-2xl">Create account</h1>
                <p className="mt-1 text-white/70">Secure access + emergency profile.</p>

                {(localErr || authError) && (
                    <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {localErr || authError}
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm text-white/70">Name</label>
                        <input
                            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/30"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Luyanda"
                            autoComplete="name"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-white/70">Email</label>
                        <input
                            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/30"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@email.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-white/70">Password</label>
                        <input
                            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/30"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 8 characters"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-white py-3 font-bold text-black hover:opacity-90 disabled:opacity-60"
                    >
                        {loading ? "Creating..." : "Create account"}
                    </button>
                </form>

                <div className="mt-4 text-sm text-white/70">
                    Already have an account?{" "}
                    <Link to="/login" className="text-white underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
