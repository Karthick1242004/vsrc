"use client";

import { StatCards, type SeriesPoint, type Stat } from "@/registry/pro/ui/stat-cards";

const USD: Intl.NumberFormatOptions = { style: "currency", currency: "USD", maximumFractionDigits: 0 };

const STATS: Stat[] = [
  { id: "revenue", label: "Monthly revenue", value: 48210, format: USD, delta: 12.4, trend: [31, 33, 32, 36, 38, 37, 41, 44, 43, 48], period: "vs last month" },
  { id: "subs", label: "Active subscribers", value: 3842, delta: 6.8, trend: [29, 30, 30, 32, 33, 35, 34, 36, 37, 38], period: "vs last month" },
  { id: "conv", label: "Trial conversion", value: 0.184, format: { style: "percent", maximumFractionDigits: 1 }, delta: -2.1, trend: [21, 20, 22, 21, 19, 20, 19, 18, 19, 18], period: "vs last month" },
  { id: "churn", label: "Churn", value: 0.021, format: { style: "percent", maximumFractionDigits: 1 }, delta: -0.6, invertDelta: true, trend: [30, 28, 29, 27, 26, 25, 26, 24, 23, 21], period: "vs last month" },
];

const SERIES: SeriesPoint[] = [
  { label: "Jan", value: 31200 },
  { label: "Feb", value: 33800 },
  { label: "Mar", value: 32600 },
  { label: "Apr", value: 36900 },
  { label: "May", value: 38400 },
  { label: "Jun", value: 37100 },
  { label: "Jul", value: 41500 },
  { label: "Aug", value: 44300 },
  { label: "Sep", value: 43200 },
  { label: "Oct", value: 48210 },
];

export function StatCardsDemo() {
  return <StatCards stats={STATS} series={SERIES} chartTitle="Revenue" chartDescription="Last 10 months, USD" chartFormat={USD} className="max-w-3xl" />;
}
