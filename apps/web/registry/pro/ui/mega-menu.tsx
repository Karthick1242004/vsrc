"use client";

import * as React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const BAR_OPTICS: LiquidGlassOptions = {
  scale: -48,
  chroma: 4,
  border: 0.16,
  mapBlur: 8,
  blur: 0.5,
  saturate: 1.4,
  fallbackBlur: 3,
};

const PANEL_OPTICS: LiquidGlassOptions = {
  scale: -96,
  chroma: 4,
  border: 0.07,
  mapBlur: 14,
  blur: 2,
  saturate: 1.4,
  fallbackBlur: 4,
};

export interface MegaMenuLink {
  label: string;
  href: string;
  description?: string;
  /** Small inline SVG shown in a rounded chip. */
  icon?: React.ReactNode;
  /** Marks the current page (aria-current="page"). */
  current?: boolean;
}

export interface MegaMenuColumn {
  title: string;
  links: MegaMenuLink[];
}

export interface MegaMenuFeatured {
  title: string;
  description: string;
  href: string;
  /** Decorative art for the card; defaults to a soft gradient. Hidden from assistive tech. */
  art?: React.ReactNode;
}

export interface MegaMenuSection {
  label: string;
  /** A section with `columns` opens a panel; one with only `href` is a plain link. */
  columns?: MegaMenuColumn[];
  featured?: MegaMenuFeatured;
  href?: string;
}

