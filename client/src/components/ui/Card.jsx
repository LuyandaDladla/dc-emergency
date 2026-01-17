export function Card({ children, className = "" }) {
  return (
    <div className={[
      "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl",
      "shadow-[0_1px_0_rgba(255,255,255,0.04)]",
      className
    ].join(" ")}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 pt-4">
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        {subtitle ? <div className="mt-1 text-xs text-white/60">{subtitle}</div> : null}
      </div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}

export function CardBody({ children, className="" }) {
  return <div className={["px-4 pb-4 pt-3", className].join(" ")}>{children}</div>;
}