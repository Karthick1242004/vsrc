"use client";

import { useId } from "react";

import { CardStack, type CardStackItem } from "@/registry/pro/ui/card-stack";

interface Stay {
  title: string;
  subtitle: string;
  sky: [string, string, string];
  accent: string;
  shape: "cabin" | "tower" | "dome" | "pier" | "terrace";
}

function StayArt({ s }: { s: Stay }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-s`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={s.sky[0]} />
          <stop offset="0.55" stopColor={s.sky[1]} />
          <stop offset="1" stopColor={s.sky[2]} />
        </linearGradient>
        <filter id={`${uid}-n`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0" />
        </filter>
      </defs>
      <rect width="200" height="250" fill={`url(#${uid}-s)`} />
      <circle cx="140" cy="70" r="26" fill={s.accent} opacity="0.9" />
      <circle cx="140" cy="70" r="60" fill={s.accent} opacity="0.18" />
      <path d="M0 170 Q 50 140 100 165 T 200 150 V250 H0Z" fill="#000" opacity="0.18" />
      {s.shape === "cabin" && <path d="M55 175 L100 120 L145 175 V215 H55Z M92 215 v-26 h16 v26" fill="#1b1a24" opacity="0.88" fillRule="evenodd" />}
      {s.shape === "tower" && <path d="M82 215 V110 L100 84 L118 110 V215Z M90 130h20M90 150h20M90 170h20" fill="#1b1a24" stroke={s.accent} strokeOpacity="0.5" opacity="0.9" />}
      {s.shape === "dome" && <path d="M50 215 V170 a50 50 0 0 1 100 0 V215Z" fill="#1b1a24" opacity="0.88" />}
      {s.shape === "pier" && <path d="M0 175 H200 V190 H0Z M30 190v30M80 190v30M130 190v30M175 190v30" stroke="#1b1a24" strokeWidth="6" opacity="0.88" />}
      {s.shape === "terrace" && <path d="M30 215 V190 H80 V165 H130 V140 H175 V215Z" fill="#1b1a24" opacity="0.88" />}
      <rect width="200" height="250" filter={`url(#${uid}-n)`} />
    </svg>
  );
}

const STAYS: Stay[] = [
  { title: "Fjord Cabin", subtitle: "Flåm, Norway · €168 / night", sky: ["#3a5a8c", "#8fb0c9", "#f0d9b5"], accent: "#fff3cf", shape: "cabin" },
  { title: "Lighthouse Loft", subtitle: "Cornwall, UK · €142 / night", sky: ["#ff8a65", "#ffb08a", "#ffe0c2"], accent: "#fff7e6", shape: "tower" },
  { title: "Cave Dome", subtitle: "Cappadocia, Türkiye · €96 / night", sky: ["#6a3d8f", "#d6678a", "#ffc58a"], accent: "#ffe9b0", shape: "dome" },
  { title: "Stilt House", subtitle: "Koh Lanta, Thailand · €74 / night", sky: ["#0f766e", "#5eead4", "#fef3c7"], accent: "#fffbe0", shape: "pier" },
  { title: "Terrace Studio", subtitle: "Valparaíso, Chile · €58 / night", sky: ["#1e3a8a", "#6d83d6", "#f7b4a0"], accent: "#ffe3c4", shape: "terrace" },
  { title: "Birch Hut", subtitle: "Lapland, Finland · €121 / night", sky: ["#172554", "#4c63b6", "#c7d2fe"], accent: "#e8f0ff", shape: "cabin" },
];

/** Gradient-and-SVG stays for the demo; `art` accepts any node, including `<img>`. */
export const ARTWORKS: CardStackItem[] = STAYS.map((s) => ({
  id: s.title.toLowerCase().replace(/\s+/g, "-"),
  title: s.title,
  subtitle: s.subtitle,
  art: <StayArt s={s} />,
}));

export function CardStackDemo() {
  return <CardStack items={ARTWORKS} />;
}
