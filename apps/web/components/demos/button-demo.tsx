"use client";

import { Button } from "@/registry/vsrc/ui/button";

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button size="lg">Large</Button>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button size="sm">Small</Button>
    </div>
  );
}
