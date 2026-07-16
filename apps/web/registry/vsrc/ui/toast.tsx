"use client";

import { Toaster as Sonner, toast } from "sonner";

import { glassMaterial } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

/**
 * Glass-styled sonner. Toasts animate position constantly, so they get the
 * CSS material only — no per-toast displacement maps (PLAN perf guardrail).
 */
function Toaster(props: React.ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            glassMaterial,
            "rounded-(--glass-radius) backdrop-blur-md flex w-full items-center gap-3 p-4",
            "text-sm text-foreground",
          ),
          title: "font-medium",
          description: "text-muted-foreground",
          actionButton: "ml-auto rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
