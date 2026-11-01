"use client";

import { Textarea } from "@/registry/vsrc/ui/textarea";

export function TextareaDemo() {
  return <Textarea placeholder="Tell us what you are building…" className="w-72" aria-label="Project notes" rows={4} />;
}
