import type * as React from "react";

import { AccordionDemo } from "./accordion-demo";
import { TextareaDemo } from "./textarea-demo";
import { CheckboxDemo } from "./checkbox-demo";
import { RadioGroupDemo } from "./radio-group-demo";
import { DatePickerDemo } from "./date-picker-demo";
import { ComboboxDemo } from "./combobox-demo";
import { OtpInputDemo } from "./otp-input-demo";
import { FileDropzoneDemo } from "./file-dropzone-demo";
import { ColorPickerDemo } from "./color-picker-demo";
import { ElasticSliderDemo } from "./elastic-slider-demo";
import { StepperDemo } from "./stepper-demo";
import { GlassNavbarDemo } from "./glass-navbar-demo";
import { PillNavDemo } from "./pill-nav-demo";
import { MegaMenuDemo } from "./mega-menu-demo";
import { AppSidebarDemo } from "./app-sidebar-demo";
import { RadialMenuDemo } from "./radial-menu-demo";
import { MobileTabBarDemo } from "./mobile-tab-bar-demo";
import { DrawerDemo } from "./drawer-demo";
import { ToastStackDemo } from "./toast-stack-demo";
import { NotificationCentreDemo } from "./notification-centre-demo";
import { GlassLoupeDemo } from "./glass-loupe-demo";
import { LensCursorDemo } from "./lens-cursor-demo";
import { LiquidToggleDemo } from "./liquid-toggle-demo";
import { DynamicIslandDemo } from "./dynamic-island-demo";
import { RefractionMarqueeDemo } from "./refraction-marquee-demo";
import { PrismHeadlineDemo } from "./prism-headline-demo";
import { GooeyGlassButtonDemo } from "./gooey-glass-button-demo";
import { GlassOrbLoaderDemo } from "./glass-orb-loader-demo";
import { LightboxDemo } from "./lightbox-demo";
import { GlassWindowDemo } from "./glass-window-demo";
import { NowPlayingDemo } from "./now-playing-demo";
import { DepthCarouselDemo } from "./depth-carousel-demo";
import { CardStackDemo } from "./card-stack-demo";
import { DataTableDemo } from "./data-table-demo";
import { StatCardsDemo } from "./stat-cards-demo";
import { HeroSectionDemo } from "./hero-section-demo";
import { PricingTableDemo } from "./pricing-table-demo";
import { AuthCardDemo } from "./auth-card-demo";
import { ChatComposerDemo } from "./chat-composer-demo";
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
  "accordion": AccordionDemo,
  "textarea": TextareaDemo,
  "checkbox": CheckboxDemo,
  "radio-group": RadioGroupDemo,
  "date-picker": DatePickerDemo,
  "combobox": ComboboxDemo,
  "otp-input": OtpInputDemo,
  "file-dropzone": FileDropzoneDemo,
  "color-picker": ColorPickerDemo,
  "elastic-slider": ElasticSliderDemo,
  "stepper": StepperDemo,
  "glass-navbar": GlassNavbarDemo,
  "pill-nav": PillNavDemo,
  "mega-menu": MegaMenuDemo,
  "app-sidebar": AppSidebarDemo,
  "radial-menu": RadialMenuDemo,
  "mobile-tab-bar": MobileTabBarDemo,
  "drawer": DrawerDemo,
  "toast-stack": ToastStackDemo,
  "notification-centre": NotificationCentreDemo,
  "glass-loupe": GlassLoupeDemo,
  "lens-cursor": LensCursorDemo,
  "liquid-toggle": LiquidToggleDemo,
  "dynamic-island": DynamicIslandDemo,
  "refraction-marquee": RefractionMarqueeDemo,
  "prism-headline": PrismHeadlineDemo,
  "gooey-glass-button": GooeyGlassButtonDemo,
  "glass-orb-loader": GlassOrbLoaderDemo,
  "lightbox": LightboxDemo,
  "glass-window": GlassWindowDemo,
  "now-playing": NowPlayingDemo,
  "depth-carousel": DepthCarouselDemo,
  "card-stack": CardStackDemo,
  "data-table": DataTableDemo,
  "stat-cards": StatCardsDemo,
  "hero-section": HeroSectionDemo,
  "pricing-table": PricingTableDemo,
  "auth-card": AuthCardDemo,
  "chat-composer": ChatComposerDemo,
};
