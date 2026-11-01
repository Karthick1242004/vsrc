"use client";

import * as React from "react";
import { GlassProvider, type LiquidGlassOptions } from "vsrc/react";

import { Popover, PopoverContent, PopoverTrigger } from "@/registry/vsrc/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/vsrc/ui/tooltip";

/** Only the knobs a visitor moved are stored; unset ones keep each component's own tuning. */
interface Tune {
  blur?: number;
  bend?: number;
  chroma?: number;
  tint?: number;
  rim?: number;
}

const KNOBS = [
  { key: "blur", label: "Clarity blur", min: 0, max: 4, step: 0.25, base: 0.5, unit: "px" },
  { key: "bend", label: "Bend", min: 0, max: 200, step: 4, base: 112, unit: "" },
  { key: "chroma", label: "Prism", min: 0, max: 12, step: 1, base: 6, unit: "" },
  { key: "tint", label: "Tint", min: 0, max: 40, step: 2, base: 14, unit: "%" },
  { key: "rim", label: "Rim", min: 0, max: 30, step: 2, base: 14, unit: "%" },
] as const;

const STORE = "vsrc-glass-tune";

function optionsOf(t: Tune): LiquidGlassOptions {
  const o: LiquidGlassOptions = {};
  if (t.blur !== undefined) o.blur = t.blur;
  if (t.bend !== undefined) o.scale = -t.bend;
  if (t.chroma !== undefined) o.chroma = t.chroma;
  return o;
}

// The material tokens are theme-specific: dark tints toward warm black, light toward cream paper.
function tokensOf(t: Tune, light: boolean) {
  return {
    "--glass-tint": t.tint === undefined ? null : `color-mix(in oklab, ${light ? "#fffbea" : "#221f1f"} ${t.tint}%, transparent)`,
    "--glass-border": t.rim === undefined ? null : `color-mix(in oklab, ${light ? "#181616" : "#fffddb"} ${t.rim}%, transparent)`,
  };
}

const TunerContext = React.createContext<{ tune: Tune; setTune: (t: Tune) => void }>({ tune: {}, setTune: () => {} });

export function GlassTunerProvider({ children }: { children: React.ReactNode }) {
  const [tune, setTuneState] = React.useState<Tune>({});

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) setTuneState(JSON.parse(raw) as Tune);
    } catch {}
  }, []);

  const setTune = React.useCallback((t: Tune) => {
    setTuneState(t);
    try {
      localStorage.setItem(STORE, JSON.stringify(t));
    } catch {}
  }, []);

  // Re-applied when the theme class flips, so tint and rim follow light/dark.
  React.useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      for (const [name, value] of Object.entries(tokensOf(tune, root.classList.contains("light")))) {
        if (value) root.style.setProperty(name, value);
        else root.style.removeProperty(name);
      }
    };
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [tune]);

  return (
    <TunerContext.Provider value={{ tune, setTune }}>
      <GlassProvider value={optionsOf(tune)}>{children}</GlassProvider>
    </TunerContext.Provider>
  );
}

function configText(t: Tune) {
  const o = optionsOf(t);
  const tokens = Object.entries(tokensOf(t, false)).filter(([, v]) => v);
  return [
    `import { GlassProvider } from "vsrc/react"`,
    ``,
    `<GlassProvider value={${JSON.stringify(o).replace(/"(\w+)":/g, "$1: ")}}>`,
    `  {children}`,
    `</GlassProvider>`,
    ...(tokens.length ? [``, `/* globals.css */`, `:root {`, ...tokens.map(([k, v]) => `  ${k}: ${v};`), `}`] : []),
  ].join("\n");
}

/** Dock control: live sliders for the whole site's glass, plus the config to paste into your app. */
export function GlassTuner() {
  const { tune, setTune } = React.useContext(TunerContext);
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(configText(tune));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger aria-label="Tune glass" className="grid size-10 place-items-center rounded-full">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden className="size-5">
              <path d="M4 6h7M15 6h1M4 14h1M9 14h7" />
              <circle cx="13" cy="6" r="2" />
              <circle cx="7" cy="14" r="2" />
            </svg>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Tune glass</TooltipContent>
      </Tooltip>
      <PopoverContent side="top" sideOffset={14} className="w-72 p-5">
        <p className="font-display text-xl">Tune the glass</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Applies to every surface on the site. Copy the result into your app.</p>
        <div className="mt-4 grid gap-3">
          {KNOBS.map((k) => {
            const value = tune[k.key] ?? k.base;
            const id = `tune-${k.key}`;
            return (
              <div key={k.key} className="grid gap-1">
                <label htmlFor={id} className="flex justify-between text-xs">
                  <span>{k.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {value}
                    {k.unit}
                  </span>
                </label>
                <input
                  id={id}
                  type="range"
                  min={k.min}
                  max={k.max}
                  step={k.step}
                  value={value}
                  onChange={(e) => setTune({ ...tune, [k.key]: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={copy} className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            {copied ? "Copied" : "Copy config"}
          </button>
          <button type="button" onClick={() => setTune({})} className="rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            Reset
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
