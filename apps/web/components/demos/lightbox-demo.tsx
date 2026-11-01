"use client";

import { useId } from "react";

import { Lightbox, LightboxTrigger, type LightboxItem } from "@/registry/pro/ui/lightbox";

interface Scene {
  id: string;
  title: string;
  caption: string;
  sky: [string, string, string];
  sun: [number, number, string];
  ridges: [string, number, number][];
}

/** Layered ridgelines, deterministic so server and client markup match. */
function ridge(seed: number, base: number, amp: number) {
  const pts: string[] = [];
  for (let x = 0; x <= 600; x += 15) {
    const y = base + amp * Math.sin(x * 0.011 + seed) + (amp / 2.2) * Math.sin(x * 0.027 + seed * 2.3);
    pts.push(`${x},${Math.round(y)}`);
  }
  return `M0,400 L${pts.join(" L")} L600,400 Z`;
}

function Landscape({ scene }: { scene: Scene }) {
  const [a, b, c] = scene.sky;
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.6" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
        <radialGradient id={`${uid}-sun`}>
          <stop offset="0" stopColor={scene.sun[2]} />
          <stop offset="0.35" stopColor={scene.sun[2]} stopOpacity="0.5" />
          <stop offset="1" stopColor={scene.sun[2]} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill={`url(#${uid}-sky)`} />
      <circle cx={scene.sun[0]} cy={scene.sun[1]} r="150" fill={`url(#${uid}-sun)`} />
      <circle cx={scene.sun[0]} cy={scene.sun[1]} r="30" fill={scene.sun[2]} />
      {scene.ridges.map(([fill, base, amp], i) => (
        <path key={i} d={ridge(i * 1.7 + scene.title.length, base, amp)} fill={fill} />
      ))}
    </svg>
  );
}

const SCENES: Scene[] = [
  { id: "lb-dusk", title: "Dusk over Skye", caption: "Last light on the Cuillin ridge, 21:40.", sky: ["#2b2a5e", "#c2548a", "#f7a46a"], sun: [410, 250, "#ffd9a0"], ridges: [["#4a2a5a", 250, 30], ["#2c1e4a", 300, 26], ["#150f2e", 350, 18]] },
  { id: "lb-fjord", title: "Nærøyfjord", caption: "Still water before the ferry from Gudvangen.", sky: ["#8fb4d4", "#cfe0ea", "#f2ece0"], sun: [160, 130, "#fff6dc"], ridges: [["#7a98ac", 230, 40], ["#4f7388", 285, 34], ["#264a5c", 345, 20]] },
  { id: "lb-dunes", title: "Erg Chebbi", caption: "Morning wind sets the dune crests.", sky: ["#f3b88b", "#f6d3a6", "#fbe9cf"], sun: [470, 110, "#fff1c8"], ridges: [["#dd9a62", 255, 24], ["#c47a45", 305, 28], ["#9a5530", 360, 16]] },
  { id: "lb-pines", title: "Black Forest", caption: "Fog holding in the valley below Feldberg.", sky: ["#b7c9c0", "#dfe7df", "#f1f2ea"], sun: [300, 90, "#ffffff"], ridges: [["#8fa89a", 240, 26], ["#5c7c6c", 290, 30], ["#2d4a3d", 345, 22]] },
  { id: "lb-ember", title: "Pacaya", caption: "Basalt still warm after the night eruption.", sky: ["#14101f", "#5a1f2e", "#d8552b"], sun: [120, 280, "#ffb15a"], ridges: [["#2a1418", 270, 38], ["#1a0d10", 320, 24], ["#0b0507", 370, 14]] },
  { id: "lb-lagoon", title: "Lagoa Azul", caption: "Crater lake, São Miguel, noon.", sky: ["#4fb6d6", "#9fe0dc", "#e9f6e2"], sun: [500, 100, "#ffffff"], ridges: [["#2f9b9a", 245, 28], ["#1f7a80", 300, 24], ["#0f4f5e", 355, 18]] },
  { id: "lb-snow", title: "Lyngen Alps", caption: "Blue hour from the summit camp.", sky: ["#26356b", "#6c82b8", "#d7dff0"], sun: [330, 160, "#f2f4ff"], ridges: [["#aab8dc", 220, 44], ["#7686b6", 285, 38], ["#3b4a82", 350, 20]] },
  { id: "lb-moor", title: "Dartmoor", caption: "Heather in late September, after rain.", sky: ["#7a6a9a", "#c79aa4", "#f1cfa8"], sun: [200, 200, "#ffe6bd"], ridges: [["#8a5a78", 255, 22], ["#5e3c58", 305, 26], ["#33203a", 360, 16]] },
];

/** Gradient-and-SVG pictures used by this demo. Swap `src` for real `<img>`s in your app. */
export const ARTWORKS: LightboxItem[] = SCENES.map((s) => ({
  id: s.id,
  title: s.title,
  caption: s.caption,
  src: <Landscape scene={s} />,
}));

export function LightboxDemo() {
  return (
    <Lightbox items={ARTWORKS}>
      <div className="grid w-full max-w-xl grid-cols-4 gap-2 sm:gap-3">
        {ARTWORKS.map((item, i) => (
          <LightboxTrigger
            key={item.id}
            index={i}
            aria-label={`Open ${item.title}`}
            className="aspect-square overflow-hidden rounded-xl border border-border outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {item.src}
          </LightboxTrigger>
        ))}
      </div>
    </Lightbox>
  );
}
