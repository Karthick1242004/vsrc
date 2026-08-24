"use client";

import { Button } from "@/registry/vsrc/ui/button";
import { Input } from "@/registry/vsrc/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/vsrc/ui/popover";

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="font-display text-lg">Subscribe</p>
        <p className="mt-1 text-sm text-muted-foreground">Release notes, no noise.</p>
        <Input placeholder="you@work.dev" className="mt-3" aria-label="Email" />
      </PopoverContent>
    </Popover>
  );
}
