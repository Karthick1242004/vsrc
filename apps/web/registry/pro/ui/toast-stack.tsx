"use client";

import * as React from "react";
import { Toaster, toast as sonner } from "sonner";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

// Each toast is its own small glass pane: siblings in the stack, never nested.
const TOAST_OPTICS: LiquidGlassOptions = {
  scale: -56,
  chroma: 3,
  border: 0.14,
  mapBlur: 8,
  blur: 0.5,
  saturate: 1.3,
  fallbackBlur: 8,
};

/* sonner hides the children of tucked-away toasts. Keep the glass card visible
   (the iOS peek) and hide only its contents; scoped to this toaster. */
const STACK_CSS = `
[data-vsrc-stack] [data-sonner-toast][data-expanded="false"][data-front="false"] > * { opacity: 1; }
[data-vsrc-stack] [data-sonner-toast][data-expanded="false"][data-front="false"] [data-slot="toast-stack-item"] > * { opacity: 0; }
[data-vsrc-stack] [data-sonner-toast] { width: 100%; }
`;

export interface ToastInput {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  /** Milliseconds before auto-dismiss. `Infinity` keeps it until dismissed. Default 5000. */
  duration?: number;
}

interface StackApi {
  push: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const StackContext = React.createContext<{ toasterId: string; limit: number } | null>(null);
const GlassContext = React.createContext<LiquidGlassOptions | GlassPreset | false | undefined>(undefined);

/**
 * iOS-style notification stack on sonner (shadcn's toast library): sonner owns
 * stacking, expand on hover, swipe to dismiss, timers that pause on hover and
 * the live region. Each toast is a refracting glass card.
 */
function ToastStackProvider({ children, limit = 4 }: { children: React.ReactNode; limit?: number }) {
  const toasterId = `vsrc-stack-${React.useId().replace(/:/g, "")}`;
  const value = React.useMemo(() => ({ toasterId, limit }), [toasterId, limit]);
  return <StackContext.Provider value={value}>{children}</StackContext.Provider>;
}

function useToastStack(): StackApi {
  const ctx = React.useContext(StackContext);
  if (!ctx) throw new Error("useToastStack must be used inside <ToastStackProvider>");
  const { toasterId } = ctx;
  return React.useMemo(() => {
    const live = new Set<string | number>();
    return {
      push: (t: ToastInput) => {
        const id = sonner.custom((tid) => <ToastCard id={tid} toast={t} />, {
          toasterId,
          duration: t.duration ?? 5000,
          onDismiss: () => live.delete(id),
          onAutoClose: () => live.delete(id),
        });
        live.add(id);
        return String(id);
      },
      dismiss: (id: string) => sonner.dismiss(id),
      dismissAll: () => {
        live.forEach((id) => sonner.dismiss(id));
        live.clear();
      },
    };
  }, [toasterId]);
}

function ToastCard({ id, toast }: { id: string | number; toast: ToastInput }) {
  const glass = React.useContext(GlassContext);
  return (
    <GlassSurface
      data-slot="toast-stack-item"
      glass={mergeGlass(TOAST_OPTICS, glass)}
      className="flex w-full items-start gap-3 rounded-[22px] p-3.5 pl-4 text-foreground [&>*]:transition-opacity [&>*]:duration-200 motion-reduce:[&>*]:transition-none"
    >
      <div data-slot="toast-stack-text" className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-sm font-medium">{toast.title}</p>
        {toast.description && <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{toast.description}</p>}
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.onClick();
              sonner.dismiss(id);
            }}
            className="mt-2 self-start rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium outline-none transition-colors hover:bg-foreground/15 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label={`Dismiss ${toast.title}`}
        onClick={() => sonner.dismiss(id)}
        className="-m-1 shrink-0 rounded-full p-1.5 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-3.5" aria-hidden>
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </GlassSurface>
  );
}

export interface ToastStackViewportProps {
  /** Position absolutely inside the nearest `relative` ancestor instead of fixed to the viewport. */
  contained?: boolean;
  placement?: "top" | "bottom";
  glass?: LiquidGlassOptions | GlassPreset | false;
  className?: string;
}

function ToastStackViewport({ contained = false, placement = "top", glass, className }: ToastStackViewportProps) {
  const ctx = React.useContext(StackContext);
  if (!ctx) throw new Error("ToastStackViewport must be used inside <ToastStackProvider>");
  return (
    <GlassContext.Provider value={glass}>
      <style href="vsrc-toast-stack" precedence="default">
        {STACK_CSS}
      </style>
      <div data-vsrc-stack="" className={cn(contained && "contents", className)}>
        <Toaster
          id={ctx.toasterId}
          position={placement === "top" ? "top-center" : "bottom-center"}
          visibleToasts={ctx.limit}
          gap={10}
          offset={12}
          mobileOffset={12}
          containerAriaLabel="Notifications"
          toastOptions={{ unstyled: true }}
          style={
            contained
              ? ({ position: "absolute", "--width": "calc(100% - 24px)" } as React.CSSProperties)
              : undefined
          }
        />
      </div>
    </GlassContext.Provider>
  );
}

export { ToastStackProvider, ToastStackViewport, useToastStack };
