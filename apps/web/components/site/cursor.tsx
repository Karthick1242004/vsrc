"use client";

import * as React from "react";

import { Monogram } from "@/components/site/monogram";
import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { Switch } from "@/registry/vsrc/ui/switch";

/**
 * Site-wide custom cursor, fine pointers only. Two modes:
 * - mark (default): the -/ monogram glides behind the pointer, tilting with
 *   horizontal velocity — the brand as a cursor.
 * - lens (toggle on): a round glass surface running the real engine, so the
 *   page visibly bends inside the cursor (frosted on WebKit, like any glass).
 */
const CursorContext = React.createContext<{
  lens: boolean;
  setLens: (v: boolean) => void;
  active: boolean;
}>({ lens: false, setLens: () => {}, active: false });

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = React.useState(false);
  const [lens, setLensState] = React.useState(false);

  React.useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setActive(true);
    setLensState(localStorage.getItem("vsrc-cursor-lens") === "1");
  }, []);

  const setLens = React.useCallback((v: boolean) => {
    setLensState(v);
    localStorage.setItem("vsrc-cursor-lens", v ? "1" : "0");
  }, []);

  React.useEffect(() => {
    document.documentElement.toggleAttribute("data-cursor", active);
    return () => document.documentElement.removeAttribute("data-cursor");
  }, [active]);

  return (
    <CursorContext.Provider value={{ lens, setLens, active }}>
      {children}
      {active && <CursorFollower lens={lens} />}
    </CursorContext.Provider>
  );
}

function CursorFollower({ lens }: { lens: boolean }) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = -100;
    let ty = -100;
    let x = tx;
    let y = ty;
    let tilt = 0;
    const move = (e: PointerEvent) => {
      tilt = Math.max(-22, Math.min(22, (e.clientX - tx) * 1.4));
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      tilt *= 0.9;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${lens ? 0 : tilt}deg)`;
      raf = requestAnimationFrame(loop);
    };
    const hide = () => {
      tx = ty = -100;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
  }, [lens]);

  return (
    <div ref={ref} className="pointer-events-none fixed top-0 left-0 z-100 will-change-transform">
      {lens ? (
        <GlassSurface
          // Key remounts the surface so the engine rebuilds for the circle.
          key="lens"
          glass={{ scale: -48, chroma: 4, border: 0.22, mapBlur: 8, blur: 2, saturate: 1.5, fallbackBlur: 2 }}
          className="size-16 rounded-full"
        />
      ) : (
        <span className="flex items-center text-foreground mix-blend-difference">
          <Monogram className="size-6" />
        </span>
      )}
    </div>
  );
}

export function CursorToggle() {
  const { lens, setLens, active } = React.useContext(CursorContext);
  if (!active) return null;
  return (
    <label className="flex items-center gap-2 px-2">
      <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">lens</span>
      <Switch checked={lens} onCheckedChange={setLens} aria-label="Toggle glass lens cursor" />
    </label>
  );
}
