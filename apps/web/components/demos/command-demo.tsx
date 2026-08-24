"use client";

import * as React from "react";

import { Button } from "@/registry/vsrc/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/vsrc/ui/command";

/* The command palette needs open state, so it's a component rather than inline
   JSX. The site-wide ⌘K palette is separately live from layout.tsx. */
export function CommandDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open command palette</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search components…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="// components">
            <CommandItem value="glass-surface">glass-surface</CommandItem>
            <CommandItem value="dialog">dialog</CommandItem>
            <CommandItem value="slider">slider</CommandItem>
            <CommandItem value="dock">dock</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
