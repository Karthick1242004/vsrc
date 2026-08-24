"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/registry/vsrc/ui/context-menu";

export function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-28 w-64 items-center justify-center rounded-[24px] border border-dashed border-border text-sm text-muted-foreground">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>{"// layer"}</ContextMenuLabel>
        <ContextMenuItem>Bring forward</ContextMenuItem>
        <ContextMenuItem>Send back</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-signal">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
