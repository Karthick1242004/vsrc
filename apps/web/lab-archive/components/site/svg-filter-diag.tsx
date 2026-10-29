// ARCHIVED — not compiled. Restore: move to apps/web/components/site/svg-filter-diag.tsx and strip the leading "// " from every line.
// "use client";
// 
// import * as React from "react";
// 
// /**
//  * Isolates which SVG-filter ingredient an engine drops on HTML content.
//  * Each tile varies ONE thing; all maps are a full-tile ramp (strong, obvious
//  * shear) rather than the subtle rim map, so a working tile cannot be mistaken
//  * for the unfiltered control.
//  */
// 
// const W = 320;
// const H = 180;
// const SCALE = -60;
// 
// function rampPng(): string {
//   const c = document.createElement("canvas");
//   c.width = W;
//   c.height = H;
//   const ctx = c.getContext("2d")!;
//   const gx = ctx.createLinearGradient(0, 0, W, 0);
//   gx.addColorStop(0, "rgb(0,0,0)");
//   gx.addColorStop(1, "rgb(255,0,0)");
//   ctx.fillStyle = gx;
//   ctx.fillRect(0, 0, W, H);
//   const gy = ctx.createLinearGradient(0, 0, 0, H);
//   gy.addColorStop(0, "rgb(0,0,0)");
//   gy.addColorStop(1, "rgb(0,0,255)");
//   ctx.globalCompositeOperation = "difference";
//   ctx.fillStyle = gy;
//   ctx.fillRect(0, 0, W, H);
//   return c.toDataURL();
// }
// 
// function rampSvg(): string {
//   const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="x"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#f00"/></linearGradient><linearGradient id="y" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#00f"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#x)"/><rect width="100%" height="100%" fill="url(#y)" style="mix-blend-mode:screen"/></svg>`;
//   return `data:image/svg+xml,${encodeURIComponent(svg)}`;
// }
// 
// const TILES: { id: string; label: string; note: string }[] = [
//   { id: "", label: "0 · no filter", note: "control" },
//   { id: "dg-turb", label: "1 · feTurbulence map", note: "no feImage at all" },
//   { id: "dg-png-px", label: "2 · PNG data URL, px units", note: "what clone-glass uses" },
//   { id: "dg-png-bbox", label: "3 · PNG data URL, bbox units", note: "primitiveUnits=objectBoundingBox" },
//   { id: "dg-svg", label: "4 · SVG data URL map", note: "gradients, no canvas" },
//   { id: "dg-ref", label: "5 · feImage → #element", note: "references an <image> by id" },
//   { id: "dg-xlink", label: "6 · xlink:href only", note: "legacy attribute" },
//   { id: "dg-full", label: "7 · full clone-glass chain", note: "3 passes + fringe + sRGB" },
//   { id: "dg-png-nosub", label: "8 · PNG, px units, no x/y/w/h", note: "feImage fills the filter region" },
// ];
// 
// const KEEP = [
//   "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
//   "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
//   "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
// ];
// 
// function Specimen() {
//   return (
//     <div
//       className="flex h-full w-full items-center justify-center"
//       style={{
//         background:
//           "repeating-linear-gradient(90deg, #e02723 0 14px, #181616 14px 28px), #181616",
//       }}
//     >
//       <span className="font-display text-6xl text-foreground italic">refraction</span>
//     </div>
//   );
// }
// 
// export function SvgFilterDiag() {
//   const [png, setPng] = React.useState("");
//   const [svg, setSvg] = React.useState("");
//   const [ua, setUa] = React.useState("");
// 
//   React.useEffect(() => {
//     setPng(rampPng());
//     setSvg(rampSvg());
//     setUa(navigator.userAgent);
//   }, []);
// 
//   // Set xlink:href imperatively — React drops the namespaced attribute.
//   const xlinkRef = React.useRef<SVGFEImageElement | null>(null);
//   React.useEffect(() => {
//     if (png && xlinkRef.current) xlinkRef.current.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", png);
//   }, [png]);
// 
//   const disp = (inp = "SourceGraphic", map = "map", scale = SCALE) => (
//     <feDisplacementMap in={inp} in2={map} scale={scale} xChannelSelector="R" yChannelSelector="B" />
//   );
//   const sRGB = { colorInterpolationFilters: "sRGB" as const };
// 
//   return (
//     <div className="grid gap-6">
//       <p className="font-mono text-xs break-all text-muted-foreground">{ua}</p>
//       {png ? (
//         <svg width="0" height="0" aria-hidden className="absolute">
//           <defs>
//             <image id="dg-map-img" href={png} width={W} height={H} preserveAspectRatio="none" />
//             <filter id="dg-turb" x="0" y="0" width="1" height="1" {...sRGB}>
//               <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves={2} seed={4} result="map" />
//               {disp("SourceGraphic", "map", 50)}
//             </filter>
//             <filter id="dg-png-px" x="0" y="0" width="1" height="1" primitiveUnits="userSpaceOnUse" {...sRGB}>
//               <feImage href={png} x="0" y="0" width={W} height={H} preserveAspectRatio="none" result="map" />
//               {disp()}
//             </filter>
//             <filter id="dg-png-bbox" x="0" y="0" width="1" height="1" primitiveUnits="objectBoundingBox" {...sRGB}>
//               <feImage href={png} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
//               {/* In bbox units scale is a fraction of the box, not px. */}
//               {disp("SourceGraphic", "map", SCALE / W)}
//             </filter>
//             <filter id="dg-svg" x="0" y="0" width="1" height="1" primitiveUnits="userSpaceOnUse" {...sRGB}>
//               <feImage href={svg} x="0" y="0" width={W} height={H} preserveAspectRatio="none" result="map" />
//               {disp()}
//             </filter>
//             <filter id="dg-ref" x="0" y="0" width="1" height="1" primitiveUnits="userSpaceOnUse" {...sRGB}>
//               <feImage href="#dg-map-img" x="0" y="0" width={W} height={H} result="map" />
//               {disp()}
//             </filter>
//             <filter id="dg-xlink" x="0" y="0" width="1" height="1" primitiveUnits="userSpaceOnUse" {...sRGB}>
//               <feImage ref={xlinkRef} x="0" y="0" width={W} height={H} preserveAspectRatio="none" result="map" />
//               {disp()}
//             </filter>
//             <filter id="dg-png-nosub" x="0" y="0" width="1" height="1" primitiveUnits="userSpaceOnUse" {...sRGB}>
//               <feImage href={png} preserveAspectRatio="none" result="map" />
//               {disp()}
//             </filter>
//             <filter id="dg-full-bbox" x="0" y="0" width="1" height="1" primitiveUnits="objectBoundingBox" {...sRGB}>
//               <feImage href={png} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
//               {[0, 1, 2].map((i) => (
//                 <React.Fragment key={i}>
//                   <feDisplacementMap in="SourceGraphic" in2="map" scale={(SCALE + i * 8) / W} xChannelSelector="R" yChannelSelector="B" result={`d${i}`} />
//                   <feColorMatrix in={`d${i}`} type="matrix" values={KEEP[i]} result={`c${i}`} />
//                 </React.Fragment>
//               ))}
//               <feBlend in="c0" in2="c1" mode="screen" result="c01" />
//               <feBlend in="c01" in2="c2" mode="screen" />
//             </filter>
//             <filter id="dg-full" x="0" y="0" width="1" height="1" primitiveUnits="userSpaceOnUse" {...sRGB}>
//               <feImage href={png} x="0" y="0" width={W} height={H} preserveAspectRatio="none" result="map" />
//               {[0, 1, 2].map((i) => (
//                 <React.Fragment key={i}>
//                   <feDisplacementMap in="SourceGraphic" in2="map" scale={SCALE + i * 8} xChannelSelector="R" yChannelSelector="B" result={`d${i}`} />
//                   <feColorMatrix in={`d${i}`} type="matrix" values={KEEP[i]} result={`c${i}`} />
//                 </React.Fragment>
//               ))}
//               <feBlend in="c0" in2="c1" mode="screen" result="c01" />
//               <feBlend in="c01" in2="c2" mode="screen" />
//             </filter>
//           </defs>
//         </svg>
//       ) : null}
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//         {TILES.map((t) => (
//           <figure key={t.label} className="grid gap-2">
//             <div className="overflow-hidden rounded-2xl border border-border" style={{ width: W, height: H }}>
//               <div style={{ width: W, height: H, filter: t.id && png ? `url(#${t.id})` : undefined }}>
//                 <Specimen />
//               </div>
//             </div>
//             <figcaption className="font-mono text-xs text-foreground">
//               {t.label}
//               <span className="block text-muted-foreground">{t.note}</span>
//             </figcaption>
//           </figure>
//         ))}
//       </div>
// 
//       <h2 className="mt-10 font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
//         {"// compositing triggers — every tile uses tile 3's filter (proven in Safari)"}
//       </h2>
//       <style>{"@keyframes dg-slide{from{transform:translateX(0)}to{transform:translateX(-56px)}}"}</style>
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//         {TRIGGERS.map((t) => (
//           <figure key={t.label} className="grid gap-2">
//             <div className="overflow-hidden rounded-2xl border border-border" style={{ width: W, height: H }}>
//               <div style={{ width: W, height: H, position: "relative", overflow: t.lensClip ? "hidden" : undefined, filter: png ? `url(#${t.filter ?? "dg-png-bbox"})` : undefined }}>
//                 <t.Content />
//               </div>
//             </div>
//             <figcaption className="font-mono text-xs text-foreground">
//               {t.label}
//               <span className="block text-muted-foreground">{t.note}</span>
//             </figcaption>
//           </figure>
//         ))}
//       </div>
//     </div>
//   );
// }
// 
// /* ---- compositing-trigger specimens: each adds ONE thing to the static tile ---- */
// 
// function Animated() {
//   return (
//     <div style={{ width: W + 60, height: H, animation: "dg-slide 2s linear infinite alternate" }}>
//       <Specimen />
//     </div>
//   );
// }
// 
// function Scroller({ hidden }: { hidden?: boolean }) {
//   const ref = React.useRef<HTMLDivElement | null>(null);
//   React.useEffect(() => {
//     if (!hidden) return;
//     let raf = 0;
//     const loop = (now: number) => {
//       if (ref.current) ref.current.scrollTop = 40 + 40 * Math.sin(now / 600);
//       raf = requestAnimationFrame(loop);
//     };
//     raf = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(raf);
//   }, [hidden]);
//   return (
//     <div ref={ref} data-lenis-prevent style={{ width: W, height: H, overflowY: hidden ? "hidden" : "auto" }}>
//       <div style={{ height: H * 2 }}>
//         <Specimen />
//       </div>
//     </div>
//   );
// }
// 
// function WillChange() {
//   return (
//     <div style={{ width: W, height: H, willChange: "transform" }}>
//       <Specimen />
//     </div>
//   );
// }
// 
// function BlurChild() {
//   return (
//     <div style={{ position: "relative", width: W, height: H }}>
//       <Specimen />
//       <div style={{ position: "absolute", left: 40, top: 30, width: 120, height: 120, borderRadius: 999, background: "#ff3831", filter: "blur(24px)", opacity: 0.6 }} />
//     </div>
//   );
// }
// 
// /** Candidate fix: animation removed; the same motion written inline by rAF. */
// function InlineDriven() {
//   const ref = React.useRef<HTMLDivElement | null>(null);
//   React.useEffect(() => {
//     let raf = 0;
//     const loop = (now: number) => {
//       const p = (Math.sin(now / 640) + 1) / 2;
//       if (ref.current) ref.current.style.transform = `translateX(${-56 * p}px)`;
//       raf = requestAnimationFrame(loop);
//     };
//     raf = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(raf);
//   }, []);
//   return (
//     <div ref={ref} style={{ width: W + 60, height: H }}>
//       <Specimen />
//     </div>
//   );
// }
// 
// /** clone-glass's own layout: clipped lens, oversized child moved by a 2D translate. */
// function LensLayout() {
//   return (
//     <div style={{ position: "absolute", left: 0, top: 0, width: W + 80, height: H + 60, transform: "translate(-40px, -30px)" }}>
//       <div style={{ width: W + 80, height: H + 60 }}>
//         <Specimen />
//       </div>
//     </div>
//   );
// }
// 
// const TRIGGERS: { label: string; note: string; Content: React.ComponentType; filter?: string; lensClip?: boolean }[] = [
//   { label: "9 · full chain, bbox, static", note: "clone-glass's filter chain", Content: Specimen, filter: "dg-full-bbox" },
//   { label: "10 · CSS transform animation", note: "trigger: accelerated animation", Content: Animated },
//   { label: "11 · overflow: auto scroller", note: "trigger: composited scrolling", Content: () => <Scroller /> },
//   { label: "12 · will-change: transform", note: "trigger: forced layer", Content: WillChange },
//   { label: "13 · filter: blur() child", note: "trigger?: filtered descendant", Content: BlurChild },
//   { label: "14 · FIX: inline rAF transform", note: "same motion as 10, no CSS animation", Content: InlineDriven },
//   { label: "15 · FIX: overflow hidden + scrollTop", note: "same scroll as 11, not user-scrollable", Content: () => <Scroller hidden /> },
//   { label: "16 · clone-glass lens layout", note: "overflow hidden + translated child", Content: LensLayout, lensClip: true },
// ];
