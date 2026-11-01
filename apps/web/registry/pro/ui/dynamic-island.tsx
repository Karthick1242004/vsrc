"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

export type DynamicIslandState = "idle" | "call" | "timer" | "playing";
export const DYNAMIC_ISLAND_STATES: readonly DynamicIslandState[] = ["idle", "call", "timer", "playing"];

const ISLAND_OPTICS: LiquidGlassOptions = {
  scale: -48,
  chroma: 3,
  border: 0.2,
  mapBlur: 7,
  blur: 3,
  saturate: 1.3,
  fallbackBlur: 3,
};

const SIZES: Record<DynamicIslandState, { w: number; h: number }> = {
  idle: { w: 112, h: 36 },
  call: { w: 280, h: 72 },
  timer: { w: 176, h: 40 },
  playing: { w: 264, h: 68 },
};

const SPRING = "560ms cubic-bezier(0.34, 1.4, 0.5, 1)";

export interface DynamicIslandProps extends Omit<React.ComponentProps<"div">, "children"> {
  state?: DynamicIslandState;
  defaultState?: DynamicIslandState;
  onStateChange?: (state: DynamicIslandState) => void;
  caller?: { name: string; detail?: string };
  track?: { title: string; artist: string };
  glass?: LiquidGlassOptions | GlassPreset | false;
}

const iconProps = { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": true } as const;

function IslandButton({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full outline-none transition-transform active:scale-90",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        className,
      )}
      {...props}
    />
  );
}

function Equalizer({ active }: { active: boolean }) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  React.useEffect(() => {
    const host = ref.current;
    if (!active || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const runs = Array.from(host.children).map((bar, i) =>
      bar.animate([{ transform: "scaleY(0.3)" }, { transform: "scaleY(1)" }, { transform: "scaleY(0.5)" }], {
        duration: 640 + i * 120,
        delay: -i * 170,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      }),
    );
    return () => runs.forEach((run) => run.cancel());
  }, [active]);
  return (
    <span ref={ref} aria-hidden className="flex h-4 shrink-0 items-center gap-[3px]">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="h-full w-[3px] rounded-full bg-foreground" style={{ transform: "scaleY(0.6)" }} />
      ))}
    </span>
  );
}

function useElapsed(running: boolean) {
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    if (!running) return;
    const start = performance.now();
    setSeconds(0);
    const id = window.setInterval(() => setSeconds(Math.floor((performance.now() - start) / 1000)), 500);
    return () => window.clearInterval(id);
  }, [running]);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function DynamicIsland({
  state: stateProp,
  defaultState = "idle",
  onStateChange,
  caller = { name: "Maya Chen", detail: "Mobile" },
  track = { title: "Slow Light", artist: "Odette Marlowe" },
  glass,
  className,
  style,
  ref,
  ...props
}: DynamicIslandProps) {
  const [inner, setInner] = React.useState<DynamicIslandState>(defaultState);
  const state = stateProp ?? inner;
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const refocus = React.useRef(false);
  const elapsed = useElapsed(state === "timer");

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // Buttons inside the island change its state: the control that held focus goes
  // inert, so hand focus to the new layer's primary action (or the island itself).
  const go = (next: DynamicIslandState) => {
    refocus.current = true;
    if (stateProp === undefined) setInner(next);
    onStateChange?.(next);
  };

  React.useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    const root = rootRef.current;
    const target = root?.querySelector<HTMLElement>(`[data-layer="${state}"] [data-primary]`);
    (target ?? root)?.focus({ preventScroll: true });
  }, [state]);

  const message: Record<DynamicIslandState, string> = {
    idle: "Dynamic Island idle",
    call: `Incoming call from ${caller.name}`,
    timer: "Timer running",
    playing: `Now playing ${track.title} by ${track.artist}`,
  };

  const layer = (id: DynamicIslandState, children: React.ReactNode) => (
    <div
      key={id}
      data-layer={id}
      inert={state !== id}
      className={cn(
        "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 px-4",
        "transition-[opacity,filter] duration-200 motion-reduce:transition-none",
        state === id ? "opacity-100 blur-0 delay-150 duration-300" : "pointer-events-none opacity-0 blur-[3px]",
      )}
      style={{ width: SIZES[id].w, height: SIZES[id].h }}
    >
      {children}
    </div>
  );

  const size = SIZES[state];

  return (
    <GlassSurface
      ref={setRefs}
      data-slot="dynamic-island"
      data-state={state}
      glass={mergeGlass(ISLAND_OPTICS, glass)}
      tabIndex={-1}
      className={cn(
        "max-w-full rounded-full text-foreground outline-none motion-reduce:transition-none",
        "[transition:width_var(--island-spring),height_var(--island-spring)]",
        className,
      )}
      style={{ width: size.w, height: size.h, "--island-spring": SPRING, ...style } as React.CSSProperties}
      {...props}
    >
      <span role="status" className="sr-only">
        {message[state]}
      </span>

      {layer("idle", <span aria-hidden className="mx-auto size-2 rounded-full bg-foreground/40" />)}

      {layer(
        "call",
        <>
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,oklch(0.75_0.14_50),oklch(0.62_0.16_20))] text-sm font-medium text-white"
          >
            {initials(caller.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{caller.name}</span>
            <span className="block truncate text-xs text-muted-foreground">Incoming call{caller.detail ? ` · ${caller.detail}` : ""}</span>
          </span>
          <IslandButton aria-label={`Decline call from ${caller.name}`} className="bg-foreground/15" onClick={() => go("idle")}>
            <svg {...iconProps} className="size-4">
              <path d="m5 5 10 10M15 5 5 15" />
            </svg>
          </IslandButton>
          <IslandButton data-primary aria-label={`Answer call from ${caller.name}`} className="bg-primary text-primary-foreground" onClick={() => go("timer")}>
            <svg {...iconProps} className="size-4">
              <path d="M5 4h3l1.2 3.2-1.8 1.2a8 8 0 0 0 4.2 4.2l1.2-1.8L16 12v3a1.5 1.5 0 0 1-1.6 1.5A11.5 11.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
            </svg>
          </IslandButton>
        </>,
      )}

      {layer(
        "timer",
        <>
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-signal" />
          <span className="flex-1 text-sm font-medium tabular-nums">
            <span aria-hidden>{elapsed}</span>
            <span className="sr-only">Timer</span>
          </span>
          <IslandButton data-primary aria-label="Stop timer" className="size-7 bg-foreground/15" onClick={() => go("idle")}>
            <svg {...iconProps} className="size-3.5">
              <rect x="5" y="5" width="10" height="10" rx="2" fill="currentColor" stroke="none" />
            </svg>
          </IslandButton>
        </>,
      )}

      {layer(
        "playing",
        <>
          <span
            aria-hidden
            className="size-10 shrink-0 rounded-xl bg-[radial-gradient(circle_at_30%_25%,oklch(0.85_0.12_80),transparent_55%),linear-gradient(135deg,oklch(0.6_0.17_300),oklch(0.5_0.14_250))]"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{track.title}</span>
            <span className="block truncate text-xs text-muted-foreground">{track.artist}</span>
          </span>
          <Equalizer active={state === "playing"} />
          <IslandButton data-primary aria-label="Stop playback" className="bg-foreground/15" onClick={() => go("idle")}>
            <svg {...iconProps} className="size-3.5">
              <rect x="5" y="5" width="10" height="10" rx="2" fill="currentColor" stroke="none" />
            </svg>
          </IslandButton>
        </>,
      )}
    </GlassSurface>
  );
}

export { DynamicIsland };
