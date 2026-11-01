"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const SIDEBAR_OPTICS: LiquidGlassOptions = {
  scale: -72,
  chroma: 3,
  border: 0.08,
  mapBlur: 12,
  blur: 3,
  saturate: 1.3,
  fallbackBlur: 6,
};

export interface AppSidebarItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  /** Count or short label; collapses to a dot on the icon rail. */
  badge?: string | number;
  href?: string;
}

export interface AppSidebarGroup {
  label?: string;
  items: AppSidebarItem[];
}

export interface AppSidebarProps extends Omit<React.ComponentProps<"aside">, "children" | "onChange"> {
  groups: AppSidebarGroup[];
  /** Logo mark and product name shown at the top. */
  header?: { logo: React.ReactNode; title: string };
  /** Signed-in user block pinned to the bottom. */
  user?: { name: string; detail?: string; avatar: React.ReactNode };
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Toggle with Ctrl/Cmd+B while the page has focus. */
  shortcut?: boolean;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function useControllable<T>(controlled: T | undefined, initial: T, onChange?: (next: T) => void) {
  const [inner, setInner] = React.useState(initial);
  const isControlled = controlled !== undefined;
  const current = isControlled ? controlled : inner;
  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setInner(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [current, set] as const;
}

const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background";
// Label fades and clips with the width; it stays in the DOM so the accessible name never disappears.
const LABEL =
  "min-w-0 truncate whitespace-nowrap transition-opacity duration-200 group-data-[collapsed=true]/sb:opacity-0 motion-reduce:transition-none";

function AppSidebar({
  groups,
  header,
  user,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  value: valueProp,
  defaultValue,
  onValueChange,
  shortcut = false,
  glass,
  className,
  ref,
  ...props
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useControllable(collapsedProp, defaultCollapsed, onCollapsedChange);
  const [value, setValue] = useControllable(valueProp, defaultValue ?? groups[0]?.items[0]?.value ?? "", onValueChange);
  const navId = React.useId();

  React.useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed(!collapsed);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut, collapsed, setCollapsed]);

  return (
    <GlassSurface asChild glass={mergeGlass(SIDEBAR_OPTICS, glass)}>
      <aside
        ref={ref}
        data-slot="app-sidebar"
        data-collapsed={collapsed}
        aria-label="Application"
        className={cn(
          "group/sb relative flex h-full flex-col gap-3 p-2",
          // Width is the one animated size: the refraction map re-settles ~120ms after it lands.
          "w-60 transition-[width] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-[collapsed=true]:w-[72px]",
          "motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        {header && (
          <div data-slot="app-sidebar-header" className="flex h-12 shrink-0 items-center gap-2.5 overflow-hidden pl-1">
            <span className="flex size-10 shrink-0 items-center justify-center">{header.logo}</span>
            <span className={cn(LABEL, "font-display text-xl")}>{header.title}</span>
          </div>
        )}

        <nav id={navId} aria-label="Primary" className="flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto">
          {groups.map((group, gi) => (
            <div key={group.label ?? gi} data-slot="app-sidebar-group" className="flex flex-col gap-0.5">
              {group.label && (
                <p
                  className={cn(
                    "overflow-hidden px-3 text-xs font-medium tracking-wide whitespace-nowrap text-muted-foreground uppercase",
                    "h-5 transition-[height,opacity] duration-200 group-data-[collapsed=true]/sb:h-1 group-data-[collapsed=true]/sb:opacity-0",
                    "motion-reduce:transition-none",
                  )}
                >
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const active = item.value === value;
                const Comp = item.href ? "a" : "button";
                return (
                  <Comp
                    key={item.value}
                    data-slot="app-sidebar-item"
                    data-active={active || undefined}
                    {...(item.href ? { href: item.href } : { type: "button" as const })}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    onClick={(e: React.MouseEvent) => {
                      if (item.href) e.preventDefault();
                      setValue(item.value);
                    }}
                    className={cn(
                      "group/item relative flex h-10 w-full items-center gap-2.5 overflow-hidden rounded-xl pl-1 text-sm font-medium",
                      "text-muted-foreground transition-colors duration-200 hover:bg-foreground/10 hover:text-foreground",
                      "data-[active]:bg-foreground/15 data-[active]:text-foreground",
                      FOCUS,
                    )}
                  >
                    <span className="relative flex size-8 shrink-0 items-center justify-center [&_svg]:size-[18px]">
                      {item.icon}
                      {item.badge !== undefined && (
                        <span
                          aria-hidden
                          className="absolute top-0.5 right-0.5 hidden size-2 rounded-full bg-signal group-data-[collapsed=true]/sb:block"
                        />
                      )}
                    </span>
                    <span className={LABEL}>{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          "ml-auto mr-2 min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-[11px] leading-none font-semibold text-primary-foreground tabular-nums",
                          "transition-opacity duration-200 group-data-[collapsed=true]/sb:hidden",
                        )}
                      >
                        <span className="sr-only">Badge: </span>
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge !== undefined && <span className="sr-only">, {item.badge} new</span>}
                  </Comp>
                );
              })}
            </div>
          ))}
        </nav>

        <button
          type="button"
          data-slot="app-sidebar-toggle"
          aria-expanded={!collapsed}
          aria-controls={navId}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex h-10 w-full shrink-0 items-center gap-2.5 overflow-hidden rounded-xl pl-1 text-sm font-medium text-muted-foreground",
            "transition-colors duration-200 hover:bg-foreground/10 hover:text-foreground",
            FOCUS,
          )}
        >
          <span className="flex size-8 shrink-0 items-center justify-center">
            <svg
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="size-[18px] transition-transform duration-300 group-data-[collapsed=true]/sb:rotate-180 motion-reduce:transition-none"
            >
              <rect x="2.5" y="3" width="13" height="12" rx="3" />
              <path d="M7 3v12M11.5 7.5 10 9l1.5 1.5" />
            </svg>
          </span>
          <span aria-hidden className={LABEL}>
            Collapse
          </span>
        </button>

        {user && (
          <div
            data-slot="app-sidebar-user"
            className="flex shrink-0 items-center gap-2.5 overflow-hidden rounded-xl border-t border-foreground/10 pt-2 pl-1"
          >
            <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full">{user.avatar}</span>
            <span className={cn(LABEL, "flex flex-col text-left leading-tight")}>
              <span className="truncate text-sm font-medium">{user.name}</span>
              {user.detail && <span className="truncate text-xs text-muted-foreground">{user.detail}</span>}
            </span>
          </div>
        )}
      </aside>
    </GlassSurface>
  );
}

export { AppSidebar };
