"use client";

import * as React from "react";

import { MobileTabBar, type MobileTabBarItem } from "@/registry/pro/ui/mobile-tab-bar";

const icon = (d: string) => (
  <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const ITEMS: MobileTabBarItem[] = [
  { value: "home", label: "Home", icon: icon("M3.5 10 11 3.5 18.5 10v8a1 1 0 0 1-1 1H13v-6H9v6H4.5a1 1 0 0 1-1-1v-8Z") },
  { value: "explore", label: "Explore", icon: icon("M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.2-11.2-1.6 4.8-4.8 1.6 1.6-4.8 4.8-1.6Z") },
  { value: "inbox", label: "Inbox", badge: 3, icon: icon("M3 12.5 5.5 5h11l2.5 7.5v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4Zm0 0h5l1 2.5h4l1-2.5h5") },
  { value: "profile", label: "Profile", icon: icon("M11 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-7 7.5c.8-3.2 3.5-5 7-5s6.2 1.8 7 5") },
];

const TITLES: Record<string, string> = { home: "Good evening, Ines", explore: "Explore", inbox: "Inbox", profile: "Profile" };

const POSTS = [
  { who: "Lena Voss", what: "Golden hour over the Alfama", tone: "from-amber-300 via-orange-400 to-rose-500" },
  { who: "Kofi Mensah", what: "Tide pools, Big Sur", tone: "from-sky-300 via-cyan-400 to-emerald-500" },
  { who: "Aiko Tanaka", what: "Night market, Taipei", tone: "from-fuchsia-400 via-purple-500 to-indigo-600" },
  { who: "Mateo Ruiz", what: "Salt flats at dawn", tone: "from-rose-200 via-sky-300 to-violet-400" },
  { who: "Sana Qureshi", what: "First snow in Hunza", tone: "from-slate-200 via-sky-300 to-blue-500" },
];

function Feed() {
  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {POSTS.map((p) => (
        <div key={p.who} className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className={`h-40 bg-gradient-to-br ${p.tone}`}>
            <div className="size-full bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.55),transparent_45%)]" />
          </div>
          <div className="p-3">
            <p className="text-sm font-semibold text-foreground">{p.what}</p>
            <p className="text-xs text-muted-foreground">{p.who}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MobileTabBarDemo() {
  const [tab, setTab] = React.useState("home");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Two stacked copies drift up by exactly one copy, so the loop is seamless.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anim = el.animate([{ transform: "translateY(0)" }, { transform: "translateY(-50%)" }], {
      duration: 38000,
      iterations: Infinity,
    });
    return () => anim.cancel();
  }, []);

  return (
    <div
      data-slot="phone-frame"
      className="relative h-[540px] w-full max-w-[320px] overflow-hidden rounded-[44px] border-[6px] border-foreground/80 bg-background shadow-xl"
    >
      <div className="absolute inset-x-0 top-0 z-10 px-5 pt-7 pb-3">
        <h3 className="font-display text-3xl text-foreground">{TITLES[tab]}</h3>
      </div>
      <div className="absolute inset-0 overflow-hidden pt-20" aria-hidden>
        <div ref={scrollRef} className="will-change-transform">
          <Feed />
          <Feed />
        </div>
      </div>
      <MobileTabBar
        aria-label="Demo app"
        items={ITEMS}
        value={tab}
        onValueChange={setTab}
        className="absolute inset-x-3 bottom-3 z-10 w-auto"
      />
    </div>
  );
}
