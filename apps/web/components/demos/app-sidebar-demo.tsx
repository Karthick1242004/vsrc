"use client";

import * as React from "react";

import { Photo } from "@/components/demos/photo";
import { AppSidebar, SidebarProvider, type AppSidebarGroup } from "@/registry/pro/ui/app-sidebar";

const icon = (d: string) => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const GROUPS: AppSidebarGroup[] = [
  {
    label: "Workspace",
    items: [
      { value: "overview", label: "Overview", icon: icon("M2.5 8 9 2.5 15.5 8v6.5a1 1 0 0 1-1 1h-3v-5h-5v5h-3a1 1 0 0 1-1-1V8Z") },
      { value: "projects", label: "Projects", icon: icon("M2.5 5.5a1.5 1.5 0 0 1 1.5-1.5h3l1.5 1.5H14a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 14 14.5H4A1.5 1.5 0 0 1 2.5 13V5.5Z") },
      { value: "inbox", label: "Inbox", badge: 4, icon: icon("M2.5 10.5 4.5 4h9l2 6.5v3a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-3Zm0 0H6l1 2h4l1-2h3.5") },
    ],
  },
  {
    label: "Insights",
    items: [
      { value: "analytics", label: "Analytics", icon: icon("M3 14.5V8m4.5 6.5V4M12 14.5v-5m3 5H2.5") },
      { value: "billing", label: "Billing", badge: "New", icon: icon("M2.5 6.5a1.5 1.5 0 0 1 1.5-1.5h10a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5v-6ZM2.5 8.5h13") },
      { value: "settings", label: "Settings", icon: icon("M9 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM9 2v1.8M9 14.2V16M2 9h1.8M14.2 9H16M4 4l1.3 1.3M12.7 12.7 14 14M14 4l-1.3 1.3M5.3 12.7 4 14") },
    ],
  },
];

const STATS = [
  { label: "Monthly revenue", value: "$48,210" },
  { label: "Active seats", value: "1,284" },
  { label: "Churn", value: "1.8%" },
];

export function AppSidebarDemo() {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = React.useState(false);
  const [value, setValue] = React.useState("overview");

  // Narrow frames (phones) start on the icon rail so the content keeps room.
  // Layout effect: collapse before first paint, not as a visible animation on load.
  React.useLayoutEffect(() => {
    if (frameRef.current && frameRef.current.offsetWidth < 520) setCollapsed(true);
  }, []);

  const current = GROUPS.flatMap((g) => g.items).find((i) => i.value === value);

  return (
    <div ref={frameRef} data-demo-frame className="relative h-[420px] w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-background">
      {/* A real photo behind the app, so the glass sidebar has something to bend. */}
      <div aria-hidden className="absolute inset-0 opacity-70">
        <Photo name="valparaiso" alt="" sizes="768px" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-background/45" />
      <SidebarProvider open={!collapsed} onOpenChange={(open) => setCollapsed(!open)}>

      <AppSidebar
        value={value}
        onValueChange={setValue}
        groups={GROUPS}
        header={{
          title: "Northwind",
          logo: (
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-display text-lg text-primary-foreground">N</span>
          ),
        }}
        user={{
          name: "Maya Okafor",
          detail: "Admin",
          avatar: <span className="grid size-8 place-items-center rounded-full bg-foreground/15 text-xs font-semibold text-foreground">MO</span>,
        }}
        className="absolute inset-y-3 left-3 h-auto"
      />
      </SidebarProvider>

      {/* Main starts past whichever width the sidebar has right now (rail 72 or panel 240, plus its 12px inset). */}
      <main
        className="absolute inset-y-0 right-0 overflow-hidden p-6 pl-8 transition-[left] duration-[380ms] ease-out motion-reduce:transition-none"
        style={{ left: collapsed ? 96 : 264 }}
      >
        <h3 className="font-display text-3xl text-foreground">{current?.label}</h3>
        <p className="mt-1 text-sm text-foreground/80">Updated 4 minutes ago</p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card/80 p-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-semibold tabular-nums text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 hidden h-28 items-end gap-2 rounded-2xl bg-card/80 p-4 sm:flex">
          {[40, 64, 52, 80, 70, 96, 84, 100].map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} className="flex-1 rounded-md bg-foreground/70 last:bg-primary" />
          ))}
        </div>
      </main>
    </div>
  );
}
