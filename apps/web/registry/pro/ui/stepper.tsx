"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { Button } from "@/registry/vsrc/ui/button";
import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

// A fixed-size lens that glides between steps by transform, so its
// displacement map is built once. It sits UNDER the step markers: it bends the
// rail and the backdrop while the numbers stay crisp.
const LENS_OPTICS: LiquidGlassOptions = {
  scale: -56,
  chroma: 4,
  border: 0.18,
  mapBlur: 6,
  blur: 0.5,
  saturate: 1.4,
  fallbackBlur: 2,
};

export interface StepperStep {
  id: string;
  /** MUI StepLabel text. */
  label: string;
  /** MUI StepLabel `optional`: the secondary line under the label. */
  optional?: string;
  content: React.ReactNode;
  /** `false` disables Next on this step until the user has what it needs. */
  canProceed?: boolean;
  /** Shown beside the disabled Next button while `canProceed` is false. */
  hint?: string;
}

export interface StepperProps {
  steps: StepperStep[];
  /** Zero-based index of the current step. */
  /** Zero-based current step, as MUI Stepper `activeStep`. */
  activeStep?: number;
  defaultActiveStep?: number;
  onActiveStepChange?: (index: number) => void;
  /** Fires when Next is pressed on the last step. */
  onComplete?: () => void;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

function Stepper({
  steps,
  activeStep,
  defaultActiveStep = 0,
  onActiveStepChange,
  onComplete,
  backLabel = "Back",
  nextLabel = "Next",
  finishLabel = "Finish",
  glass,
  className,
  ref,
}: StepperProps) {
  const [inner, setInner] = React.useState(defaultActiveStep);
  const count = steps.length;
  const current = Math.min(Math.max(activeStep ?? inner, 0), Math.max(count - 1, 0));
  const step = steps[current];
  const panelRef = React.useRef<HTMLDivElement>(null);
  const last = React.useRef(current);
  const reduced = React.useRef(false);
  const id = React.useId();

  React.useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = (index: number) => {
    const next = Math.min(Math.max(index, 0), count - 1);
    if (next === current) return;
    if (activeStep === undefined) setInner(next);
    onActiveStepChange?.(next);
  };

  // Slide the new panel in from the direction of travel, and move focus to it:
  // the Next/Back button the user just pressed may be about to disable.
  React.useEffect(() => {
    const prev = last.current;
    last.current = current;
    const panel = panelRef.current;
    if (!panel || prev === current) return;
    panel.focus({ preventScroll: true });
    if (reduced.current) return;
    const dir = current > prev ? 1 : -1;
    panel.animate(
      [
        { opacity: 0, transform: `translateX(${dir * 18}px)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: 260, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }, [current]);

  if (!step) return null;
  const isLast = current === count - 1;
  const gated = step.canProceed === false;

  return (
    <div ref={ref} data-slot="stepper" className={cn("flex w-full flex-col gap-5", className)}>
      <div className="relative" style={{ "--n": count } as React.CSSProperties}>
        {/* Rail between the first and last marker centres, filling as steps complete. */}
        <div
          aria-hidden
          className="absolute top-[23px] h-0.5 rounded-full bg-foreground/15"
          style={{ left: "calc(50% / var(--n))", right: "calc(50% / var(--n))" }}
        >
          <div
            className="h-full origin-left rounded-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ transform: `scaleX(${count > 1 ? current / (count - 1) : 1})` }}
          />
        </div>
        {/* One cell wide, so translating by index × 100% lands on the right column. */}
        <div aria-hidden className="pointer-events-none absolute top-0 left-0" style={{ width: "calc(100% / var(--n))" }}>
          <div
            className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(${current * 100}%)` }}
          >
            <GlassSurface glass={mergeGlass(LENS_OPTICS, glass)} data-slot="stepper-lens" className="mx-auto size-12 rounded-full" />
          </div>
        </div>

        <ol className="relative grid" style={{ gridTemplateColumns: "repeat(var(--n), minmax(0, 1fr))" }}>
          {steps.map((s, i) => {
            const state = i < current ? "complete" : i === current ? "current" : "upcoming";
            const body = (
              <>
                <span
                  data-slot="stepper-marker"
                  className={cn(
                    "mt-2 flex size-8 items-center justify-center rounded-full text-sm font-medium tabular-nums transition-colors duration-300",
                    state === "complete" && "bg-foreground text-background",
                    state === "current" && "bg-primary text-primary-foreground",
                    state === "upcoming" && "border border-border bg-card text-muted-foreground",
                  )}
                >
                  {state === "complete" ? <Check /> : i + 1}
                </span>
                <span className={cn("mt-2 max-w-full truncate px-1 text-xs font-medium", state === "upcoming" ? "text-muted-foreground" : "text-foreground")}>
                  {s.label}
                </span>
                {s.optional && (
                  <span className="hidden max-w-full truncate px-1 text-xs text-muted-foreground sm:block">{s.optional}</span>
                )}
                <span className="sr-only">{state === "complete" ? ", completed" : state === "upcoming" ? ", upcoming" : ""}</span>
              </>
            );
            return (
              <li
                key={s.id}
                data-slot="stepper-step"
                data-state={state}
                aria-current={state === "current" ? "step" : undefined}
                className="flex min-w-0 flex-col items-center text-center"
              >
                {state === "complete" ? (
                  <button
                    type="button"
                    onClick={() => go(i)}
                    className="flex min-w-0 max-w-full flex-col items-center rounded-xl pb-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {body}
                  </button>
                ) : (
                  <div className="flex min-w-0 max-w-full flex-col items-center pb-1">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {`Step ${current + 1} of ${count}: ${step.label}`}
      </p>

      <div
        ref={panelRef}
        id={`${id}-panel`}
        tabIndex={-1}
        role="group"
        aria-label={`Step ${current + 1}: ${step.label}`}
        data-slot="stepper-panel"
        className="rounded-2xl border border-border bg-card/80 p-5 outline-none"
      >
        {step.content}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" disabled={current === 0} onClick={() => go(current - 1)}>
          {backLabel}
        </Button>
        <div className="flex min-w-0 items-center gap-3">
          {gated && step.hint && <span className="min-w-0 truncate text-xs text-muted-foreground">{step.hint}</span>}
          <Button
            variant="primary"
            disabled={gated}
            onClick={() => (isLast ? onComplete?.() : go(current + 1))}
          >
            {isLast ? finishLabel : nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Stepper };
