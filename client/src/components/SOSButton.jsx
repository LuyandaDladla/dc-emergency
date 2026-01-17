export default function SOSButton({ onPress }) {
  return (
    <button
      onClick={onPress}
      className="relative select-none"
      aria-label="SOS"
      title="SOS"
    >
      <div className="w-56 h-56 rounded-full bg-red-600 shadow-[0_0_60px_rgba(220,38,38,0.45)] flex items-center justify-center">
        <div className="w-44 h-44 rounded-full bg-red-500/90 border border-white/20 flex items-center justify-center">
          <div className="text-5xl font-extrabold tracking-tight">SOS</div>
        </div>
      </div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        Hold to send help (tap for now)
      </div>
    </button>
  );
}