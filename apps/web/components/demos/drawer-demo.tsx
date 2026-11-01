"use client";

import { Button } from "@/registry/vsrc/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/pro/ui/drawer";

const PEOPLE = [
  { name: "Maya Chen", email: "maya@northwind.studio", role: "Owner" },
  { name: "Deb Okafor", email: "deb@northwind.studio", role: "Can edit" },
  { name: "Ravi Menon", email: "ravi@lumen.co", role: "Can comment" },
  { name: "Sofia Alvarez", email: "sofia@lumen.co", role: "Can view" },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");

export function DrawerDemo() {
  return (
    <Drawer snapPoints={[0.5, 0.92]}>
      <DrawerTrigger asChild>
        <Button variant="primary">Share roadmap</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share “Q3 roadmap”</DrawerTitle>
          <DrawerDescription>Drag the handle up to see who has access, or down to dismiss.</DrawerDescription>
        </DrawerHeader>

        <div className="flex items-center gap-2 rounded-2xl border border-border bg-foreground/5 p-2 pl-4">
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">vsrc.app/s/q3-roadmap-7Hk2</span>
          <button
            type="button"
            className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
          >
            Copy link
          </button>
        </div>

        <ul className="flex flex-col divide-y divide-border" aria-label="People with access">
          {PEOPLE.map((p) => (
            <li key={p.email} className="flex items-center gap-3 py-3">
              <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium">
                {initials(p.name)}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{p.name}</span>
                <span className="truncate text-xs text-muted-foreground">{p.email}</span>
              </span>
              <span className="text-xs text-muted-foreground">{p.role}</span>
            </li>
          ))}
        </ul>

        <DrawerFooter>
          <DrawerClose asChild>
            <button
              type="button"
              className="h-11 rounded-full bg-primary text-sm font-medium text-primary-foreground outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background active:scale-[0.98]"
            >
              Done
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
