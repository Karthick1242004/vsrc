import type { DocBody } from "@/lib/docs/types";

import { doc as accordion } from "./accordion";
import { doc as textarea } from "./textarea";
import { doc as checkbox } from "./checkbox";
import { doc as radioGroup } from "./radio-group";
import { doc as datePicker } from "./date-picker";
import { doc as combobox } from "./combobox";
import { doc as otpInput } from "./otp-input";
import { doc as fileDropzone } from "./file-dropzone";
import { doc as colorPicker } from "./color-picker";
import { doc as elasticSlider } from "./elastic-slider";
import { doc as stepper } from "./stepper";
import { doc as glassNavbar } from "./glass-navbar";
import { doc as pillNav } from "./pill-nav";
import { doc as megaMenu } from "./mega-menu";
import { doc as appSidebar } from "./app-sidebar";
import { doc as radialMenu } from "./radial-menu";
import { doc as mobileTabBar } from "./mobile-tab-bar";
import { doc as drawer } from "./drawer";
import { doc as toastStack } from "./toast-stack";
import { doc as notificationCentre } from "./notification-centre";
import { doc as glassLoupe } from "./glass-loupe";
import { doc as lensCursor } from "./lens-cursor";
import { doc as liquidToggle } from "./liquid-toggle";
import { doc as dynamicIsland } from "./dynamic-island";
import { doc as refractionMarquee } from "./refraction-marquee";
import { doc as prismHeadline } from "./prism-headline";
import { doc as gooeyGlassButton } from "./gooey-glass-button";
import { doc as glassOrbLoader } from "./glass-orb-loader";
import { doc as lightbox } from "./lightbox";
import { doc as glassWindow } from "./glass-window";
import { doc as nowPlaying } from "./now-playing";
import { doc as depthCarousel } from "./depth-carousel";
import { doc as cardStack } from "./card-stack";
import { doc as dataTable } from "./data-table";
import { doc as statCards } from "./stat-cards";
import { doc as heroSection } from "./hero-section";
import { doc as pricingTable } from "./pricing-table";
import { doc as authCard } from "./auth-card";
import { doc as chatComposer } from "./chat-composer";

/** Docs for every component added after the first 19, in catalog order. */
export const NEW_DOCS: DocBody[] = [
  accordion,
  textarea,
  checkbox,
  radioGroup,
  datePicker,
  combobox,
  otpInput,
  fileDropzone,
  colorPicker,
  elasticSlider,
  stepper,
  glassNavbar,
  pillNav,
  megaMenu,
  appSidebar,
  radialMenu,
  mobileTabBar,
  drawer,
  toastStack,
  notificationCentre,
  glassLoupe,
  lensCursor,
  liquidToggle,
  dynamicIsland,
  refractionMarquee,
  prismHeadline,
  gooeyGlassButton,
  glassOrbLoader,
  lightbox,
  glassWindow,
  nowPlaying,
  depthCarousel,
  cardStack,
  dataTable,
  statCards,
  heroSection,
  pricingTable,
  authCard,
  chatComposer,
];
