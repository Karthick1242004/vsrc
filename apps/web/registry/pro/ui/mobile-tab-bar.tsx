"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const BAR_OPTICS: LiquidGlassOptions = {
  scale: -48,
  chroma: 3,
  border: 0.16,
  mapBlur: 7,
  blur: 0.5,
  saturate: 1.35,
  fallbackBlur: 3,
};

export interface MobileTabBarItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  /** Unread count or short label shown on the icon. */
  badge?: string | number;
  href?: string;
}

export interface MobileTabBarProps extends Omit<React.ComponentProps<"nav">, "children" | "defaultValue" | "onChange"> {
  items: MobileTabBarItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function MobileTabBar({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  glass,
  className,
  ref,
  "aria-label": ariaLabel = "Main",
  ...props
}: MobileTabBarProps) {
  const [inner, setInner] = React.useState(defaultValue ?? items[0]?.value ?? "");
  const value = valueProp ?? inner;
  const count = Math.max(items.length, 1);
  const index = Math.max(
    items.findIndex((i) => i.value === value),
    0,
  );

  const choose = (next: string) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };

  return (
    <GlassSurface asChild glass={mergeGlass(BAR_OPTICS, glass)}>
      <nav
        ref={ref}
        data-slot="mobile-tab-bar"
        aria-label={ariaLabel}
        className={cn("relative w-full rounded-[28px] bg-background/45 p-1.5", className)}
        {...props}
      >
        {/* The lens is one element that slides on transform; every tab is 1/count wide, so no measuring. */}
        <span
          aria-hidden
          data-slot="mobile-tab-bar-lens"
          style={{
            width: `calc((100% - 12px) / ${count})`,
            transform: `translateX(${index * 100}%)`,
          }}
          className={cn(
            "pointer-events-none absolute inset-y-1.5 left-1.5 rounded-[22px] bg-foreground/15",
            "shadow-[inset_0_1px_0_rgb(255_255_255/0.45),inset_0_-1px_0_rgb(0_0_0/0.08),0_4px_14px_rgb(0_0_0/0.12)]",
            "transition-transform duration-[520ms] ease-[cubic-bezier(0.34,1.4,0.64,1)] motion-reduce:transition-none",
          )}
        />
        <ul className="relative grid list-none" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
          {items.map((item) => {
            const active = item.value === value;
            const Comp = item.href ? "a" : "button";
            return (
              <li key={item.value} className="flex">
                <Comp
                  data-slot="mobile-tab-bar-item"
                  {...(item.href ? { href: item.href } : { type: "button" as const })}
                  aria-current={active ? "page" : undefined}
                  onClick={(e: React.MouseEvent) => {
                    if (item.href) e.preventDefault();
                    choose(item.value);
                  }}
                  className={cn(
                    "group flex h-14 w-full flex-col items-center justify-center gap-0.5 rounded-[22px] text-[11px] font-medium",
                    "transition-colors duration-300 outline-none select-none",
                    "focus-visible:ring-2 focus-visible:ring-ring ring-offset-background",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "relative flex size-6 items-center justify-center [&_svg]:size-[22px]",
                      "transition-transform duration-200 ease-out group-active:scale-[0.82] motion-reduce:transition-none motion-reduce:group-active:scale-100",
                      active && "-translate-y-px scale-105",
                    )}
                  >
                    {item.icon}
                    {item.badge !== undefined && (
                      <span className="absolute -top-1 -right-2 min-w-4 rounded-full bg-primary px-1 py-0.5 text-center text-[10px] leading-none font-semibold text-primary-foreground tabular-nums">
                        {item.badge}
                        <span className="sr-only"> new</span>
                      </span>
                    )}
                  </span>
                  <span>{item.label}</span>
                </Comp>
              </li>
            );
          })}
        </ul>
      </nav>
    </GlassSurface>
  );
}

export { MobileTabBar };
