"use client";

import { Photo } from "@/components/demos/photo";
import { Lightbox, LightboxTrigger, type LightboxItem } from "@/registry/pro/ui/lightbox";

const PHOTOS = [
  { id: "lb-skye", photo: "skye", title: "Isle of Skye", caption: "Panorama over the island's east coast." },
  { id: "lb-fjord", photo: "naeroyfjord", title: "Nærøyfjord", caption: "Still water between the walls of the fjord." },
  { id: "lb-dunes", photo: "erg-chebbi", title: "Erg Chebbi", caption: "Sunset across the dune field." },
  { id: "lb-pines", photo: "black-forest", title: "Black Forest", caption: "Hinterzarten, high in the Schwarzwald." },
  { id: "lb-ember", photo: "pacaya", title: "Pacaya", caption: "The view from the volcano, Guatemala." },
  { id: "lb-lagoon", photo: "sete-cidades", title: "Sete Cidades", caption: "Twin crater lakes on São Miguel." },
  { id: "lb-snow", photo: "lyngen", title: "Lyngen Alps", caption: "Aurora over Storfjorden and the peaks." },
  { id: "lb-moor", photo: "dartmoor", title: "Dartmoor", caption: "Open moorland in Devon." },
];

/** Licensed photographs (credits on /about); `src` takes any node, so use your own `<img>` or `<Image>`. */
export const ARTWORKS: LightboxItem[] = PHOTOS.map((p) => ({
  id: p.id,
  title: p.title,
  caption: p.caption,
  src: <Photo name={p.photo} alt={p.title} sizes="(min-width: 1024px) 56rem, 92vw" />,
}));

export function LightboxDemo() {
  return (
    <Lightbox items={ARTWORKS}>
      <div className="grid w-full max-w-xl grid-cols-4 gap-2 sm:gap-3">
        {ARTWORKS.map((item, i) => (
          <LightboxTrigger
            key={item.id}
            index={i}
            aria-label={`Open ${item.title}`}
            className="aspect-square overflow-hidden rounded-xl border border-border outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {item.src}
          </LightboxTrigger>
        ))}
      </div>
    </Lightbox>
  );
}
