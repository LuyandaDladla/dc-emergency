export default function TopBar({ title, right }) {
  return (
    <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
        <div className="font-semibold tracking-tight text-base">{title}</div>
        <div>{right || null}</div>
      </div>
    </div>
  );
}