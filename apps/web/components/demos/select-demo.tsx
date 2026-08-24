"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/vsrc/ui/select";

export function SelectDemo() {
  return (
    <Select defaultValue="regular">
      <SelectTrigger className="w-56" aria-label="Optics preset">
        <SelectValue placeholder="Choose optics" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{"// optics"}</SelectLabel>
          <SelectItem value="subtle">Subtle</SelectItem>
          <SelectItem value="regular">Regular</SelectItem>
          <SelectItem value="heavy">Heavy</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
