"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const CARD_OPTICS: LiquidGlassOptions = {
  scale: -80,
  chroma: 3,
  border: 0.07,
  mapBlur: 12,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

type GlassProp = LiquidGlassOptions | GlassPreset | false;

export interface Stat {
  id: string;
  label: string;
  value: number;
  /** Intl.NumberFormat options for the headline number. */
  format?: Intl.NumberFormatOptions;
  /** Change versus the previous period, in percent. Sign sets the arrow. */
  delta: number;
  /** Set when a falling number is good news (churn, latency). */
  invertDelta?: boolean;
  /** Trailing values for the sparkline, oldest first. */
  trend: number[];
  /** Comparison window shown beside the chip. */
  period?: string;
}

export interface SeriesPoint {
  label: string;
  value: number;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useInView<T extends Element>() {
  const ref = React.useRef<T>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** Server and no-JS render the final number; the climb starts only once the card is seen. */
function CountUp({ value, format, locale, active }: { value: number; format?: Intl.NumberFormatOptions; locale: string; active: boolean }) {
  const nf = React.useMemo(() => new Intl.NumberFormat(locale, format), [locale, format]);
  const [shown, setShown] = React.useState(value);
  const shownRef = React.useRef(value);
  const armed = React.useRef(false);

  React.useLayoutEffect(() => {
    if (armed.current || prefersReducedMotion()) return;
    armed.current = true;
    shownRef.current = 0;
    setShown(0);
  }, []);

  React.useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion()) {
      shownRef.current = value;
      setShown(value);
      return;
    }
    const from = shownRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      shownRef.current = from + (value - from) * eased;
      setShown(shownRef.current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  return (
    <>
      <span aria-hidden="true">{nf.format(shown)}</span>
      <span className="sr-only">{nf.format(value)}</span>
    </>
  );
}

function Sparkline({ data, seen }: { data: number[]; seen: boolean }) {
  const W = 120;
  const H = 36;
  const min = Math.min(...data);
  const span = Math.max(...data) - min || 1;
  const pts = data.map((v, i) => [(i / Math.max(1, data.length - 1)) * W, 3 + (1 - (v - min) / span) * (H - 6)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-slot="stat-sparkline"
      className="h-9 w-full overflow-visible text-foreground transition-[clip-path] duration-1000 ease-out motion-reduce:transition-none"
      style={{ clipPath: seen ? "inset(-4px -4px -4px -4px)" : "inset(-4px 100% -4px -4px)" }}
    >
      <path d={`${line} L${W},${H} L0,${H} Z`} fill="currentColor" opacity={0.1} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Arrow({ up }: { up: boolean }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-3">
      {up ? <path d="M6 10V2.5M2.75 5.5 6 2.25l3.25 3.25" /> : <path d="M6 2v7.5M2.75 6.5 6 9.75 9.25 6.5" />}
    </svg>
  );
}

function StatCard({ stat, locale, glass }: { stat: Stat; locale: string; glass?: GlassProp }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const up = stat.delta >= 0;
  const good = stat.invertDelta ? !up : up;
  const pct = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(Math.abs(stat.delta));
  return (
    <GlassSurface asChild glass={mergeGlass(CARD_OPTICS, glass)}>
      <li data-slot="stat-card" className="relative list-none">
        <div ref={ref} className="flex flex-col gap-2.5 p-4 @lg:p-5">
          <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums @lg:text-3xl">
            <CountUp value={stat.value} format={stat.format} locale={locale} active={seen} />
          </p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span
              data-slot="stat-delta"
              data-good={good}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium text-foreground tabular-nums",
                good ? "border-foreground/20 bg-foreground/10" : "border-primary/50 bg-primary/25",
              )}
            >
              <Arrow up={up} />
              <span aria-hidden="true">{pct}%</span>
              <span className="sr-only">
                {up ? "up" : "down"} {pct} percent
              </span>
            </span>
            {stat.period ? <span>{stat.period}</span> : null}
          </p>
          <Sparkline data={stat.trend} seen={seen} />
        </div>
      </li>
    </GlassSurface>
  );
}

const niceCeil = (max: number, steps: number) => {
  const raw = max / steps;
  const mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const f = raw / mag;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag * steps;
};

const PAD = { l: 44, r: 14, t: 38, b: 26 };
const CHART_H = 210;

export interface AreaChartCardProps extends Omit<React.ComponentProps<"section">, "title"> {
  title: string;
  description?: string;
  series: SeriesPoint[];
  valueFormat?: Intl.NumberFormatOptions;
  locale?: string;
  glass?: GlassProp;
}

function AreaChartCard({ title, description, series, valueFormat, locale = "en-US", glass, className, ...props }: AreaChartCardProps) {
  const uid = React.useId();
  const tableId = `${uid}-table`;
  const plotRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(640);
  const [active, setActive] = React.useState<number | null>(null);
  const [seen, setSeen] = React.useState(false);
  const [viewRef, inView] = useInView<HTMLDivElement>();
  React.useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);

  React.useEffect(() => {
    const el = plotRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => entry && setWidth(Math.max(240, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const full = React.useMemo(() => new Intl.NumberFormat(locale, valueFormat), [locale, valueFormat]);
  const compact = React.useMemo(() => new Intl.NumberFormat(locale, { ...valueFormat, notation: "compact", maximumFractionDigits: 1 }), [locale, valueFormat]);

  const n = series.length;
  const max = niceCeil(Math.max(...series.map((p) => p.value), 1), 4);
  const innerW = width - PAD.l - PAD.r;
  const innerH = CHART_H - PAD.t - PAD.b;
  const xAt = (i: number) => PAD.l + (n > 1 ? (i / (n - 1)) * innerW : innerW / 2);
  const yAt = (v: number) => PAD.t + (1 - v / max) * innerH;
  const pts = series.map((p, i) => ({ x: xAt(i), y: yAt(p.value) }));
  const line = pts.map((p, i) => {
    const prev = pts[i - 1];
    if (!prev) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    const mx = ((prev.x + p.x) / 2).toFixed(1);
    return `C${mx},${prev.y.toFixed(1)} ${mx},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");
  const base = PAD.t + innerH;
  const area = pts.length ? `${line} L${pts[pts.length - 1]?.x},${base} L${pts[0]?.x},${base} Z` : "";

  const first = series[0];
  const last = series[n - 1];
  const peak = series.reduce<SeriesPoint | undefined>((a, p) => (!a || p.value > a.value ? p : a), undefined);
  const summary =
    first && last && peak
      ? `${title}, line chart of ${n} points from ${first.label} to ${last.label}. Starts at ${full.format(first.value)}, ends at ${full.format(last.value)}, peaks at ${full.format(peak.value)} in ${peak.label}.`
      : `${title}, no data.`;

  const cur = active ?? n - 1;
  const curPoint = series[cur];
  const curPt = pts[cur];
  const step = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(innerW / 64))));

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (n < 2) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left - PAD.l) / innerW) * (n - 1));
    setActive(Math.min(n - 1, Math.max(0, i)));
  };
  const onKey = (e: React.KeyboardEvent) => {
    const delta = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    let next: number | null = delta ? cur + delta : null;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(Math.min(n - 1, Math.max(0, next)));
  };

  return (
    <GlassSurface asChild glass={mergeGlass(CARD_OPTICS, glass)}>
      <section data-slot="area-chart-card" aria-label={title} className={cn("relative p-4 @lg:p-5", className)} {...props}>
        <div ref={viewRef} className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {curPoint ? (
            <p className="shrink-0 text-right text-xs text-muted-foreground" aria-hidden="true">
              {curPoint.label}
              <span className="block text-base font-semibold text-foreground tabular-nums">{full.format(curPoint.value)}</span>
            </p>
          ) : null}
        </div>

        <div ref={plotRef} className="relative mt-2 w-full" style={{ height: CHART_H }}>
          <svg
            width={width}
            height={CHART_H}
            role="img"
            aria-label={summary}
            aria-describedby={tableId}
            className="absolute inset-0 transition-[clip-path] duration-1000 ease-out motion-reduce:transition-none"
            style={{ clipPath: seen ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
          >
            {[0, 1, 2, 3, 4].map((t) => {
              const v = (max / 4) * t;
              return (
                <g key={t}>
                  <line x1={PAD.l} x2={width - PAD.r} y1={yAt(v)} y2={yAt(v)} className="stroke-border" strokeDasharray={t ? "3 4" : undefined} />
                  <text x={PAD.l - 8} y={yAt(v) + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">
                    {compact.format(v)}
                  </text>
                </g>
              );
            })}
            {series.map((p, i) =>
              i % step === 0 ? (
                <text key={p.label} x={xAt(i)} y={CHART_H - 6} textAnchor="middle" className="fill-muted-foreground text-[11px]">
                  {p.label}
                </text>
              ) : null,
            )}
            {area ? <path d={area} className="fill-foreground/10" /> : null}
            {line ? <path d={line} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="stroke-foreground" /> : null}
            {active !== null && curPt ? (
              <g>
                <line x1={curPt.x} x2={curPt.x} y1={PAD.t} y2={base} className="stroke-foreground/35" />
                <circle cx={curPt.x} cy={curPt.y} r={4.5} strokeWidth={2} className="fill-foreground stroke-background" />
              </g>
            ) : null}
          </svg>

          {active !== null && curPoint && curPt ? (
            <div
              aria-hidden="true"
              data-slot="chart-tooltip"
              className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-border bg-card px-2.5 py-1 text-xs whitespace-nowrap text-foreground shadow-md"
              style={{ left: Math.min(width - 56, Math.max(56, curPt.x)) }}
            >
              <span className="text-muted-foreground">{curPoint.label}</span> <span className="font-semibold tabular-nums">{full.format(curPoint.value)}</span>
            </div>
          ) : null}

          {n > 0 ? (
            <div
              role="slider"
              tabIndex={0}
              aria-label={`${title}, choose a data point`}
              aria-orientation="horizontal"
              aria-valuemin={0}
              aria-valuemax={n - 1}
              aria-valuenow={cur}
              aria-valuetext={curPoint ? `${curPoint.label}: ${full.format(curPoint.value)}` : undefined}
              data-slot="chart-scrubber"
              onPointerDown={move}
              onPointerMove={move}
              onPointerLeave={(e) => e.pointerType === "mouse" && document.activeElement !== e.currentTarget && setActive(null)}
              onFocus={() => setActive((a) => a ?? n - 1)}
              onBlur={() => setActive(null)}
              onKeyDown={onKey}
              className="absolute inset-0 touch-pan-y rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          ) : null}
        </div>

        <table id={tableId} className="sr-only">
          <caption>{title}</caption>
          <thead>
            <tr>
              <th scope="col">Period</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {series.map((p) => (
              <tr key={p.label}>
                <th scope="row">{p.label}</th>
                <td>{full.format(p.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </GlassSurface>
  );
}

export interface StatCardsProps extends React.ComponentProps<"div"> {
  stats: Stat[];
  /** When given, an area chart card is rendered under the KPI grid. */
  series?: SeriesPoint[];
  chartTitle?: string;
  chartDescription?: string;
  chartFormat?: Intl.NumberFormatOptions;
  locale?: string;
  glass?: GlassProp;
}

function StatCards({ stats, series, chartTitle = "Trend", chartDescription, chartFormat, locale = "en-US", glass, className, ...props }: StatCardsProps) {
  return (
    <div data-slot="stat-cards" className={cn("@container flex w-full flex-col gap-3", className)} {...props}>
      <ul role="list" className="grid grid-cols-2 gap-3 @2xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.id} stat={s} locale={locale} glass={glass} />
        ))}
      </ul>
      {series ? <AreaChartCard title={chartTitle} description={chartDescription} series={series} valueFormat={chartFormat} locale={locale} glass={glass} /> : null}
    </div>
  );
}

export { StatCards, AreaChartCard };
