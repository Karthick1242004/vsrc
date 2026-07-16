"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { useLiquidGlass, type LiquidGlassOptions } from "vsrc/react";

import { glassMaterial } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

/**
 * Gentler optics than the engine defaults: at button scale a −112 bulge
 * smears the backdrop; a shallow, wide edge band reads as a lens instead.
 */
const BUTTON_OPTICS: LiquidGlassOptions = {
  scale: -56,
  chroma: 4,
  border: 0.16,
  mapBlur: 8,
  blur: 2,
  saturate: 1.4,
  fallbackBlur: 8,
};

const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "font-medium tracking-[-0.01em] text-foreground select-none",
    "transition-[border-color,background-color,transform] duration-200 active:scale-[0.97]",
    "outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        // Clear glass — the house material.
        default: cn(glassMaterial, "hover:border-foreground/40"),
        // Red glass for the one primary action per view (brand: #e02723 fill, cream label).
        primary: cn(
          glassMaterial,
          "border-primary/60 bg-primary/80 text-primary-foreground hover:bg-primary/90",
          // Stays red in frosted mode — the clear tint is for neutral glass only.
          "data-[vsrc-glass=frosted]:bg-primary/80",
        ),
        // No glass at all — low-emphasis chrome. Refraction is skipped, not hidden.
        ghost: "hover:bg-foreground/10",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        default: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Engine optics overrides; `false` disables refraction for this button. */
  glass?: LiquidGlassOptions | false;
}

function Button({ className, variant, size, asChild, glass, ref, ...props }: ButtonProps) {
  const localRef = React.useRef<HTMLButtonElement | null>(null);
  const optics =
    variant === "ghost" || glass === false ? false : { ...BUTTON_OPTICS, ...glass };
  useLiquidGlass(localRef, optics);
  const composedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={composedRef}
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
