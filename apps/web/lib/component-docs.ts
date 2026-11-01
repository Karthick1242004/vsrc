/**
 * The single source of truth for per-component documentation. Pure data — no
 * JSX — so it is importable from RSC pages, route handlers (llms.txt), the
 * sitemap, and Playwright specs alike. Demo components live separately in
 * `components/demos` (client); the two are joined by slug.
 *
 * Props tables document ONLY the vsrc delta (glass, variants, custom knobs).
 * Inherited surfaces are covered by the `extends` link — auto-extracting Radix
 * prop unions produces noise, not documentation.
 */

import { CATALOG } from "@/lib/component-catalog";
import { NEW_DOCS } from "@/lib/docs";
import { GLASS_PROP, type ComponentDoc, type DocBody } from "@/lib/docs/types";

export type { ComponentDoc, DocBody, Group, PropRow, PropsGroup, Tier } from "@/lib/docs/types";

/** The 19 components that shipped first; the rest live in `lib/docs/`. */
const SHIPPED_DOCS: DocBody[] = [
  {
    slug: "glass-surface",
    title: "Glass Surface",
    word: "primitive",
    blurb: "The refraction primitive every other component builds on.",
    extendsRadix: null,
    props: [
      {
        component: "GlassSurface",
        rows: [
          {
            name: "asChild",
            type: "boolean",
            default: "false",
            description:
              "Merge the material and refraction onto the child element instead of rendering a div — how every other surface composes over Radix panes.",
          },
          GLASS_PROP("this surface"),
          {
            name: "specular",
            type: `"pointer"`,
            description:
              "A soft specular highlight tracks the cursor. Fine pointers only; never arms under reduced motion; off by default (it adds a pointermove listener).",
          },
        ],
      },
    ],
    a11y: [
      "Renders a plain div with no implied role — bring your own semantics when the surface is interactive.",
      "Under prefers-reduced-transparency the surface renders opaque (bg-card) with no backdrop effect.",
      "The pointer specular never activates when prefers-reduced-motion is set.",
    ],
    optics:
      "Engine defaults (the `regular` preset): scale −112, chroma 6, border 0.07, mapBlur 12, magnify 1 (no magnification; loupes and lenses raise it), blur 0.5, saturate 1.3. Every other component tunes these down for its surface size — this primitive is the raw material.",
    e2e: { surface: '[data-slot="glass-surface"]' },
  },
  {
    slug: "button",
    title: "Button",
    word: "press",
    blurb: "Clear glass by default, one red primary per view, ghost for quiet chrome.",
    extendsRadix: null,
    props: [
      {
        component: "Button",
        rows: [
          {
            name: "variant",
            type: `"default" | "primary" | "ghost"`,
            default: `"default"`,
            description:
              "default is clear glass; primary is red glass — one per view, by convention; ghost is quiet chrome with no glass at all.",
          },
          {
            name: "size",
            type: `"sm" | "default" | "lg" | "icon"`,
            default: `"default"`,
            description: "icon renders a square hit target — give it an aria-label.",
          },
          {
            name: "asChild",
            type: "boolean",
            default: "false",
            description: "Render the child (e.g. a Link) with button styling and optics.",
          },
          GLASS_PROP("the button face"),
        ],
      },
    ],
    a11y: [
      "A native button element — space/enter activation and disabled semantics for free.",
      "Visible focus-visible ring on every variant.",
      "The ghost variant carries no glass, so nothing refracts behind quiet chrome.",
    ],
    optics:
      "BUTTON_OPTICS: scale −56, chroma 4, border 0.16, mapBlur 8, blur 0.5 — small-control tuning; a button-sized pane can't take panel-strength displacement without smearing its label. Ghost resolves to `false`.",
    e2e: { surface: '[data-slot="button"]' },
  },
  {
    slug: "card",
    title: "Card",
    word: "panel",
    blurb: "A glass panel with the usual card anatomy.",
    extendsRadix: null,
    props: [
      {
        component: "Card",
        rows: [GLASS_PROP("the panel")],
      },
    ],
    a11y: [
      "Structural divs only — CardTitle is styled text, not a heading; nest your own h-level to fit the page outline.",
      "Interior content sits on the pane, not in nested glass, so contrast stays token-driven.",
    ],
    optics:
      "Forwards `glass` straight to GlassSurface — engine defaults. Large static panels are where full-strength refraction reads best.",
    e2e: { surface: '[data-slot="card"]' },
  },
  {
    slug: "input",
    title: "Input",
    word: "type here",
    blurb: "A glass field. The backdrop stays legible behind your text.",
    extendsRadix: null,
    props: [
      {
        component: "Input",
        rows: [GLASS_PROP("the field")],
      },
    ],
    a11y: [
      "A native input — pair it with a visible label or aria-label.",
      "Text sits in the calm interior; the edge band does the bending, so legibility never fights the effect.",
      "Visible focus-visible ring.",
    ],
    optics:
      "INPUT_OPTICS: scale −40, chroma 3, border 0.18, mapBlur 6, blur 0.5 — gentler than button; a text field's content is denser than a label, so the interior must stay stiller.",
    e2e: { surface: '[data-slot="input"]' },
  },
  {
    slug: "select",
    title: "Select",
    word: "pick one",
    blurb: "A glass trigger and a floating glass panel, Radix typeahead intact.",
    extendsRadix: {
      label: "Radix Select",
      href: "https://www.radix-ui.com/primitives/docs/components/select",
    },
    props: [
      { component: "SelectTrigger", rows: [GLASS_PROP("the trigger pill")] },
      { component: "SelectContent", rows: [GLASS_PROP("the floating panel")] },
    ],
    a11y: [
      "Radix behavior untouched: typeahead, arrow-key navigation, escape, and aria-expanded/controls wiring.",
      "The floating panel mounts in a portal a commit after the trigger — the node-driven hook re-applies optics the moment it attaches.",
    ],
    optics:
      "TRIGGER_OPTICS: scale −40, chroma 3, border 0.18, mapBlur 6, blur 0.5 on both trigger and panel. The panel is the deferred-mount case that forced the engine's node-in-state hook design.",
    e2e: {
      surface: '[data-slot="select-content"]',
      open: { action: "click", target: '[data-slot="select-trigger"]' },
    },
  },
  {
    slug: "switch",
    title: "Switch",
    word: "on / off",
    blurb: "Glass track, cream thumb, red when checked.",
    extendsRadix: {
      label: "Radix Switch",
      href: "https://www.radix-ui.com/primitives/docs/components/switch",
    },
    props: [
      { component: "Switch", rows: [GLASS_PROP("the track")] },
    ],
    a11y: [
      "Radix switch semantics: role=switch, aria-checked, space/enter toggling.",
      "Checked state is signalled by the red fill as well as aria-checked — never color alone for assistive tech.",
    ],
    optics:
      "TRACK_OPTICS: scale −32, chroma 2, border 0.22, mapBlur 5, blur 0.5 — the smallest glass surface in the registry; at 44×24 the edge band is most of the pane, so displacement stays faint.",
    e2e: { surface: '[data-slot="switch"]' },
  },
  {
    slug: "slider",
    title: "Slider",
    word: "0 — 100",
    blurb: "A glass lens for a thumb; the rim bends the track as it slides. The switch, inverted.",
    extendsRadix: {
      label: "Radix Slider",
      href: "https://www.radix-ui.com/primitives/docs/components/slider",
    },
    props: [
      {
        component: "Slider",
        rows: [
          GLASS_PROP("each thumb — the track stays flat"),
          {
            name: "thumbLabels",
            type: "string[]",
            description:
              "Accessible names for the thumbs — role=slider lives on the thumb, not the root, so a root aria-label never names the control. A bare aria-label covers the single-thumb case.",
          },
        ],
      },
    ],
    a11y: [
      "Radix slider semantics: role=slider, arrow keys, home/end, aria-valuenow.",
      "Multi-thumb ready — each thumb carries its own lens.",
    ],
    optics:
      "THUMB_OPTICS: scale −72, chroma 5, border 0.18, mapBlur 5, blur 0. Blur is zero on purpose: the thumb is a lens, and a lens must bend the track crisply — fog would read as dirt, not glass. Translation-only movement keeps the displacement map stable mid-drag.",
    e2e: { surface: '[data-slot="slider-thumb"]' },
  },
  {
    slug: "tabs",
    title: "Tabs",
    word: "sections",
    blurb: "A glass pill list with quiet triggers.",
    extendsRadix: {
      label: "Radix Tabs",
      href: "https://www.radix-ui.com/primitives/docs/components/tabs",
    },
    props: [
      { component: "TabsList", rows: [GLASS_PROP("the pill list")] },
    ],
    a11y: [
      "Radix tabs semantics: roving tab stop, arrow-key switching, aria-selected.",
      "One glass pane for the whole list — triggers inside are flat; glass never nests.",
    ],
    optics:
      "LIST_OPTICS: scale −40, chroma 3, border 0.18, mapBlur 6, blur 0.5, saturate 1.3. The gliding active indicator animates position inside the pane, so the pane itself is the only refracting surface.",
    e2e: { surface: '[data-slot="tabs-list"]' },
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    word: "hover",
    blurb: "A small glass pill on hover or focus.",
    extendsRadix: {
      label: "Radix Tooltip",
      href: "https://www.radix-ui.com/primitives/docs/components/tooltip",
    },
    props: [
      { component: "TooltipContent", rows: [GLASS_PROP("the pill")] },
    ],
    a11y: [
      "Opens on focus as well as hover — keyboard users get the same hint.",
      "Radix wires aria-describedby to the trigger automatically.",
    ],
    optics:
      "TIP_OPTICS: scale −32, chroma 2, border 0.2, mapBlur 5, blur 0.5, saturate 1.3 — switch-class tuning for the second-smallest pane in the registry.",
    e2e: {
      surface: '[data-slot="tooltip-content"]',
      open: { action: "hover", target: '[data-demo="tooltip"] [data-slot="button"]' },
    },
  },
  {
    slug: "popover",
    title: "Popover",
    word: "anchored",
    blurb: "Anchored glass panel for small forms and detail.",
    extendsRadix: {
      label: "Radix Popover",
      href: "https://www.radix-ui.com/primitives/docs/components/popover",
    },
    props: [
      { component: "PopoverContent", rows: [GLASS_PROP("the panel")] },
    ],
    a11y: [
      "Radix focus management: focus moves into the panel on open, returns to the trigger on close, escape dismisses.",
    ],
    optics:
      "Forwards `glass` to GlassSurface — engine defaults. Panel-sized, statically positioned once open: the ideal refraction case.",
    e2e: {
      surface: '[data-slot="popover-content"]',
      open: { action: "click", target: '[data-demo="popover"] [data-slot="button"]' },
    },
  },
  {
    slug: "hover-card",
    title: "Hover Card",
    word: "peek",
    blurb: "A glass preview that opens on hover or focus.",
    extendsRadix: {
      label: "Radix Hover Card",
      href: "https://www.radix-ui.com/primitives/docs/components/hover-card",
    },
    props: [
      { component: "HoverCardContent", rows: [GLASS_PROP("the preview panel")] },
    ],
    a11y: [
      "Opens on keyboard focus, not just pointer hover.",
      "Content is supplementary by design — never put required actions in a hover card.",
    ],
    optics:
      "Forwards `glass` to GlassSurface — engine defaults; the docs demo passes `glass=\"subtle\"` to show preset swapping on a real surface.",
    e2e: {
      surface: '[data-slot="hover-card-content"]',
      open: { action: "hover", target: '[data-demo="hover-card"] a, [data-demo="hover-card"] [data-slot="hover-card-trigger"]' },
    },
  },
  {
    slug: "dropdown-menu",
    title: "Dropdown Menu",
    word: "choose",
    blurb: "Glass menu with Radix keyboard navigation.",
    extendsRadix: {
      label: "Radix Dropdown Menu",
      href: "https://www.radix-ui.com/primitives/docs/components/dropdown-menu",
    },
    props: [
      { component: "DropdownMenuContent", rows: [GLASS_PROP("the menu pane")] },
    ],
    a11y: [
      "Radix menu semantics: arrow keys, typeahead, escape, focus return to the trigger.",
      "Items are flat on the pane — one glass surface per menu.",
    ],
    optics: "Forwards `glass` to GlassSurface — engine defaults.",
    e2e: {
      surface: '[data-slot="dropdown-menu-content"]',
      open: { action: "click", target: '[data-demo="dropdown-menu"] [data-slot="button"]' },
    },
  },
  {
    slug: "context-menu",
    title: "Context Menu",
    word: "right-click",
    blurb: "A glass menu anchored to the pointer on right-click.",
    extendsRadix: {
      label: "Radix Context Menu",
      href: "https://www.radix-ui.com/primitives/docs/components/context-menu",
    },
    props: [
      { component: "ContextMenuContent", rows: [GLASS_PROP("the menu pane")] },
    ],
    a11y: [
      "Keyboard users open it with the context-menu key or shift+F10 — Radix handles both.",
      "Same menu semantics as dropdown: arrows, typeahead, escape.",
    ],
    optics: "Forwards `glass` to GlassSurface — engine defaults.",
    e2e: {
      surface: '[data-slot="context-menu-content"]',
      open: { action: "context-menu", target: '[data-demo="context-menu"] [data-slot="context-menu-trigger"]' },
    },
  },
  {
    slug: "dialog",
    title: "Dialog",
    word: "modal",
    blurb: "A modal glass pane over a dimmed page.",
    extendsRadix: {
      label: "Radix Dialog",
      href: "https://www.radix-ui.com/primitives/docs/components/dialog",
    },
    props: [
      {
        component: "DialogContent",
        rows: [
          GLASS_PROP("the modal pane"),
          {
            name: "showCloseButton",
            type: "boolean",
            default: "true",
            description: "Hide the corner close affordance when the footer carries the only valid exits.",
          },
        ],
      },
    ],
    a11y: [
      "Radix modal contract: focus trap, aria-modal, labelled by DialogTitle, escape closes, focus returns to the trigger.",
      "The close button carries aria-label=\"Close\".",
    ],
    optics:
      "Forwards `glass` to GlassSurface — engine defaults. The pane animates in once (animate-glass-in) and then holds still; the map is generated after mount, so the entrance never smears.",
    e2e: {
      surface: '[data-slot="dialog-content"]',
      open: { action: "click", target: '[data-demo="dialog"] [data-slot="button"]' },
    },
  },
  {
    slug: "alert-dialog",
    title: "Alert Dialog",
    word: "confirm",
    blurb: "A modal that forces a choice: cancel, or one confirming action.",
    extendsRadix: {
      label: "Radix Alert Dialog",
      href: "https://www.radix-ui.com/primitives/docs/components/alert-dialog",
    },
    props: [
      { component: "AlertDialogContent", rows: [GLASS_PROP("the modal pane")] },
    ],
    a11y: [
      "role=alertdialog: escape and outside-click do NOT dismiss — the user must choose.",
      "Focus lands on the least destructive action first (Cancel).",
    ],
    optics: "Forwards `glass` to GlassSurface — engine defaults, same held-still entrance as Dialog.",
    e2e: {
      surface: '[data-slot="alert-dialog-content"]',
      open: { action: "click", target: '[data-demo="alert-dialog"] [data-slot="button"]' },
    },
  },
  {
    slug: "sheet",
    title: "Sheet",
    word: "slide",
    blurb: "A side panel of glass; softer optics keep big maps cheap.",
    extendsRadix: {
      label: "Radix Dialog",
      href: "https://www.radix-ui.com/primitives/docs/components/dialog",
    },
    props: [
      {
        component: "SheetContent",
        rows: [
          {
            name: "side",
            type: `"top" | "right" | "bottom" | "left"`,
            default: `"right"`,
            description: "Which edge the panel slides from.",
          },
          GLASS_PROP("the panel"),
        ],
      },
    ],
    a11y: [
      "Same Radix dialog contract as Dialog: focus trap, escape, labelled content.",
      "The slide is translation-only, so the displacement map stays valid throughout the entrance.",
    ],
    optics:
      "SHEET_OPTICS: scale −80, mapBlur 16 over engine defaults — deliberately softer. A viewport-tall pane is the biggest map in the registry; softer displacement keeps regeneration and paint cheap.",
    e2e: {
      surface: '[data-slot="sheet-content"]',
      open: { action: "click", target: '[data-demo="sheet"] [data-slot="button"]' },
    },
  },
  {
    slug: "command",
    title: "Command",
    word: "⌘K",
    blurb: "cmdk in a glass panel. Press ⌘K anywhere on this site — the palette is the same registry component.",
    extendsRadix: null,
    props: [
      {
        component: "CommandDialog",
        rows: [
          {
            name: "open / onOpenChange",
            type: "boolean / (open: boolean) => void",
            description: "Controlled open state, passed through to the underlying Dialog.",
          },
        ],
      },
    ],
    a11y: [
      "cmdk listbox semantics inside the Radix dialog focus trap.",
      "Dialog title and description are present but visually hidden (sr-only) — screen readers announce the palette.",
    ],
    optics:
      "The glass is the Dialog pane; everything inside — input, list, items — is flat. Never nest glass.",
    e2e: {
      surface: '[data-slot="dialog-content"]',
      open: { action: "click", target: '[data-demo="command"] [data-slot="button"]' },
    },
  },
  {
    slug: "toast",
    title: "Toast",
    word: "notify",
    blurb: "Glass-styled sonner. Toasts move constantly, so they skip the displacement engine by design.",
    extendsRadix: null,
    props: [
      {
        component: "toast()",
        rows: [
          {
            name: "(sonner API)",
            type: "toast(message, options)",
            description:
              "The full sonner API — this component styles the Toaster; it does not wrap the call.",
          },
        ],
      },
    ],
    a11y: [
      "sonner announces toasts via a live region; hover pauses the dismiss timer.",
      "Respects reduced motion via sonner's own handling.",
    ],
    optics:
      "CSS material only — backdrop-blur, tint, and rim, but NO displacement map. Toasts translate constantly while stacking and dismissing; a per-frame map regeneration would cost more than the effect is worth. This is the registry's precedent for every position-animating surface.",
    e2e: { none: true },
  },
  {
    slug: "dock",
    title: "Dock",
    word: "navigate",
    blurb: "The signature piece — the brand board's docked nav, in glass.",
    extendsRadix: null,
    props: [
      {
        component: "Dock",
        rows: [GLASS_PROP("the floating bar")],
      },
    ],
    a11y: [
      "A nav landmark — give each DockItem link an aria-label; icons alone don't name a destination.",
      "Fixed positioning keeps it reachable; it never overlaps focus order.",
    ],
    optics:
      "DOCK_OPTICS: scale −64, chroma 5, border 0.14, mapBlur 10, blur 1 — mid-strength; the bar floats over arbitrary page content, so it needs presence without smearing what scrolls beneath.",
    e2e: { surface: '[data-slot="dock"]' },
  },
];

const BODY_BY_SLUG = new Map<string, DocBody>(
  [...SHIPPED_DOCS, ...NEW_DOCS].map((d) => [d.slug, d]),
);

/** Every component, catalog order, with its tier and group attached. */
export const COMPONENT_DOCS: ComponentDoc[] = CATALOG.map((entry) => {
  const body = BODY_BY_SLUG.get(entry.slug);
  if (!body) throw new Error(`component-docs: no doc for catalog slug "${entry.slug}"`);
  return { ...body, ...entry };
});

export const DOC_BY_SLUG = new Map(COMPONENT_DOCS.map((d) => [d.slug, d]));
