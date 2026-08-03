import { ImageResponse } from "next/og";

import { SITE_TAGLINE } from "@/lib/site";

export const alt = "vsrc — liquid glass components for React";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The favicon art inline as a data URI — Satori renders it as an <img>. Kept in
   sync with app/icon.svg by hand (both are the monogram tile). */
const MARK =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<rect width="100" height="100" rx="22" fill="#e02723"/>' +
      '<g fill="none" stroke="#fffddb" stroke-width="13" stroke-linecap="round" ' +
      'transform="translate(50 50) scale(0.62) translate(-50 -50)">' +
      '<path d="M22 50 H55"/><path d="M46 76 L80 24"/></g></svg>',
  );

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#181616",
          color: "#fffddb",
          padding: 80,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MARK} width={132} height={132} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 128, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
            vsrc
          </div>
          <div style={{ display: "flex", fontSize: 40, color: "#a89e8a", marginTop: 24 }}>
            {`${SITE_TAGLINE} — real refraction, not blur.`}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a89e8a", letterSpacing: "0.1em" }}>
          {"// beta · MIT · shadcn registry"}
        </div>
      </div>
    ),
    size,
  );
}
