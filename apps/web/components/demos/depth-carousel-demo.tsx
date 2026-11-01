"use client";

import { Photo } from "@/components/demos/photo";
import { DepthCarousel, type DepthCarouselItem } from "@/registry/pro/ui/depth-carousel";

const PHOTOS = [
  { title: "Golden Hour", caption: "Erg Chebbi, Morocco", photo: "erg-chebbi" },
  { title: "Night Signal", caption: "Shilin night market, Taipei", photo: "taipei-night-market" },
  { title: "Slow Water", caption: "Salar de Uyuni, Bolivia", photo: "uyuni" },
  { title: "Old Town", caption: "Valparaíso, Chile", photo: "valparaiso" },
  { title: "North Light", caption: "Lyngen, Norway", photo: "lyngen" },
];

/** Licensed photographs (credits on /about); any node works as `art`. */
export const ARTWORKS: DepthCarouselItem[] = PHOTOS.map((p) => ({
  id: p.title.toLowerCase().replace(/\s+/g, "-"),
  title: p.title,
  caption: p.caption,
  art: <Photo name={p.photo} alt="" sizes="(min-width: 768px) 320px, 70vw" />,
}));

export function DepthCarouselDemo() {
  return (
    <div className="w-[min(calc(100vw-6rem),40rem)]">
      <DepthCarousel items={ARTWORKS} label="Featured photographs" defaultValue={1} />
    </div>
  );
}