export interface MegaMenuProps extends Omit<React.ComponentProps<typeof NavigationMenu.Root>, "children"> {
  sections: MegaMenuSection[];
  /** Extra classes for the panel content (width, padding). */
  contentClassName?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

// Content slides from the side of the previously open trigger; the viewport
// scales in and out. Keyframes stay here so the file is copy-paste complete.
const KEYFRAMES = `
@keyframes vsrc-mm-from-start { from { opacity: 0; translate: -36px 0; } to { opacity: 1; translate: 0 0; } }
@keyframes vsrc-mm-from-end { from { opacity: 0; translate: 36px 0; } to { opacity: 1; translate: 0 0; } }
@keyframes vsrc-mm-to-start { from { opacity: 1; translate: 0 0; } to { opacity: 0; translate: -36px 0; } }
@keyframes vsrc-mm-to-end { from { opacity: 1; translate: 0 0; } to { opacity: 0; translate: 36px 0; } }
@keyframes vsrc-mm-open { from { opacity: 0; scale: 0.96; translate: 0 -6px; } to { opacity: 1; scale: 1; translate: 0 0; } }
@keyframes vsrc-mm-close { from { opacity: 1; scale: 1; } to { opacity: 0; scale: 0.97; } }
[data-slot="mega-menu-content"][data-motion="from-start"] { animation: vsrc-mm-from-start 260ms cubic-bezier(0.22, 1, 0.36, 1); }
[data-slot="mega-menu-content"][data-motion="from-end"] { animation: vsrc-mm-from-end 260ms cubic-bezier(0.22, 1, 0.36, 1); }
[data-slot="mega-menu-content"][data-motion="to-start"] { animation: vsrc-mm-to-start 200ms ease forwards; }
[data-slot="mega-menu-content"][data-motion="to-end"] { animation: vsrc-mm-to-end 200ms ease forwards; }
[data-slot="mega-menu-viewport"][data-state="open"] { animation: vsrc-mm-open 240ms cubic-bezier(0.22, 1, 0.36, 1); }
[data-slot="mega-menu-viewport"][data-state="closed"] { animation: vsrc-mm-close 160ms ease forwards; }
@media (prefers-reduced-motion: reduce) {
  [data-slot="mega-menu-content"], [data-slot="mega-menu-viewport"] { animation: none !important; }
}`;

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background";

function MenuLink({ link }: { link: MegaMenuLink }) {
  return (
    <NavigationMenu.Link asChild active={link.current}>
      <a
        href={link.href}
        data-slot="mega-menu-link"
        className={cn("flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-foreground/10", ring)}
      >
        {link.icon ? (
          <span aria-hidden className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground/10 [&_svg]:size-4">
            {link.icon}
          </span>
        ) : null}
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground">{link.label}</span>
          {link.description ? (
            <span className="mt-0.5 hidden text-sm leading-snug text-muted-foreground sm:block">{link.description}</span>
          ) : null}
        </span>
      </a>
    </NavigationMenu.Link>
  );
}

function MegaMenu({ sections, contentClassName, glass, className, ref, ...props }: MegaMenuProps) {
  return (
    <NavigationMenu.Root
      ref={ref}
      data-slot="mega-menu"
      className={cn("relative z-10 flex w-full max-w-full justify-center", className)}
      {...props}
    >
      <style>{KEYFRAMES}</style>
      <GlassSurface asChild glass={mergeGlass(BAR_OPTICS, glass)}>
        <NavigationMenu.List
          data-slot="mega-menu-list"
          className="m-0 flex list-none items-center gap-0.5 rounded-full p-1"
        >
          {sections.map((section) => {
            const triggerClass = cn(
              "group inline-flex h-9 items-center gap-1 rounded-full px-2.5 text-sm font-medium text-foreground transition-colors sm:px-3.5",
              "hover:bg-foreground/10 data-[state=open]:bg-foreground/15",
              ring,
            );
            return (
              <NavigationMenu.Item key={section.label}>
                {section.columns?.length ? (
                  <>
                    <NavigationMenu.Trigger data-slot="mega-menu-trigger" className={triggerClass}>
                      {section.label}
                      <svg
                        aria-hidden
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-3 transition-transform duration-300 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
                      >
                        <path d="m3 4.5 3 3 3-3" />
                      </svg>
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content
                      data-slot="mega-menu-content"
                      className={cn(
                        "absolute top-0 left-0 flex w-[calc(100vw-5.5rem)] flex-col gap-2 p-3 sm:w-[40rem] sm:flex-row",
                        contentClassName,
                      )}
                    >
                      {section.columns.map((column) => (
                        <div key={column.title} className="min-w-0 flex-1">
                          <p className="px-2 pt-1 pb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {column.title}
                          </p>
                          <ul className="m-0 flex list-none flex-col p-0">
                            {column.links.map((link) => (
                              <li key={link.href + link.label}>
                                <MenuLink link={link} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {section.featured ? (
                        <NavigationMenu.Link asChild>
                          <a
                            href={section.featured.href}
                            data-slot="mega-menu-featured"
                            className={cn(
                              "relative hidden w-48 shrink-0 flex-col justify-end overflow-hidden rounded-2xl border border-border p-3 sm:flex",
                              ring,
                            )}
                          >
                            <span aria-hidden className="absolute inset-0">
                              {section.featured.art ?? (
                                <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,var(--color-primary),transparent_55%),radial-gradient(circle_at_85%_90%,var(--color-signal),transparent_50%)] opacity-70" />
                              )}
                            </span>
                            <span className="relative rounded-lg bg-card/80 p-2.5 backdrop-blur-sm">
                              <span className="block text-sm font-medium text-foreground">{section.featured.title}</span>
                              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                                {section.featured.description}
                              </span>
                            </span>
                          </a>
                        </NavigationMenu.Link>
                      ) : null}
                    </NavigationMenu.Content>
                  </>
                ) : (
                  <NavigationMenu.Link asChild>
                    <a href={section.href ?? "#"} data-slot="mega-menu-trigger" className={triggerClass}>
                      {section.label}
                    </a>
                  </NavigationMenu.Link>
                )}
              </NavigationMenu.Item>
            );
          })}
        </NavigationMenu.List>
      </GlassSurface>
      <div className="absolute top-full left-0 flex w-full justify-center pt-2">
        <GlassSurface asChild glass={mergeGlass(PANEL_OPTICS, glass)}>
          <NavigationMenu.Viewport
            data-slot="mega-menu-viewport"
            className={cn(
              "relative h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) max-w-full origin-top rounded-3xl",
              "transition-[width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            )}
          />
        </GlassSurface>
      </div>
    </NavigationMenu.Root>
  );
}

export { MegaMenu };
