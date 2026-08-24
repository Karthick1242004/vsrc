"use client";

import { Button } from "@/registry/vsrc/ui/button";
import { toast } from "@/registry/vsrc/ui/toast";

export function ToastDemo() {
  return (
    <Button
      onClick={() =>
        toast("Copied install command", { description: "npx shadcn add @vsrc/toast" })
      }
    >
      Fire a toast
    </Button>
  );
}
