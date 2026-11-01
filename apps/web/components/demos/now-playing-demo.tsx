"use client";

import { useState } from "react";

import { NowPlaying, type NowPlayingTrack } from "@/registry/pro/ui/now-playing";

function Sleeve({ a, b, c, shape }: { a: string; b: string; c: string; shape: "sun" | "rings" | "bars" | "tide" }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <rect width="100" height="100" fill={a} />
      <circle cx="30" cy="25" r="70" fill={b} opacity="0.55" />
      <circle cx="85" cy="95" r="55" fill={c} opacity="0.7" />
      {shape === "sun" && <circle cx="50" cy="52" r="20" fill="#fff4d6" opacity="0.92" />}
      {shape === "rings" &&
        [12, 22, 32].map((r) => <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />)}
      {shape === "bars" &&
        [14, 30, 46, 62, 78].map((x, i) => <rect key={x} x={x} y={70 - (i % 3) * 14 - 18} width="8" height={30 + (i % 3) * 14} rx="4" fill="#fff" opacity="0.85" />)}
      {shape === "tide" && <path d="M0 62 Q 25 42 50 62 T 100 62 V100 H0Z M0 76 Q 25 58 50 76 T 100 76" fill="#fff" opacity="0.35" />}
    </svg>
  );
}

/** Album sleeves drawn from gradients and SVG; pass your own node as `track.art`. */
export const ARTWORKS = {
  tides: <Sleeve a="#1d2b64" b="#f8a35e" c="#e0457b" shape="sun" />,
  halo: <Sleeve a="#0f2027" b="#3fb6a8" c="#7b4bd8" shape="rings" />,
  levels: <Sleeve a="#2b1055" b="#ff6a88" c="#ffb347" shape="bars" />,
  harbour: <Sleeve a="#0b3d4f" b="#5fd0c5" c="#1f6fb2" shape="tide" />,
};

const PLAYLIST: NowPlayingTrack[] = [
  { title: "Low Tide, Lisbon", artist: "Marta Oliveira", duration: 214, art: ARTWORKS.tides },
  { title: "Halogen Hours", artist: "Pale Meridian", duration: 187, art: ARTWORKS.halo },
  { title: "Signal Fade", artist: "Odd Fellows Club", duration: 243, art: ARTWORKS.levels },
  { title: "Harbour Lights", artist: "Ines Carvalho", duration: 198, art: ARTWORKS.harbour },
];

export function NowPlayingDemo() {
  const [index, setIndex] = useState(0);
  const step = (d: number) => setIndex((i) => (i + d + PLAYLIST.length) % PLAYLIST.length);
  const track = PLAYLIST[index] ?? PLAYLIST[0]!;
  return (
    <div className="w-[min(calc(100vw-6rem),24rem)]">
      <NowPlaying track={track} defaultPlaying onPrevious={() => step(-1)} onNext={() => step(1)} />
    </div>
  );
}
