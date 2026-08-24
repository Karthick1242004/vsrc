"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/vsrc/ui/hover-card";

export function HoverCardDemo() {
  return (
    <HoverCard openDelay={80}>
      <HoverCardTrigger className="cursor-default font-display text-2xl underline decoration-signal/60 underline-offset-4">
        @vsrc
      </HoverCardTrigger>
      <HoverCardContent glass="subtle">
        <p className="font-display text-lg">V-/Src</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Real refraction for the web — displacement maps, not blur stacks.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
