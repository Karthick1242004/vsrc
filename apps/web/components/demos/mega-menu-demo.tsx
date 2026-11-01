"use client";

import { MegaMenu, type MegaMenuSection } from "@/registry/pro/ui/mega-menu";

const icon = (d: string) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const SECTIONS: MegaMenuSection[] = [
  {
    label: "Product",
    columns: [
      {
        title: "Build",
        links: [
          { label: "Workflows", href: "#mega-menu", description: "Chain approvals and handoffs without code.", icon: icon("M3 4h4v3H3zM9 9h4v3H9zM7 5.5h2.5v5") },
          { label: "Forms", href: "#mega-menu", description: "Collect structured answers from anyone.", icon: icon("M4 3h8v10H4zM6 6h4M6 8.5h4M6 11h2") },
          { label: "Automations", href: "#mega-menu", description: "Run tasks on a schedule or a trigger.", icon: icon("M8.5 2 4 9h3.5L7 14l5-7H8.5z") },
        ],
      },
      {
        title: "Operate",
        links: [
          { label: "Insights", href: "#mega-menu", description: "Dashboards that update as you work.", icon: icon("M3 13V8M8 13V3M13 13V6") },
          { label: "Permissions", href: "#mega-menu", description: "Roles for teams, clients and contractors.", icon: icon("M8 2 3 4v4c0 3 2 5 5 6 3-1 5-3 5-6V4z") },
          { label: "Audit log", href: "#mega-menu", description: "Every change, with who and when.", icon: icon("M8 4v4l2.5 1.5M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12") },
        ],
      },
    ],
    featured: {
      title: "What shipped in October",
      description: "Branching workflows and a faster editor.",
      href: "#mega-menu",
    },
  },
  {
    label: "Resources",
    columns: [
      {
        title: "Learn",
        links: [
          { label: "Documentation", href: "#mega-menu", description: "Guides and the full API reference.", icon: icon("M4 2.5h6l2 2V13.5H4zM6 7h4M6 9.5h4") },
          { label: "Templates", href: "#mega-menu", description: "Start from a proven setup.", icon: icon("M3 3h10v4H3zM3 9h4v4H3zM9 9h4v4H9z") },
        ],
      },
      {
        title: "Community",
        links: [
          { label: "Customer stories", href: "#mega-menu", description: "How teams ship with Lumen.", icon: icon("M3 4h10v7H8l-3 2.5V11H3z") },
          { label: "Events", href: "#mega-menu", description: "Workshops, talks and office hours.", icon: icon("M3 5h10v8H3zM3 8h10M6 3v3M10 3v3") },
        ],
      },
    ],
  },
  { label: "Pricing", href: "#mega-menu" },
];

export function MegaMenuDemo() {
  return (
    <div
      data-demo="mega-menu"
      className="relative flex h-[480px] w-full max-w-3xl items-start justify-center overflow-hidden rounded-3xl border border-border bg-background/40 p-2 sm:h-[360px] sm:p-4"
    >
      <MegaMenu aria-label="Product site" sections={SECTIONS} />
    </div>
  );
}
