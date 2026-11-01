"use client";

import * as React from "react";
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp";
import { useLiquidGlass, mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { glassMaterial } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const CELL_OPTICS: LiquidGlassOptions = {
  scale: -40,
  chroma: 3,
  border: 0.18,
  mapBlur: 6,
  blur: 0.5,
  saturate: 1.3,
  fallbackBlur: 2,
};

type GlassProp = LiquidGlassOptions | GlassPreset | false;

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
  /** Accessible name of the field. */
  label?: string;
  /** Submits the code with a form. */
  name?: string;
  glass?: GlassProp;
}

/** One visual cell. input-otp owns the single real input; cells only draw its state. */
function Cell({ index, invalid, glass }: { index: number; invalid?: boolean; glass?: GlassProp }) {
  const { slots } = React.useContext(OTPInputContext);
  const slot = slots[index];
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  useLiquidGlass(node, mergeGlass(CELL_OPTICS, glass));
  return (
    <div
      ref={setNode}
      data-slot="otp-input-cell"
      data-active={slot?.isActive || undefined}
      className={cn(
        glassMaterial,
        "relative grid h-14 w-11 min-w-0 shrink place-items-center rounded-2xl text-xl font-semibold text-foreground tabular-nums",
        "transition-[transform,box-shadow] duration-200 motion-reduce:transition-none",
        "data-[active]:-translate-y-0.5 data-[active]:ring-2 data-[active]:ring-ring motion-reduce:data-[active]:translate-y-0",
        invalid && "ring-2 ring-signal",
      )}
    >
      {slot?.char}
      {slot?.hasFakeCaret && (
        <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="h-6 w-px animate-pulse bg-foreground motion-reduce:animate-none" />
        </span>
      )}
    </div>
  );
}

/** One-time code field on input-otp (the library behind shadcn's InputOTP), with glass cells. */
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
  const value = valueProp ?? inner;
  const groupRef = React.useRef<HTMLDivElement | null>(null);

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

  return (
    <div
      ref={(el) => {
        groupRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      data-slot="otp-input"
      data-invalid={invalid || undefined}
      className={cn("inline-flex max-w-full", className)}
      {...props}
    >
      <OTPInput
        maxLength={length}
        value={value}
        onChange={(next) => {
          if (valueProp === undefined) setInner(next);
          onValueChange?.(next);
        }}
        onComplete={(code: string) => onComplete?.(code)}
        pattern={REGEXP_ONLY_DIGITS}
        inputMode="numeric"
        autoComplete="one-time-code"
        disabled={disabled}
        name={name}
        aria-label={label}
        aria-invalid={invalid || undefined}
        containerClassName="flex min-w-0 items-center gap-2 has-[:disabled]:opacity-50"
      >
        {Array.from({ length }, (_, i) => (
          <Cell key={i} index={i} invalid={invalid} glass={glass} />
        ))}
      </OTPInput>
    </div>
  );
}

export { OtpInput };
