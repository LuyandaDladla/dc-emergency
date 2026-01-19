import React from "react";

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-black text-white hover:bg-zinc-800 focus:ring-zinc-400",
    secondary:
      "bg-white text-black border border-zinc-200 hover:bg-zinc-50 focus:ring-zinc-300",
    ghost:
      "bg-transparent text-black hover:bg-zinc-100 focus:ring-zinc-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  return (
    <button
      className={base + " " + (variants[variant] || variants.primary) + " " + (sizes[size] || sizes.md) + " " + className}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
