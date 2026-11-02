import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { CommandMenu } from "@/components/site/command-menu";
import { CursorProvider } from "@/components/site/cursor";
import { StatusBanner } from "@/components/site/status-banner";
import { GlassTunerProvider } from "@/components/site/glass-tuner";
import { SiteLoader } from "@/components/site/loader";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { SiteDock } from "@/components/site/site-dock";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Toaster } from "@/registry/vsrc/ui/toast";
import { TooltipProvider } from "@/registry/vsrc/ui/tooltip";
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "vsrc — liquid glass components for React (Beta)",
    template: "%s · vsrc",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [AUTHOR],
  creator: AUTHOR.name,
  keywords: [
    "react components",
    "shadcn",
    "shadcn registry",
    "liquid glass",
    "glassmorphism",
    "backdrop-filter",
    "refraction",
    "glass ui",
    "tailwind css",
    "next.js",
  ],
  category: "technology",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "vsrc — liquid glass components for React",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "vsrc — liquid glass components for React",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// Structured data so search engines read the site and the library as first-class
// entities (rich results, knowledge-graph linking).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: SITE_NAME,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      license: "https://opensource.org/licenses/MIT",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteLoader />
        <SmoothScroll />
        <GlassTunerProvider>
        <CursorProvider>
          <TooltipProvider delayDuration={200}>
            <StatusBanner />
            <SiteHeader />
            {children}
            <SiteFooter />
            <SiteDock />
            <Toaster />
            <CommandMenu />
          </TooltipProvider>
        </CursorProvider>
        </GlassTunerProvider>
      </body>
    </html>
  );
}
