"use client";

import { Button } from "@/registry/vsrc/ui/button";
import { Input } from "@/registry/vsrc/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/vsrc/ui/sheet";
import { Switch } from "@/registry/vsrc/ui/switch";

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Everything here is a registry component.</SheetDescription>
        </SheetHeader>
        <label className="flex items-center justify-between text-sm">
          Reduce transparency
          <Switch aria-label="Reduce transparency" />
        </label>
        <Input placeholder="Display name" aria-label="Display name" />
      </SheetContent>
    </Sheet>
  );
}
