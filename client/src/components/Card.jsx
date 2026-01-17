export default function Card({ children, className = "" }) {
  return (
    <div className={"rounded-2xl border border-white/10 bg-white/5 shadow-sm " + className}>
      {children}
    </div>
  );
}