"use client";

import { Button } from "@/registry/vsrc/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/vsrc/ui/tooltip";

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Real refraction, even here</TooltipContent>
    </Tooltip>
  );
}
