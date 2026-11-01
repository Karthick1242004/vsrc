"use client";

import * as React from "react";

import { DatePicker, type DateRange } from "@/registry/pro/ui/date-picker";

// Fixed dates keep server and client markup identical.
const LAUNCH = new Date(2026, 10, 12);
const MIN = new Date(2026, 9, 1);
const MAX = new Date(2027, 2, 31);
const noWeekends = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export function DatePickerDemo() {
  const [day, setDay] = React.useState<Date | undefined>(LAUNCH);
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <DatePicker aria-label="Launch date" value={day} onValueChange={setDay} min={MIN} max={MAX} disabled={noWeekends} placeholder="Launch date" />
      <DatePicker aria-label="Trip dates" mode="range" value={range} onValueChange={setRange} placeholder="Trip dates" />
    </div>
  );
}
