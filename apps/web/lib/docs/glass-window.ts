import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "glass-window",
  title: "Glass Window",
  word: "window",
  blurb: "A draggable desktop-style window with traffic-light controls, raised to the front when pressed.",
  extendsRadix: null,
  props: [
    {
      component: "WindowDesktop",
      rows: [{ name: "className", type: "string", description: "Sizes the frame. It is `relative overflow-hidden`: windows are clamped to it and ordered among themselves by press or focus." }],
    },
    {
      component: "GlassWindow",
      rows: [
        { name: "title", type: "string", description: "Shown in the title bar and used as the window's accessible name." },
        { name: "position / defaultPosition / onPositionChange", type: "{ x: number; y: number }", default: "{ x: 24, y: 24 }", description: "Offset inside the frame, in px. Clamped while dragging and when the frame shrinks." },
        { name: "size", type: "{ width: number; height: number }", default: "{ width: 320, height: 220 }", description: "Window size in px; never wider than the frame." },
        { name: "onClose", type: "() => void", description: "Red button. The window does not remove itself; unmount it from the parent." },
        { name: "minimized / defaultMinimized / onMinimizedChange", type: "boolean", default: "false", description: "Collapses the window to its title bar (window shade) and hides the body from tab order." },
        { name: "maximized / defaultMaximized / onMaximizedChange", type: "boolean", default: "false", description: "Fills the frame. Double-clicking the title bar toggles it; dragging is off while maximized." },
        { name: "zIndex", type: "number", description: "Manual stacking, for use outside a `WindowDesktop`." },
        { name: "onActivate", type: "() => void", description: "Fires when the window is pressed or focused and raised." },
        GLASS_PROP("the window"),
      ],
    },
  ],
  a11y: [
    "Each window is a labelled group named by its title; the three traffic lights are real buttons with labels that swap (Minimize/Restore, Zoom/Exit zoom).",
    "Dragging uses pointer capture on the title bar only, so touch and mouse both work and the body stays selectable; buttons never start a drag.",
    "A minimized body is inert, so hidden controls leave the tab order.",
    "Size and shade transitions are disabled under prefers-reduced-motion.",
  ],
  optics:
    "WINDOW_OPTICS: scale −72, chroma 3, border 0.08, mapBlur 12, blur 3. A large pane wants a gentle lens and a soft rim. Dragging moves the window with transform only, so the displacement map is not regenerated; it settles once after maximize or minimize resizes the pane.",
  e2e: { surface: '[data-slot="glass-window"]' },
};
