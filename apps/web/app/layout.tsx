import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { CursorProvider } from "@/components/site/cursor";
import { SiteDock } from "@/components/site/site-dock";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Toaster } from "@/registry/vsrc/ui/toast";
import { TooltipProvider } from "@/registry/vsrc/ui/tooltip";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "vsrc — liquid glass components for React",
  description:
    "Open-source, shadcn-compatible React components with real refraction: a displacement-map optics engine bends what's behind the glass, not just blurs it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      // Next scrolls instantly on Link navigation unless told to honor the
      // CSS smooth behavior (globals.css sets it, reduced-motion resets it).
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Apply the stored theme before first paint — dark stays the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{localStorage.getItem("vsrc-theme")==="light"&&document.documentElement.classList.add("light")}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-background font-sans text-foreground antialiased">
        <CursorProvider>
          <TooltipProvider delayDuration={200}>
            <SiteHeader />
            {children}
            <SiteFooter />
            <SiteDock />
            <Toaster />
          </TooltipProvider>
        </CursorProvider>
      </body>
    </html>
  );
}
