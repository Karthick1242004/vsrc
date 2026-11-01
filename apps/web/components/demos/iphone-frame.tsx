import type * as React from "react";

/* iPhone 17 Pro proportions (71.9 × 150 mm) in its Cosmic Orange aluminium. Drawn,
   not a photo, so the screen stays a live DOM the glass can refract. */
const EDGE = "linear-gradient(145deg, #f2a36b 0%, #c8642f 38%, #8f3f1b 62%, #e48a52 100%)";

function SideButton({ className }: { className: string }) {
  return <span aria-hidden className={`absolute w-[3px] rounded-full ${className}`} style={{ background: EDGE }} />;
}

function StatusBar() {
  return (
    <div aria-hidden className="absolute inset-x-0 top-0 z-30 flex h-[46px] items-center justify-between px-7 pt-1 text-[13px] font-semibold text-foreground">
      <span className="tabular-nums">9:41</span>
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 18 12" className="h-2.5" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M1.5 4.5a9.5 9.5 0 0 1 13 0M4 7.2a6 6 0 0 1 8 0" />
          <circle cx="8" cy="10" r="1.2" fill="currentColor" stroke="none" />
        </svg>
        <svg viewBox="0 0 27 13" className="h-3" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2.5" y="2.5" width="17" height="8" rx="2" fill="currentColor" />
          <path d="M25 4.5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

export function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div data-slot="phone-frame" className="relative aspect-[71.9/150] w-[min(100%,300px)]">
      <SideButton className="top-[17%] -left-[2px] h-[5%]" />
      <SideButton className="top-[25%] -left-[2px] h-[8%]" />
      <SideButton className="top-[35%] -left-[2px] h-[8%]" />
      <SideButton className="top-[27%] -right-[2px] h-[12%]" />
      <SideButton className="top-[58%] -right-[2px] h-[7%]" />
      <div className="absolute inset-0 rounded-[52px] p-[3px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)]" style={{ background: EDGE }}>
        <div className="size-full rounded-[49px] bg-black p-[9px]">
          <div className="relative size-full overflow-hidden rounded-[41px] bg-background">
            <StatusBar />
            <span aria-hidden className="absolute top-[11px] left-1/2 z-30 h-[30px] w-[96px] -translate-x-1/2 rounded-full bg-black" />
            {children}
            <span aria-hidden className="absolute bottom-[7px] left-1/2 z-30 h-[4px] w-[34%] -translate-x-1/2 rounded-full bg-foreground/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
