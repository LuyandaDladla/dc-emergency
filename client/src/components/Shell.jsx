import React from "react";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

export default function Shell({ children }) {
  return (
    <div className="min-h-full flex flex-col">
      <TopBar />
      <main className="flex-1 w-full max-w-[980px] mx-auto px-4 pb-24 pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}