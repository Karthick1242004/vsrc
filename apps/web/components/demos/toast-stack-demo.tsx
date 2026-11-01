"use client";

import * as React from "react";

import { IPhoneFrame } from "@/components/demos/iphone-frame";
import { Photo } from "@/components/demos/photo";
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
    <div className="flex flex-wrap justify-center gap-2">
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

/* Stacked notifications are a lock-screen pattern, so the demo is one: glass toasts over a night photograph. */
export function ToastStackDemo() {
  return (
    <ToastStackProvider>
      <div className="flex flex-col items-center gap-5">
        <IPhoneFrame>
          <div aria-hidden className="absolute inset-0">
            <Photo name="aurora" alt="" sizes="300px" />
          </div>
          <div aria-hidden className="absolute inset-x-0 top-14 text-center text-white">
            <p className="text-sm font-medium opacity-80">Monday 2 November</p>
            <p className="font-display text-7xl leading-none tabular-nums">9:41</p>
          </div>
          <div className="absolute inset-x-0 top-48 bottom-10">
            <ToastStackViewport contained />
          </div>
        </IPhoneFrame>
        <Controls />
      </div>
    </ToastStackProvider>
  );
}
