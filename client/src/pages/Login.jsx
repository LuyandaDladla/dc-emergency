import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const from = useMemo(() => (loc.state && loc.state.from) ? loc.state.from : "/", [loc.state]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email.trim(), password);
      toast.success("You are signed in.");
      nav(from, { replace: true });
    } catch (err) {
      toast.error((err && err.message) ? err.message : "Login failed. Check your details and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md pt-6">
      <Card className="p-5">
        <div className="mb-4">
          <div className="text-xl font-black tracking-tight">Welcome back</div>
          <div className="text-sm text-zinc-600">Sign in to continue.</div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-900"
              onClick={() => setShow((s) => !s)}
            >
              {show ? "Hide password" : "Show password"}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? (<><Spinner /> Signing in...</>) : "Sign in"}
          </Button>

          <div className="text-sm text-zinc-600 text-center">
            Don&apos;t have an account?{" "}
            <Link className="font-bold text-zinc-900 hover:underline" to="/register">
              Create one
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
