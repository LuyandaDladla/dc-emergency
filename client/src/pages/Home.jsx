import { Link } from "react-router-dom";
import { AlertTriangle, Shield, Users, MessageCircle, MapPin } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0B0B0F] px-4 pb-24 pt-6 text-white">
            <div className="mx-auto max-w-md space-y-4">
                {/* Header / reassurance */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30 backdrop-blur-xl">
                    <p className="text-sm text-white/60">You’re not alone.</p>
                    <h1 className="mt-1 text-2xl font-semibold">How can we help today?</h1>
                    <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                        <MapPin size={14} />
                        <span>Location-aware support (South Africa)</span>
                    </div>
                </div>

                {/* SOS Primary */}
                <Link
                    to="/sos"
                    className="block rounded-3xl border border-red-500/20 bg-red-500/10 p-5 shadow-lg shadow-black/30 backdrop-blur-xl transition active:scale-[0.99]"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 ring-1 ring-red-400/20">
                            <AlertTriangle className="text-red-300" />
                        </div>
                        <div className="flex-1">
                            <div className="text-lg font-semibold">SOS</div>
                            <div className="text-sm text-white/60">
                                Send your location + alert your contacts instantly
                            </div>
                        </div>
                        <div className="text-xs text-red-200/80">Open</div>
                    </div>
                </Link>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Link
                        to="/risk"
                        className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 backdrop-blur-xl transition active:scale-[0.99]"
                    >
                        <Shield className="text-white/85" />
                        <div className="mt-3 font-semibold">Risk Check</div>
                        <div className="text-xs text-white/60">Quick assessment</div>
                    </Link>

                    <Link
                        to="/community"
                        className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 backdrop-blur-xl transition active:scale-[0.99]"
                    >
                        <Users className="text-white/85" />
                        <div className="mt-3 font-semibold">Community</div>
                        <div className="text-xs text-white/60">Support near you</div>
                    </Link>

                    <Link
                        to="/therapist"
                        className="col-span-2 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 backdrop-blur-xl transition active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                                <MessageCircle className="text-white/85" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold">Talk to someone</div>
                                <div className="text-xs text-white/60">
                                    AI therapist (private + judgment-free)
                                </div>
                            </div>
                            <div className="text-xs text-white/60">Open</div>
                        </div>
                    </Link>
                </div>

               
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 backdrop-blur-xl">
                    <div className="text-sm font-semibold">Quick safety tip</div>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">
                        If you’re in immediate danger, use <span className="text-white">SOS</span>. If you’re unsure,
                        do a <span className="text-white">Risk Check</span> — it’ll guide you on what to do next.
                    </p>
                </div>
            </div>
        </div>
    );
}
