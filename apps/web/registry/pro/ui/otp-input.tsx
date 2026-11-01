"use client";

import * as React from "react";
import { useLiquidGlass, mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { glassMaterial } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const CELL_OPTICS: LiquidGlassOptions = {
  scale: -40,
  chroma: 3,
  border: 0.18,
  mapBlur: 6,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

export interface OtpInputProps extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange" | "children"> {
  /** Number of cells. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once when the last cell is filled. */
  onComplete?: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  /** Accessible name of the group. */
  label?: string;
  /** Submits the code with a form. */
  name?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function Cell({
  glass,
  ref,
  ...props
}: React.ComponentProps<"input"> & { glass?: LiquidGlassOptions | GlassPreset | false }) {
  const [node, setNode] = React.useState<HTMLInputElement | null>(null);
  useLiquidGlass(node, mergeGlass(CELL_OPTICS, glass));
  const composedRef = React.useCallback(
    (el: HTMLInputElement | null) => {
      setNode(el);
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );
  return <input ref={composedRef} {...props} />;
}

function OtpInput({
  length = 6,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onComplete,
  invalid,
  disabled,
  label = "One-time code",
  name,
  glass,
  className,
  ref,
  ...props
}: OtpInputProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = (valueProp ?? inner).replace(/\D/g, "").slice(0, length);
  const cells = React.useRef<Array<HTMLInputElement | null>>([]);
  const groupRef = React.useRef<HTMLDivElement | null>(null);

  const focusCell = (i: number) => {
    const el = cells.current[Math.max(0, Math.min(i, length - 1))];
    el?.focus();
    el?.select();
  };

  const commit = (next: string) => {
    if (next === value) return;
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  // Writes `digits` starting at cell `at`; the value stays contiguous, so a cell past the end clamps to it.
  const write = (at: number, digits: string, overwrite = true) => {
    const start = Math.min(at, value.length);
    const next = (value.slice(0, start) + digits + (overwrite ? value.slice(start + digits.length) : value.slice(start))).slice(0, length);
    commit(next);
    focusCell(Math.min(start + digits.length, length - 1));
  };

  const remove = (at: number) => {
    commit(value.slice(0, at) + value.slice(at + 1));
  };

  // Shake on the transition into the invalid state.
  React.useEffect(() => {
    const el = groupRef.current;
    if (!invalid || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anim = el.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(7px)" }, { transform: "translateX(-5px)" }, { transform: "translateX(3px)" }, { transform: "translateX(0)" }],
      { duration: 380, easing: "ease-out" },
    );
    return () => anim.cancel();
  }, [invalid]);

  const tabStop = Math.min(value.length, length - 1);

  return (
    <div
      ref={(el) => {
        groupRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      role="group"
      aria-label={label}
      data-slot="otp-input"
      data-invalid={invalid || undefined}
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      {Array.from({ length }, (_, i) => (
        <Cell
          key={i}
          glass={glass}
          ref={(el) => {
            cells.current[i] = el;
          }}
          data-slot="otp-input-cell"
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={length}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          tabIndex={i === tabStop ? 0 : -1}
          value={value[i] ?? ""}
          onFocus={(e) => {
            // Cells past the end of the code are unreachable by pointer too.
            if (i > value.length) focusCell(value.length);
            else e.currentTarget.select();
          }}
          onChange={(e) => {
            let digits = e.target.value.replace(/\D/g, "");
            // A filled cell that gained a character keeps only the newest one.
            if (value[i] && digits.length === 2) digits = digits.slice(-1);
            if (digits) write(i, digits);
          }}
          onPaste={(e) => {
            e.preventDefault();
            const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            if (digits) write(digits.length >= length ? 0 : i, digits);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              if (value[i]) remove(i);
              else if (i > 0) {
                remove(i - 1);
                focusCell(i - 1);
              }
            } else if (e.key === "Delete") {
              e.preventDefault();
              if (value[i]) remove(i);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              focusCell(i - 1);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              focusCell(Math.min(i + 1, value.length));
            } else if (e.key === "Home") {
              e.preventDefault();
              focusCell(0);
            } else if (e.key === "End") {
              e.preventDefault();
              focusCell(value.length);
            }
          }}
          className={cn(
            glassMaterial,
            "relative h-14 w-11 rounded-2xl text-center text-xl font-semibold text-foreground tabular-nums caret-transparent",
            "transition-[transform,box-shadow] duration-200 outline-none selection:bg-transparent",
            "focus-visible:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring ring-offset-background",
            "aria-invalid:ring-2 aria-invalid:ring-signal disabled:pointer-events-none disabled:opacity-50",
            "motion-reduce:transition-none motion-reduce:focus-visible:translate-y-0",
          )}
        />
      ))}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}

export { OtpInput };
