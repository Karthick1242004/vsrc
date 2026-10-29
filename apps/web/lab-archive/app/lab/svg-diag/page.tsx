// ARCHIVED — not compiled. Restore: move to apps/web/app/lab/svg-diag/page.tsx and strip the leading "// " from every line.
// import type { Metadata } from "next";
// 
// import { SvgFilterDiag } from "@/components/site/svg-filter-diag";
// 
// // Unlinked: isolates which SVG-filter piece an engine drops on HTML content.
// export const metadata: Metadata = {
//   title: "Lab · SVG filter diagnostics",
//   robots: { index: false, follow: false },
// };
// 
// export default function SvgDiagPage() {
//   return (
//     <div className="mx-auto max-w-6xl px-6 pt-10 pb-32">
//       <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">{"// lab · diagnostics"}</p>
//       <h1 className="display-stroke mt-4 font-display text-5xl">SVG filter on HTML</h1>
//       <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
//         Every tile is the same striped text with one filter variant applied via plain CSS{" "}
//         <code className="font-mono text-foreground">filter: url()</code>. Tile 0 has no filter. A tile that looks
//         identical to tile 0 means this browser dropped that variant.
//       </p>
//       <div className="mt-10">
//         <SvgFilterDiag />
//       </div>
//     </div>
//   );
// }
