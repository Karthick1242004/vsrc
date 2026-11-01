"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const TOGGLE_OPTICS: LiquidGlassOptions = {
  scale: -40,
  chroma: 2,
  border: 0.22,
  mapBlur: 5,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

// Track is w-14 (56px) with 3px inset and a 24px thumb.
const TRAVEL = 24;
const INSET = 3;
const DURATION = 520;

export interface LiquidToggleProps
  extends Omit<React.ComponentProps<"button">, "onChange" | "role" | "type" | "value" | "children"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function LiquidToggle({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  glass,
  className,
  onClick,
  ref,
  ...props
}: LiquidToggleProps) {
  const [inner, setInner] = React.useState(defaultChecked);
  const controlled = checkedProp !== undefined;
  const checked = controlled ? checkedProp : inner;

  const thumbRef = React.useRef<HTMLSpanElement | null>(null);
  const animation = React.useRef<Animation | null>(null);
  const settledX = React.useRef(checked ? TRAVEL : 0);

  // Stretch and squish run on transform only, so the glass track is never resized.
  React.useEffect(() => {
    const thumb = thumbRef.current;
    const to = checked ? TRAVEL : 0;
    if (!thumb) return;
    if (settledX.current === to && !animation.current) return;
    const running = animation.current && animation.current.playState === "running";
    const from = running ? new DOMMatrix(getComputedStyle(thumb).transform).m41 : settledX.current;
    animation.current?.cancel();
    animation.current = null;
    settledX.current = to;
    if (from === to || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const d = to - from;
    const at = (t: number) => `translateX(${from + d * t}px)`;
    const anim = thumb.animate(
      [
        { transform: `${at(0)} scale(1, 1)`, offset: 0, easing: "cubic-bezier(0.3, 0, 0.2, 1)" },
        { transform: `${at(0.4)} scale(1.55, 0.74)`, offset: 0.34 },
        { transform: `${at(0.88)} scale(1.18, 0.9)`, offset: 0.66, easing: "cubic-bezier(0.2, 0, 0.3, 1)" },
        { transform: `${at(1)} scale(0.9, 1.12)`, offset: 0.84 },
        { transform: `${at(1)} scale(1, 1)`, offset: 1 },
      ],
      { duration: DURATION, easing: "linear" },
    );
    animation.current = anim;
    anim.onfinish = () => {
      if (animation.current === anim) animation.current = null;
    };
  }, [checked]);

  React.useEffect(() => () => animation.current?.cancel(), []);

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const next = !checked;
    if (!controlled) setInner(next);
    onCheckedChange?.(next);
  };

  return (
    <GlassSurface asChild glass={mergeGlass(TOGGLE_OPTICS, glass)}>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        data-slot="liquid-toggle"
        data-state={checked ? "checked" : "unchecked"}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "group relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full",
          "transition-colors duration-300 outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:border-primary/60 data-[state=checked]:bg-primary/80",
          className,
        )}
        {...props}
      >
        <span
          ref={thumbRef}
          data-slot="liquid-toggle-thumb"
          aria-hidden
          className="pointer-events-none absolute top-1/2 -mt-3 block size-6"
          style={{ left: INSET, transform: `translateX(${checked ? TRAVEL : 0}px)` }}
        >
          <span
            className={cn(
              "block size-full rounded-full bg-foreground shadow-[0_1px_4px_rgb(0_0_0/0.4)]",
              "transition-transform duration-150 ease-out motion-reduce:transition-none",
              "group-active:scale-x-110 group-active:scale-y-90",
            )}
          />
        </span>
      </button>
    </GlassSurface>
  );
}

export { LiquidToggle };
