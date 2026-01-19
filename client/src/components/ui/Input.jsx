import React from "react";

export default function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-semibold text-zinc-800">{label}</div> : null}
      <input
        className={
          "w-full h-11 rounded-xl border px-3 text-sm outline-none transition " +
          "border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 " +
          (error ? "border-red-400 focus:border-red-500 focus:ring-red-100 " : "") +
          className
        }
        {...props}
      />
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </label>
  );
}
