"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const LENS_OPTICS: LiquidGlassOptions = {
  scale: -48,
  chroma: 4,
  border: 0.2,
  mapBlur: 6,
  blur: 0.5,
  saturate: 1.3,
  fallbackBlur: 2,
};

export type PillNavLinkProps = React.ComponentProps<"a"> & { "data-slot": string; "data-value": string };

export interface PillNavItem {
  label: string;
  href: string;
  /** Identity used by value/onValueChange. Defaults to href. */
  value?: string;
}

export interface PillNavProps
  extends Omit<React.ComponentProps<"nav">, "children" | "defaultValue" | "onChange"> {
  items: PillNavItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Render each link with your router's Link: it must forward className, href and data-* props. */
  renderLink?: (props: PillNavLinkProps) => React.ReactNode;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function PillNav({
  items,
  value,
  defaultValue,
  onValueChange,
  renderLink,
  glass,
  className,
  ref,
  ...props
}: PillNavProps) {
  const idOf = (item: PillNavItem) => item.value ?? item.href;
  const [inner, setInner] = React.useState(defaultValue ?? (items[0] ? idOf(items[0]) : ""));
  const current = value ?? inner;
  const [hover, setHover] = React.useState<string | null>(null);
  const [rect, setRect] = React.useState<{ left: number; width: number } | null>(null);
  const [ready, setReady] = React.useState(false);
  const navRef = React.useRef<HTMLElement | null>(null);
  const target = hover ?? current;

  // The lens is one element measured against the target link; fonts loading or
  // a resize re-measure it.
  React.useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const place = () => {
      const link = Array.from(nav.querySelectorAll<HTMLElement>('[data-slot="pill-nav-link"]')).find(
        (el) => el.dataset.value === target,
      );
      setRect(link ? { left: link.offsetLeft, width: link.offsetWidth } : null);
    };
    place();
    const sizes = new ResizeObserver(place);
    sizes.observe(nav);
    return () => sizes.disconnect();
  }, [target, items]);

  // Skip the glide for the very first placement so the lens does not sweep in from 0.
  React.useEffect(() => {
    if (!rect || ready) return;
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [rect, ready]);

  const select = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  const linkValue = (event: React.SyntheticEvent) =>
    (event.target as HTMLElement).closest<HTMLElement>('[data-slot="pill-nav-link"]')?.dataset.value ?? null;

  const setRefs = React.useCallback(
    (node: HTMLElement | null) => {
      navRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <nav
      ref={setRefs}
      data-slot="pill-nav"
      onPointerOver={(event) => {
        if (event.pointerType !== "touch") setHover(linkValue(event));
      }}
      onPointerLeave={() => setHover(null)}
      onFocus={(event) => setHover(linkValue(event))}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHover(null);
      }}
      className={cn(
        // Scrolls sideways when the links outgrow a narrow screen; the lens lives in the same scroll box.
        "relative inline-flex w-fit max-w-full overflow-x-auto overscroll-x-contain rounded-full border border-border bg-card/50 p-1 text-foreground [scrollbar-width:none]",
        className,
      )}
      {...props}
    >
      {rect ? (
        <GlassSurface
          aria-hidden
          glass={mergeGlass(LENS_OPTICS, glass)}
          data-slot="pill-nav-lens"
          style={{ transform: `translateX(${rect.left}px)`, width: rect.width }}
          className={cn(
            "pointer-events-none absolute inset-y-1 left-0 z-10 rounded-full",
            ready &&
              "transition-[transform,width] duration-[480ms] ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none",
          )}
        />
      ) : null}
      <ul className="flex items-center">
        {items.map((item) => {
          const id = idOf(item);
          const isCurrent = id === current;
          const linkProps: PillNavLinkProps = {
            href: item.href,
            "aria-current": isCurrent ? "page" : undefined,
            "data-slot": "pill-nav-link",
            "data-value": id,
            onClick: () => select(id),
            className: cn(
              "block rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap outline-none transition-colors duration-300",
              "focus-visible:ring-2 focus-visible:ring-ring ring-offset-background",
              id === target ? "text-foreground" : "text-muted-foreground",
            ),
            children: item.label,
          };
          return <li key={id}>{renderLink ? renderLink(linkProps) : <a {...linkProps} />}</li>;
        })}
      </ul>
    </nav>
  );
}

export { PillNav };
