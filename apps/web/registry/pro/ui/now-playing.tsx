"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const CARD_OPTICS: LiquidGlassOptions = {
  scale: -72,
  chroma: 3,
  border: 0.08,
  mapBlur: 12,
  blur: 3,
  saturate: 1.25,
  fallbackBlur: 4,
};

const SEEK_STEP = 5;

export interface NowPlayingTrack {
  title: string;
  artist: string;
  /** Seconds. */
  duration: number;
  art?: React.ReactNode;
}

export interface NowPlayingProps extends Omit<React.ComponentProps<"div">, "children"> {
  track: NowPlayingTrack;
  playing?: boolean;
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  /** Called by the previous button when less than 3s in; otherwise it restarts the track. */
  onPrevious?: () => void;
  /** Called by the next button and when a track finishes. Without it a finished track stops at 0:00. */
  onNext?: () => void;
  onSeek?: (seconds: number) => void;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function Icon({ d, filled }: { d: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="size-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const ghostButton = cn(
  "grid size-10 place-items-center rounded-full text-foreground outline-none transition-[background-color,transform] active:scale-90",
  "hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background motion-reduce:transition-none",
);

function NowPlaying({
  track,
  playing: playingProp,
  defaultPlaying = false,
  onPlayingChange,
  onPrevious,
  onNext,
  onSeek,
  glass,
  className,
  ...props
}: NowPlayingProps) {
  const { duration } = track;
  const [innerPlaying, setInnerPlaying] = React.useState(defaultPlaying);
  const playing = playingProp ?? innerPlaying;
  const setPlaying = React.useCallback(
    (next: boolean) => {
      if (playingProp === undefined) setInnerPlaying(next);
      onPlayingChange?.(next);
    },
    [playingProp, onPlayingChange],
  );
  const [time, setTime] = React.useState(0);
  const [scrubbing, setScrubbing] = React.useState(false);
  const trackKey = `${track.title}|${track.artist}|${duration}`;
  const [seenKey, setSeenKey] = React.useState(trackKey);
  if (seenKey !== trackKey) {
    setSeenKey(trackKey);
    setTime(0);
  }
  const bar = React.useRef<HTMLDivElement>(null);

  // Simulated clock: only runs while playing and not being scrubbed, and a
  // long frame gap (hidden tab) is capped so the bar never jumps.
  React.useEffect(() => {
    if (!playing || scrubbing || duration <= 0) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 250) / 1000;
      last = now;
      setTime((t) => Math.min(duration, t + dt));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, scrubbing, duration]);

  React.useEffect(() => {
    if (duration <= 0 || time < duration || scrubbing) return;
    setTime(0);
    if (onNext) onNext();
    else setPlaying(false);
  }, [time, duration, scrubbing, onNext, setPlaying]);

  const seek = (t: number) => {
    const next = clamp(t, 0, duration);
    setTime(next);
    onSeek?.(next);
  };
  const seekFromPointer = (e: React.PointerEvent) => {
    const r = bar.current?.getBoundingClientRect();
    if (r && r.width) seek(clamp((e.clientX - r.left) / r.width, 0, 1) * duration);
  };
  const progress = duration > 0 ? time / duration : 0;

  return (
    <GlassSurface
      data-slot="now-playing"
      glass={mergeGlass(CARD_OPTICS, glass)}
      className={cn("w-full max-w-sm rounded-3xl p-5 text-foreground", className)}
      {...props}
    >
      <style href="vsrc-now-playing" precedence="default">{`
        @keyframes vsrc-eq { from { transform: scaleY(0.25); } to { transform: scaleY(1); } }
        @media (prefers-reduced-motion: reduce) { [data-slot="now-playing-eq"] > span { animation: none !important; transform: scaleY(0.6) !important; } }
      `}</style>
      <div className="flex items-center gap-4">
        <div
          data-slot="now-playing-art"
          className={cn("size-16 shrink-0 overflow-hidden rounded-2xl shadow-lg transition-transform duration-500 ease-out motion-reduce:transition-none", playing ? "scale-100" : "scale-90")}
        >
          {track.art ?? <div className="size-full bg-linear-to-br from-primary to-signal" />}
        </div>
        <div aria-live="polite" className="min-w-0 flex-1">
          <p className="truncate font-display text-xl leading-tight">{track.title}</p>
          <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
        </div>
        <div aria-hidden data-slot="now-playing-eq" className="flex h-5 items-end gap-0.5">
          {[0, 0.25, 0.1, 0.4].map((delay, i) => (
            <span
              key={i}
              className="h-full w-0.5 origin-bottom rounded-full bg-foreground/70"
              style={{
                transform: "scaleY(0.25)",
                animation: `vsrc-eq ${620 + i * 90}ms ease-in-out ${delay}s infinite alternate`,
                animationPlayState: playing ? "running" : "paused",
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div
          ref={bar}
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={Math.floor(time)}
          aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
          data-slot="now-playing-scrubber"
          className="group relative flex h-6 cursor-pointer touch-none items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setScrubbing(true);
            seekFromPointer(e);
          }}
          onPointerMove={(e) => scrubbing && seekFromPointer(e)}
          onPointerUp={() => setScrubbing(false)}
          onPointerCancel={() => setScrubbing(false)}
          onKeyDown={(e) => {
            const delta = { ArrowRight: SEEK_STEP, ArrowUp: SEEK_STEP, ArrowLeft: -SEEK_STEP, ArrowDown: -SEEK_STEP, PageUp: 15, PageDown: -15 }[e.key];
            if (delta !== undefined) seek(time + delta);
            else if (e.key === "Home") seek(0);
            else if (e.key === "End") seek(duration);
            else return;
            e.preventDefault();
          }}
        >
          <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/20 transition-[height] group-hover:h-1.5 group-focus-visible:h-1.5">
            <div className="h-full origin-left rounded-full bg-foreground" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <span
            aria-hidden
            className={cn("absolute top-1/2 size-3.5 -translate-1/2 rounded-full bg-foreground shadow-md transition-transform duration-150 group-hover:scale-110 motion-reduce:transition-none", scrubbing && "scale-125")}
            style={{ left: `${progress * 100}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>{fmt(time)}</span>
          <span>-{fmt(Math.max(0, duration - time))}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous track"
          className={ghostButton}
          onClick={() => (time > 3 || !onPrevious ? seek(0) : onPrevious())}
        >
          <Icon filled d="M15 4.5v11L7.5 10 15 4.5zM5 4.5v11" />
        </button>
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background motion-reduce:transition-none"
          onClick={() => setPlaying(!playing)}
        >
          <Icon filled d={playing ? "M5.5 4h3v12h-3zM11.5 4h3v12h-3z" : "M6.5 4.5v11L15.5 10 6.5 4.5z"} />
        </button>
        <button type="button" aria-label="Next track" className={ghostButton} onClick={() => (onNext ? onNext() : seek(duration))}>
          <Icon filled d="M5 4.5v11L12.5 10 5 4.5zM15 4.5v11" />
        </button>
      </div>
    </GlassSurface>
  );
}

export { NowPlaying };
