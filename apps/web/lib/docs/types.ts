/**
 * Shared shapes for per-component documentation. Lives apart from
 * `component-docs.ts` so the per-component fragments in `lib/docs/` can import
 * the helpers without a circular import through the aggregator.
 */

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface PropsGroup {
  /** Exported component the rows belong to (e.g. "DialogContent"). */
  component: string;
  rows: PropRow[];
}

/** Free components ship in the public registry; Pro ones are preview-only for now. */
export type Tier = "free" | "pro";

export type Group =
  | "Core"
  | "Forms"
  | "Navigation"
  | "Overlay"
  | "Feedback"
  | "Optics"
  | "Media"
  | "Data"
  | "Blocks";

/** What a doc author writes; tier and group come from `component-catalog.ts`. */
export interface DocBody {
  slug: string;
  title: string;
  /** The drifting display word behind the demo tile. */
  word: string;
  blurb: string;
  /** Primitive this wraps; null for from-scratch surfaces. */
  extendsRadix: { label: string; href: string } | null;
  /** The base library the component is built on when it is not a Radix primitive (input-otp, vaul, …). */
  builtOn?: { label: string; href: string };
  props: PropsGroup[];
  a11y: string[];
  optics: string;
  e2e: {
    /** Selector expected to carry data-vsrc-glass="refract" in Chromium. */
    surface?: string;
    /** Interaction that reveals a portaled surface. */
    open?: { action: "click" | "hover" | "context-menu"; target: string };
    /** Deliberately no displacement surface (position-animating material). */
    none?: boolean;
  };
}

export interface ComponentDoc extends DocBody {
  tier: Tier;
  group: Group;
}

/** Shared row: every glass component exposes the same `glass` prop. */
export const GLASS_PROP = (target = "the surface"): PropRow => ({
  name: "glass",
  type: `"subtle" | "regular" | "heavy" | LiquidGlassOptions | false`,
  description: `Optics override for ${target}. A preset name replaces the tuned values, an object merges over them, \`false\` disables refraction entirely.`,
});
