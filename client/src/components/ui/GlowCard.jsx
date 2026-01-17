export default function GlowCard({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
        "backdrop-blur-xl",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}