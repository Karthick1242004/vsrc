"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const GOOEY_OPTICS: LiquidGlassOptions = {
  scale: -52,
  chroma: 4,
  border: 0.16,
  mapBlur: 7,
  blur: 2,
  saturate: 1.4,
  fallbackBlur: 2,
};

const faceVariants = cva(
  cn(
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "font-medium tracking-[-0.01em] text-foreground select-none",
    "transition-[border-color,background-color,transform] duration-200 active:scale-[0.97]",
    "outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default: "hover:border-foreground/40",
        primary: cn(
          "border-primary/60 bg-primary/80 text-primary-foreground hover:bg-primary/90",
          "data-[vsrc-glass=frosted]:bg-primary/80",
        ),
      },
      size: {
        sm: "h-8 px-4 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** Blobs bud from the face edge: position in %, travel in px, size in px, stagger in ms. */
const BLOBS = [
  { left: "18%", top: "0%", tx: "-10px", ty: "-14px", size: 14, delay: 0 },
  { left: "52%", top: "-4%", tx: "4px", ty: "-18px", size: 18, delay: 60 },
  { left: "86%", top: "6%", tx: "14px", ty: "-10px", size: 12, delay: 120 },
  { left: "92%", top: "70%", tx: "18px", ty: "8px", size: 14, delay: 40 },
  { left: "40%", top: "96%", tx: "-4px", ty: "16px", size: 16, delay: 100 },
  { left: "6%", top: "76%", tx: "-16px", ty: "10px", size: 12, delay: 160 },
] as const;

export interface GooeyGlassButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "primary";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  /** Engine optics for the button face; `false` disables refraction. The goo layer is never glass. */
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function GooeyGlassButton({
  variant = "default",
  size = "md",
  asChild,
  glass,
  className,
  children,
  ref,
  ...props
}: GooeyGlassButtonProps) {
  // The goo filter lives on a separate decorative layer behind the face. The
  // face is a plain glass button: filtering the glass itself would blur its
  // text and break the refraction.
  const filterId = `goo-${React.useId().replace(/:/g, "")}`;
  const Comp = asChild ? Slot : "button";
  return (
    <span
      data-slot="gooey-glass-button-root"
      data-disabled={props.disabled ? "" : undefined}
      className="group/goo relative inline-flex"
    >
      <svg aria-hidden focusable="false" className="pointer-events-none absolute size-0">
        <defs>
          <filter id={filterId} x="-40%" y="-120%" width="180%" height="340%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
            />
          </filter>
        </defs>
      </svg>
      <span
        aria-hidden
        data-slot="gooey-glass-button-goo"
        style={{ filter: `url(#${filterId})` }}
        className={cn(
          "pointer-events-none absolute inset-0 opacity-45 motion-reduce:hidden",
          "group-data-[disabled]/goo:hidden",
          variant === "primary" ? "text-primary" : "text-foreground",
        )}
      >
        <span
          className={cn(
            "absolute inset-[3px] rounded-full bg-current",
            "transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            "group-hover/goo:scale-x-[1.03] group-active/goo:scale-[0.96]",
          )}
        />
        {BLOBS.map((blob, index) => (
          <span
            key={index}
            style={
              {
                left: blob.left,
                top: blob.top,
                width: blob.size,
                height: blob.size,
                marginLeft: -blob.size / 2,
                marginTop: -blob.size / 2,
                "--tx": blob.tx,
                "--ty": blob.ty,
                transitionDelay: `${blob.delay}ms`,
              } as React.CSSProperties
            }
            className={cn(
              "absolute rounded-full bg-current scale-[0.3]",
              "transition-[translate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              "group-hover/goo:translate-x-(--tx) group-hover/goo:translate-y-(--ty) group-hover/goo:scale-100",
              "group-has-[:focus-visible]/goo:translate-x-(--tx) group-has-[:focus-visible]/goo:translate-y-(--ty) group-has-[:focus-visible]/goo:scale-100",
              // Pressing pulls the blobs back into the body, so they merge.
              "group-active/goo:translate-x-[calc(var(--tx)*0.2)] group-active/goo:translate-y-[calc(var(--ty)*0.2)] group-active/goo:scale-[0.7]",
            )}
          />
        ))}
      </span>
      <GlassSurface asChild glass={mergeGlass(GOOEY_OPTICS, glass)} className={cn(faceVariants({ variant, size }), className)}>
        <Comp ref={ref} data-slot="gooey-glass-button" {...props}>
          {children}
        </Comp>
      </GlassSurface>
    </span>
  );
}

export { GooeyGlassButton };
