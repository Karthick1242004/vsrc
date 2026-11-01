"use client";

import { Photo } from "@/components/demos/photo";
import { CardStack, type CardStackItem } from "@/registry/pro/ui/card-stack";

const STAYS = [
  { title: "Fjord Cabin", subtitle: "Flåm, Norway · €168 / night", photo: "flam" },
  { title: "Lighthouse Loft", subtitle: "Cornwall, UK · €142 / night", photo: "pendeen" },
  { title: "Cave Dome", subtitle: "Cappadocia, Türkiye · €96 / night", photo: "cappadocia" },
  { title: "Stilt House", subtitle: "Koh Lanta, Thailand · €74 / night", photo: "koh-lanta" },
  { title: "Terrace Studio", subtitle: "Valparaíso, Chile · €58 / night", photo: "valparaiso" },
  { title: "Aurora Hut", subtitle: "Lyngen, Norway · €121 / night", photo: "lyngen" },
];

/** Licensed photographs (credits on /about); `art` accepts any node, including your own `<img>`. */
export const ARTWORKS: CardStackItem[] = STAYS.map((s) => ({
  id: s.title.toLowerCase().replace(/\s+/g, "-"),
  title: s.title,
  subtitle: s.subtitle,
  art: <Photo name={s.photo} alt="" sizes="(min-width: 640px) 360px, 80vw" />,
}));

export function CardStackDemo() {
  return <CardStack items={ARTWORKS} />;
}
