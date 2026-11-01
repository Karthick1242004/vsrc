"use client";

import { useId } from "react";

import { DepthCarousel, type DepthCarouselItem } from "@/registry/pro/ui/depth-carousel";

interface Poster {
  title: string;
  caption: string;
  from: string;
  mid: string;
  to: string;
  shape: "orb" | "arch" | "stripes" | "wave" | "peak";
}

function PosterArt({ p }: { p: Poster }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.from} />
          <stop offset="0.55" stopColor={p.mid} />
          <stop offset="1" stopColor={p.to} />
        </linearGradient>
        <radialGradient id={`${uid}-r`} cx="0.3" cy="0.25" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${uid}-g)`} />
      <rect width="200" height="240" fill={`url(#${uid}-r)`} />
      {p.shape === "orb" && <circle cx="100" cy="110" r="52" fill="#fff" opacity="0.85" />}
      {p.shape === "arch" && <path d="M50 200V110a50 50 0 0 1 100 0v90z" fill="#fff" opacity="0.8" />}
      {p.shape === "stripes" &&
        [0, 1, 2, 3, 4].map((i) => <rect key={i} x={24 + i * 34} y={40 + (i % 2) * 20} width="18" height={150 - (i % 3) * 20} rx="9" fill="#fff" opacity="0.8" />)}
      {p.shape === "wave" && <path d="M0 150 Q 50 100 100 150 T 200 150 V240 H0Z M0 180 Q 50 140 100 180 T 200 180" fill="#fff" opacity="0.4" />}
      {p.shape === "peak" && <path d="M0 220 L70 90 L110 160 L140 110 L200 220Z" fill="#fff" opacity="0.75" />}
    </svg>
  );
}

const POSTERS: Poster[] = [
  { title: "Golden Hour", caption: "Lisbon rooftops, 19:12", from: "#ff9966", mid: "#ff5e62", to: "#7b2ff7", shape: "orb" },
  { title: "Open Arch", caption: "Matera, Basilicata", from: "#f9d423", mid: "#ff8c42", to: "#c33764", shape: "arch" },
  { title: "Night Signal", caption: "Tokyo, Shibuya crossing", from: "#0f2027", mid: "#2c5364", to: "#6a3093", shape: "stripes" },
  { title: "Slow Water", caption: "Lake Bled at dawn", from: "#2193b0", mid: "#6dd5ed", to: "#cfe8ff", shape: "wave" },
  { title: "North Face", caption: "Dolomites, Tre Cime", from: "#355c7d", mid: "#6c5b7b", to: "#f67280", shape: "peak" },
];

/** Gradient-and-SVG poster art for the demo; any node works as `art`. */
export const ARTWORKS: DepthCarouselItem[] = POSTERS.map((p) => ({
  id: p.title.toLowerCase().replace(/\s+/g, "-"),
  title: p.title,
  caption: p.caption,
  art: <PosterArt p={p} />,
}));

export function DepthCarouselDemo() {
  return (
    <div className="w-[min(calc(100vw-6rem),40rem)]">
      <DepthCarousel items={ARTWORKS} label="Featured photographs" defaultValue={1} />
    </div>
  );
}
