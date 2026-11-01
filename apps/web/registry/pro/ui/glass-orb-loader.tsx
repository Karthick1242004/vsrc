"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const ORB_OPTICS: LiquidGlassOptions = {
  scale: -72,
  chroma: 5,
  border: 0.2,
  mapBlur: 7,
  blur: 0.5,
  saturate: 1.4,
  fallbackBlur: 2,
};

const SIZES = { sm: 56, md: 88, lg: 128 } as const;

// Plain CSS keyframes, scoped by name. Reduced motion freezes the orb at rest
// and swaps travel for a slow opacity pulse.
const KEYFRAMES = `
@keyframes vsrc-orb-orbit { from { transform: rotate(0deg) translateX(var(--orb-r)) rotate(0deg); } to { transform: rotate(360deg) translateX(var(--orb-r)) rotate(-360deg); } }
@keyframes vsrc-orb-wobble { 0%,100% { scale: 1 1; } 33% { scale: 1.14 0.9; } 66% { scale: 0.92 1.1; } }
@keyframes vsrc-orb-spin { to { transform: rotate(360deg); } }
@keyframes vsrc-orb-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
@media (prefers-reduced-motion: reduce) {
  [data-slot="glass-orb-loader"] [data-orb-motion] { animation: none !important; }
  [data-slot="glass-orb-loader"] [data-orb-pulse] { animation: vsrc-orb-pulse 2.8s ease-in-out infinite !important; }
}`;

export interface GlassOrbLoaderProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** "sm" 56px, "md" 88px, "lg" 128px, or an exact pixel size. */
  size?: "sm" | "md" | "lg" | number;
  /** Accessible name, and the type set around the ring. Defaults to "Loading". */
  label?: string;
  /** Also show `label` as visible text under the orb. */
  showLabel?: boolean;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function GlassOrbLoader({
  size = "md",
  label = "Loading",
  showLabel = false,
  glass,
  className,
  ref,
  ...props
}: GlassOrbLoaderProps) {
  const px = typeof size === "number" ? Math.max(32, size) : SIZES[size];
  const orb = Math.round(px * 0.42);
  const ringText = `${label.toUpperCase()} • ${label.toUpperCase()} • `;
  const pathId = `orb-path-${React.useId().replace(/:/g, "")}`;
  return (
    <div
      ref={ref}
      role="status"
      data-slot="glass-orb-loader"
      className={cn("inline-flex flex-col items-center gap-3", className)}
      {...props}
    >
      <style>{KEYFRAMES}</style>
      <div aria-hidden className="relative shrink-0" style={{ width: px, height: px }}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full text-foreground">
          <defs>
            <path id={pathId} d="M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0" />
          </defs>
          <g
            data-orb-motion
            style={{ transformOrigin: "50% 50%", animation: "vsrc-orb-spin 9s linear infinite" }}
          >
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1" />
            <text fontSize="7.5" fontWeight="600" letterSpacing="1" fill="currentColor" fillOpacity="0.75">
              <textPath href={`#${pathId}`} textLength="244" lengthAdjust="spacing">
                {ringText}
              </textPath>
            </text>
          </g>
        </svg>
        <div
          data-orb-motion
          className="absolute top-1/2 left-1/2"
          style={
            {
              width: orb,
              height: orb,
              marginLeft: -orb / 2,
              marginTop: -orb / 2,
              "--orb-r": `${Math.round(px * 0.2)}px`,
              animation: "vsrc-orb-orbit 3.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
            } as React.CSSProperties
          }
        >
          <GlassSurface
            glass={mergeGlass(ORB_OPTICS, glass)}
            data-slot="glass-orb-loader-orb"
            data-orb-motion
            data-orb-pulse
            className="size-full rounded-full"
            style={{ animation: "vsrc-orb-wobble 1.6s ease-in-out infinite" }}
          />
        </div>
      </div>
      {showLabel ? (
        <span aria-hidden className="text-sm text-muted-foreground">
          {label}
        </span>
      ) : null}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export { GlassOrbLoader };
