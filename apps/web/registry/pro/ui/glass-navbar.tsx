"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const NAV_OPTICS: LiquidGlassOptions = {
  scale: -64,
  chroma: 4,
  border: 0.12,
  mapBlur: 10,
  blur: 1,
  saturate: 1.5,
  fallbackBlur: 3,
};

const PANEL_OPTICS: LiquidGlassOptions = {
  scale: -80,
  chroma: 4,
  border: 0.08,
  mapBlur: 14,
  blur: 2,
  saturate: 1.4,
  fallbackBlur: 4,
};

export type GlassNavbarLinkProps = React.ComponentProps<"a"> & { "data-slot"?: string };

export interface GlassNavbarLink {
  label: string;
  href: string;
  /** Marks the current page: sets aria-current="page". */
  current?: boolean;
}

export interface GlassNavbarProps extends Omit<React.ComponentProps<"div">, "children"> {
  links: GlassNavbarLink[];
  /** Brand mark, rendered at the start. */
  logo?: React.ReactNode;
  /** Call to action, rendered at the end (and at the foot of the collapsed panel). */
  cta?: React.ReactNode;
  /** Accessible name of the <nav>. */
  navLabel?: string;
  /** Scroll distance (px) past which the bar shrinks. */
  threshold?: number;
  /**
   * Element (or ref to one) whose scroll drives the shrink. Omit to follow the
   * window. When given, position defaults to "sticky" so the bar stays inside it.
   */
  scrollContainer?: React.RefObject<HTMLElement | null> | HTMLElement | null;
  /** "fixed" for real pages; "sticky" (or "absolute") for contained use. */
  position?: "fixed" | "sticky" | "absolute";
  /** Swap the anchor for a router link: receive the props, return the element. */
  renderLink?: (props: GlassNavbarLinkProps) => React.ReactNode;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

const linkClass = cn(
  "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground outline-none transition-colors",
  "hover:bg-foreground/10 hover:text-foreground aria-[current=page]:text-foreground",
  "focus-visible:ring-2 focus-visible:ring-ring ring-offset-background",
);

function GlassNavbar({
  links,
  logo,
  cta,
  navLabel = "Main",
  threshold = 24,
  scrollContainer,
  position,
  renderLink,
  glass,
  className,
  ref,
  ...props
}: GlassNavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const toggleRef = React.useRef<HTMLButtonElement | null>(null);
  const panelId = React.useId();
  const placement = position ?? (scrollContainer ? "sticky" : "fixed");

  // `scrollContainer` may be a ref whose element only exists after mount, so
  // it is resolved here and not during render. A 6px dead band stops the
  // shrink from flickering when the bar's own size change nudges the scroll.
  React.useEffect(() => {
    const el = scrollContainer && "current" in scrollContainer ? scrollContainer.current : scrollContainer;
    const target: HTMLElement | Window = el ?? window;
    const read = () => (el ? el.scrollTop : window.scrollY);
    const update = () =>
      setScrolled((prev) => (prev ? read() > threshold - 6 : read() > threshold + 6));
    update();
    target.addEventListener("scroll", update, { passive: true });
    return () => target.removeEventListener("scroll", update);
  }, [scrollContainer, threshold]);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const renderItem = (link: GlassNavbarLink, onClick?: () => void) => {
    const anchorProps: GlassNavbarLinkProps = {
      href: link.href,
      className: linkClass,
      "aria-current": link.current ? "page" : undefined,
      "data-slot": "glass-navbar-link",
      onClick,
      children: link.label,
    };
    return renderLink ? renderLink(anchorProps) : <a {...anchorProps} />;
  };

  return (
    <div
      ref={setRefs}
      data-slot="glass-navbar-root"
      data-scrolled={scrolled ? "" : undefined}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
      className={cn(
        "@container pointer-events-none inset-x-0 top-0 z-40 h-[4.5rem] px-3 pt-3",
        placement === "fixed" && "fixed",
        placement === "sticky" && "sticky",
        placement === "absolute" && "absolute",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "relative mx-auto transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          scrolled ? "max-w-3xl" : "max-w-5xl",
        )}
      >
        <GlassSurface asChild glass={mergeGlass(NAV_OPTICS, glass)}>
          <nav
            aria-label={navLabel}
            data-slot="glass-navbar"
            className={cn(
              // Denser tint than a panel: a bar sits over whatever the page scrolls under it, bright photos included.
              "pointer-events-auto flex items-center justify-between gap-3 bg-background/45 px-3 text-foreground",
              "transition-[padding,border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              scrolled ? "rounded-2xl py-1.5" : "rounded-[28px] py-2.5",
            )}
          >
            <div className="flex min-w-0 items-center gap-2 pl-1">{logo}</div>
            <ul className="hidden items-center gap-1 @xl:flex">
              {links.map((link) => (
                <li key={link.href + link.label}>{renderItem(link)}</li>
              ))}
            </ul>
            <div className="hidden items-center @xl:flex">{cta}</div>
            <button
              ref={toggleRef}
              type="button"
              data-slot="glass-navbar-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "relative flex size-9 items-center justify-center rounded-full outline-none @xl:hidden",
                "hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring ring-offset-background",
              )}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="size-5">
                <path d="M4 6.5h12" className={cn("origin-center transition-transform duration-300", open && "translate-y-[3.5px] rotate-45")} />
                <path d="M4 13.5h12" className={cn("origin-center transition-transform duration-300", open && "-translate-y-[3.5px] -rotate-45")} />
              </svg>
            </button>
          </nav>
        </GlassSurface>
        <GlassSurface
          id={panelId}
          inert={!open}
          glass={mergeGlass(PANEL_OPTICS, glass)}
          data-slot="glass-navbar-panel"
          data-state={open ? "open" : "closed"}
          className={cn(
            "pointer-events-auto absolute inset-x-0 top-full mt-2 flex flex-col gap-1 rounded-3xl p-2 @xl:hidden",
            "origin-top transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "motion-reduce:transition-opacity",
            open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0 motion-reduce:translate-y-0 motion-reduce:scale-100",
          )}
        >
          {links.map((link) => (
            <div key={link.href + link.label} className="[&>a]:block [&>a]:py-2.5 [&>a]:text-base">
              {renderItem(link, () => setOpen(false))}
            </div>
          ))}
          {cta ? <div className="flex flex-col p-1 [&>*]:w-full">{cta}</div> : null}
        </GlassSurface>
      </div>
    </div>
  );
}

export { GlassNavbar };
