import React from "react";

const base = "w-5 h-5";

export function IconHome({ className = "" }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}
export function IconSOS({ className = "" }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M12 2v3M4.2 6.2l2.1 2.1M2 12h3M18 12h3M17.7 8.3l2.1-2.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 7c-2.8 0-5 2.2-5 5 0 1.9 1 3.5 2.5 4.3V21h5v-4.4C16 15.5 17 13.9 17 12c0-2.8-2.2-5-5-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}
export function IconCommunity({ className = "" }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M16 11a3 3 0 1 0-2.9-3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M2.5 20c.7-3 3.1-5 5.5-5s4.8 2 5.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M14.5 20c.3-1.5 1.4-2.9 3.2-3.7 1.2-.5 2.5-.4 3.8.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
export function IconHotspots({ className = "" }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}
export function IconRisk({ className = "" }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M12 2 4 6v6c0 5.5 3.8 9.7 8 10 4.2-.3 8-4.5 8-10V6l-8-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M12 7v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 17h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}
export function IconProfile({ className = "" }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
