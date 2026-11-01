"use client";

import * as React from "react";

import { Button } from "@/registry/vsrc/ui/button";
import { ToastStackProvider, ToastStackViewport, useToastStack } from "@/registry/pro/ui/toast-stack";

const MESSAGES = [
  { title: "Maya Chen", description: "Pushed 3 commits to launch-checklist." },
  { title: "Deploy finished", description: "northwind-web is live in 41 seconds." },
  { title: "Invoice paid", description: "Lumen Co. paid INV-2041, $1,240.00." },
  { title: "Deb Okafor", description: "Can you review the pricing copy before noon?" },
];

function Controls() {
  const { push, dismissAll } = useToastStack();
  const next = React.useRef(0);
  const seeded = React.useRef(false);

  // Start with a visible stack; the ref guard keeps StrictMode's second effect run from doubling it.
  React.useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    push({ title: "Backup complete", description: "2.4 GB archived to northwind-eu.", duration: Infinity });
    push({ title: "Deb Okafor", description: "Can you review the pricing copy before noon?", duration: Infinity });
  }, [push]);

  return (
    <div className="absolute inset-x-0 bottom-4 flex flex-wrap justify-center gap-2 px-4">
      <Button
        size="sm"
        variant="primary"
        onClick={() => {
          const m = MESSAGES[next.current++ % MESSAGES.length];
          if (m) push(m);
        }}
      >
        New notification
      </Button>
      <Button
        size="sm"
        onClick={() =>
          push({
            title: "Message archived",
            description: "Q3 planning thread moved to Archive.",
            action: { label: "Undo", onClick: () => push({ title: "Restored", description: "Back in your inbox.", duration: 3000 }) },
          })
        }
      >
        With undo
      </Button>
      <Button size="sm" variant="ghost" onClick={dismissAll}>
        Clear all
      </Button>
    </div>
  );
}

export function ToastStackDemo() {
  return (
    <ToastStackProvider>
      <div className="relative h-[22rem] w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card/60">
        <div aria-hidden className="flex flex-col gap-3 p-5 pt-28 opacity-70">
          {["Roadmap review", "Pricing page copy", "Hiring plan Q4"].map((t) => (
            <div key={t} className="flex items-center gap-3">
              <span className="size-8 rounded-full bg-foreground/10" />
              <span className="flex flex-col gap-1">
                <span className="text-sm font-medium">{t}</span>
                <span className="h-2 w-40 rounded-full bg-foreground/10" />
              </span>
            </div>
          ))}
        </div>
        <ToastStackViewport contained />
        <Controls />
      </div>
    </ToastStackProvider>
  );
}
