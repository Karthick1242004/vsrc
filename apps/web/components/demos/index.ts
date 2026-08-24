import type * as React from "react";

import { AlertDialogDemo } from "./alert-dialog-demo";
import { ButtonDemo } from "./button-demo";
import { CardDemo } from "./card-demo";
import { CommandDemo } from "./command-demo";
import { ContextMenuDemo } from "./context-menu-demo";
import { DialogDemo } from "./dialog-demo";
import { DockDemo } from "./dock-demo";
import { DropdownMenuDemo } from "./dropdown-menu-demo";
import { GlassSurfaceDemo } from "./glass-surface-demo";
import { HoverCardDemo } from "./hover-card-demo";
import { InputDemo } from "./input-demo";
import { PopoverDemo } from "./popover-demo";
import { SelectDemo } from "./select-demo";
import { SheetDemo } from "./sheet-demo";
import { SliderDemo } from "./slider-demo";
import { SwitchDemo } from "./switch-demo";
import { TabsDemo } from "./tabs-demo";
import { ToastDemo } from "./toast-demo";
import { TooltipDemo } from "./tooltip-demo";

/** Demo component per registry slug — shared by the gallery, the playground,
 *  and the per-component doc pages. All demos are client components. */
export const DEMOS: Record<string, React.ComponentType> = {
  "glass-surface": GlassSurfaceDemo,
  button: ButtonDemo,
  card: CardDemo,
  input: InputDemo,
  select: SelectDemo,
  switch: SwitchDemo,
  slider: SliderDemo,
  tabs: TabsDemo,
  tooltip: TooltipDemo,
  popover: PopoverDemo,
  "hover-card": HoverCardDemo,
  "dropdown-menu": DropdownMenuDemo,
  "context-menu": ContextMenuDemo,
  dialog: DialogDemo,
  "alert-dialog": AlertDialogDemo,
  sheet: SheetDemo,
  command: CommandDemo,
  toast: ToastDemo,
  dock: DockDemo,
};
