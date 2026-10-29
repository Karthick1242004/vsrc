// ARCHIVED — not compiled. Restore: move to apps/web/components/site/clone-glass-lab.tsx and strip the leading "// " from every line.
// "use client";
// 
// import * as React from "react";
// import { liquidGlass, type GlassMode } from "vsrc";
// 
// import { cloneGlass, supportsMozElement, type CopySource } from "@/lib/clone-glass";
// 
// /**
//  * Manual test bench for the clone-glass experiment: one draggable pane that
//  * refracts a COPY of the scene (works without backdrop-filter: url()), and an
//  * optional pane running the shipping engine for side-by-side comparison.
//  * Each stage exercises one sync risk: CSS animations, DOM mutations, scrolling,
//  * pane drag and pane resize.
//  */
// 
// const WORDS = "refraction · dispersion · specular · caustics · chroma · rim-light · ";
// 
// type SourceChoice = "auto" | CopySource;
// 
// export function engineName(): string {
//   if (typeof navigator === "undefined") return "";
//   const ua = navigator.userAgent;
//   if (/Firefox\/(\d+)/.test(ua)) return `Firefox ${RegExp.$1}`;
//   if (/Edg\/(\d+)/.test(ua)) return `Edge ${RegExp.$1}`;
//   if (/(CriOS|FxiOS|EdgiOS)/.test(ua)) return `iOS WebKit (${RegExp.$1})`;
//   if (/Chrome\/(\d+)/.test(ua)) return `Chrome ${RegExp.$1}`;
//   if (/Version\/([\d.]+).*Safari/.test(ua)) return `Safari ${RegExp.$1}`;
//   return ua.slice(0, 60);
// }
// 
// /** Drag a positioned element inside its offset parent (pointer + touch). */
// function useDrag(ref: React.RefObject<HTMLDivElement | null>, start: { x: number; y: number }) {
//   React.useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     el.style.left = `${start.x}%`;
//     el.style.top = `${start.y}%`;
//     let ox = 0;
//     let oy = 0;
//     const down = (e: PointerEvent) => {
//       el.setPointerCapture(e.pointerId);
//       ox = e.clientX - el.offsetLeft;
//       oy = e.clientY - el.offsetTop;
//       el.dataset.dragging = "";
//     };
//     const move = (e: PointerEvent) => {
//       if (!el.hasPointerCapture(e.pointerId)) return;
//       el.style.left = `${e.clientX - ox}px`;
//       el.style.top = `${e.clientY - oy}px`;
//     };
//     const up = (e: PointerEvent) => {
//       if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
//       delete el.dataset.dragging;
//     };
//     el.addEventListener("pointerdown", down);
//     el.addEventListener("pointermove", move);
//     el.addEventListener("pointerup", up);
//     el.addEventListener("pointercancel", up);
//     return () => {
//       el.removeEventListener("pointerdown", down);
//       el.removeEventListener("pointermove", move);
//       el.removeEventListener("pointerup", up);
//       el.removeEventListener("pointercancel", up);
//     };
//   }, [ref, start.x, start.y]);
// }
// 
// function Pane({
//   paneRef,
//   hostRef,
//   label,
//   sub,
//   className,
// }: {
//   paneRef: React.RefObject<HTMLDivElement | null>;
//   hostRef?: React.RefObject<HTMLDivElement | null>;
//   label: string;
//   sub: string;
//   className?: string;
// }) {
//   return (
//     <div
//       ref={paneRef}
//       className={`absolute z-10 cursor-grab touch-none overflow-hidden rounded-[32px] shadow-[0_30px_60px_-25px_rgb(0_0_0/0.6)] select-none data-[dragging]:cursor-grabbing ${className ?? ""}`}
//     >
//       {/* The engine owns this node's children — React never renders into it. */}
//       {hostRef ? <div ref={hostRef} className="absolute inset-0" /> : null}
//       <div aria-hidden className="pointer-events-none absolute inset-0 bg-[rgb(255_253_219/0.05)]" />
//       {/* Rim light ABOVE the lens layer; an inset shadow on the pane would paint under it. */}
//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1.5px_rgb(255_253_219/0.42),inset_0_0_42px_rgb(255_253_219/0.09)]"
//       />
//       <div className="pointer-events-none absolute right-6 bottom-5 left-6 font-mono text-xs tracking-[0.2em] text-foreground uppercase">
//         <p>{label}</p>
//         <p className="mt-1 text-muted-foreground normal-case tracking-normal">{sub}</p>
//       </div>
//     </div>
//   );
// }
// 
// function MarqueeScene({ id, tick }: { id: string; tick: number }) {
//   return (
//     <div id={id} className="absolute inset-0 overflow-hidden bg-background">
//       <div className="absolute -top-1/4 -left-1/6 size-[34rem] rounded-full bg-signal/45 blur-3xl" />
//       <div className="absolute -right-1/6 -bottom-1/4 size-[30rem] rounded-full bg-primary/40 blur-3xl" />
//       <div className="absolute inset-0 flex flex-col justify-center gap-10">
//         <div className="flex w-max animate-marquee whitespace-nowrap">
//           {[0, 1].map((i) => (
//             <span key={i} className="pr-4 font-display text-[7rem] leading-none text-foreground italic sm:text-[10rem]">
//               {WORDS}
//             </span>
//           ))}
//         </div>
//         <p className="px-8 font-mono text-sm text-foreground/80">
//           {`// live DOM text — tick ${tick} — changes every 500ms; the copy must follow`}
//         </p>
//         <div className="flex w-max animate-marquee whitespace-nowrap [animation-direction:reverse]">
//           {[0, 1].map((i) => (
//             <span key={i} className="pr-4 font-display text-[7rem] leading-none text-signal italic sm:text-[10rem]">
//               {WORDS}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
// 
// function ScrollScene({ id }: { id: string }) {
//   return (
//     <div id={id} data-lenis-prevent className="absolute inset-0 overflow-y-auto bg-background">
//       <div className="flex flex-col gap-6 p-8">
//         {Array.from({ length: 18 }, (_, i) => (
//           <div
//             key={i}
//             className={`flex h-28 items-center rounded-2xl px-8 font-display text-6xl italic ${i % 3 === 0 ? "bg-primary/70 text-primary-foreground" : i % 3 === 1 ? "bg-card text-foreground" : "bg-signal/30 text-foreground"}`}
//           >
//             {`row ${String(i + 1).padStart(2, "0")} — scroll me`}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// 
// export function CloneGlassLab() {
//   const [source, setSource] = React.useState<SourceChoice>("auto");
//   const [scale, setScale] = React.useState(-80);
//   const [chroma, setChroma] = React.useState(8);
//   const [compare, setCompare] = React.useState(true);
//   const [breathe, setBreathe] = React.useState(false);
//   const [blind, setBlind] = React.useState(false);
//   const [tick, setTick] = React.useState(0);
//   const [hud, setHud] = React.useState({ engine: "", moz: false, used: "", mode: "" as GlassMode | "", fps: 0 });
// 
//   const stageA = React.useRef<HTMLDivElement | null>(null);
//   const paneA = React.useRef<HTMLDivElement | null>(null);
//   const hostA = React.useRef<HTMLDivElement | null>(null);
//   const paneB = React.useRef<HTMLDivElement | null>(null);
//   const paneC = React.useRef<HTMLDivElement | null>(null);
//   const hostC = React.useRef<HTMLDivElement | null>(null);
// 
//   useDrag(paneA, { x: 6, y: 18 });
//   useDrag(paneB, { x: 52, y: 18 });
//   useDrag(paneC, { x: 22, y: 30 });
// 
//   // DOM mutation inside the scene, twice a second.
//   React.useEffect(() => {
//     const t = window.setInterval(() => setTick((n) => n + 1), 500);
//     return () => window.clearInterval(t);
//   }, []);
// 
//   // clone-glass on both stages; rebuilt when optics or source change.
//   const [used, setUsed] = React.useState("");
//   React.useEffect(() => {
//     const sA = document.getElementById("cg-lab-scene");
//     const sC = document.getElementById("cg-lab-scroll");
//     if (!hostA.current || !hostC.current || !sA || !sC) return;
//     const opts = { scale, chroma, source };
//     const a = cloneGlass(hostA.current, sA, opts);
//     const c = cloneGlass(hostC.current, sC, opts);
//     setUsed(a.source);
//     return () => {
//       a.destroy();
//       c.destroy();
//     };
//   }, [scale, chroma, source]);
// 
//   // The shipping engine, for comparison (refract in Chromium, frosted elsewhere).
//   const [mode, setMode] = React.useState<GlassMode | "">("");
//   React.useEffect(() => {
//     if (!compare || !paneB.current) return;
//     const g = liquidGlass(paneB.current, { scale, chroma, border: 0.09, mapBlur: 14, blur: 0, saturate: 1.25 });
//     setMode(g.mode);
//     return () => g.destroy();
//   }, [compare, scale, chroma]);
// 
//   // Pane resize: exercises map regeneration + WebKit's per-id filter cache.
//   React.useEffect(() => {
//     const el = paneA.current;
//     if (!el) return;
//     let raf = 0;
//     const t0 = performance.now();
//     const loop = (now: number) => {
//       const k = breathe ? Math.sin((now - t0) / 700) : 0;
//       el.style.width = `${360 + 90 * k}px`;
//       el.style.height = `${240 + 50 * k}px`;
//       raf = requestAnimationFrame(loop);
//     };
//     raf = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(raf);
//   }, [breathe]);
// 
//   // HUD: engine + fps.
//   React.useEffect(() => {
//     let raf = 0;
//     let frames = 0;
//     let last = performance.now();
//     const loop = (now: number) => {
//       frames++;
//       if (now - last >= 1000) {
//         const fps = Math.round((frames * 1000) / (now - last));
//         frames = 0;
//         last = now;
//         setHud((h) => ({ ...h, fps }));
//       }
//       raf = requestAnimationFrame(loop);
//     };
//     raf = requestAnimationFrame(loop);
//     setHud((h) => ({ ...h, engine: engineName(), moz: supportsMozElement() }));
//     return () => cancelAnimationFrame(raf);
//   }, []);
// 
//   const control = "rounded-full border border-border bg-card px-4 py-2 font-mono text-xs text-foreground";
// 
//   return (
//     <div className="grid gap-8">
//       <div className="flex flex-wrap items-center gap-3">
//         <label className={control}>
//           source{" "}
//           <select
//             value={source}
//             onChange={(e) => setSource(e.target.value as SourceChoice)}
//             className="ml-2 bg-transparent outline-none"
//           >
//             <option value="auto">auto</option>
//             <option value="clone">clone (DOM copy)</option>
//             <option value="moz-element">moz-element (Firefox)</option>
//           </select>
//         </label>
//         <label className={control}>
//           bend {scale}
//           <input type="range" min={-160} max={-20} value={scale} onChange={(e) => setScale(+e.target.value)} className="ml-3 align-middle" />
//         </label>
//         <label className={control}>
//           fringe {chroma}
//           <input type="range" min={0} max={16} value={chroma} onChange={(e) => setChroma(+e.target.value)} className="ml-3 align-middle" />
//         </label>
//         <label className={control}>
//           <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} className="mr-2 align-middle" />
//           compare with current engine
//         </label>
//         <label className={control}>
//           <input type="checkbox" checked={breathe} onChange={(e) => setBreathe(e.target.checked)} className="mr-2 align-middle" />
//           resize pane
//         </label>
//         <label className={control}>
//           <input type="checkbox" checked={blind} onChange={(e) => setBlind(e.target.checked)} className="mr-2 align-middle" />
//           blind (show only the copy)
//         </label>
//       </div>
// 
//       <p className="font-mono text-xs leading-relaxed text-muted-foreground">
//         {`${hud.engine} · ${hud.fps} fps · clone-glass source: ${used || "…"} · -moz-element: ${hud.moz ? "yes" : "no"} · current engine mode: ${compare ? mode || "…" : "off"}`}
//       </p>
// 
//       <section aria-label="Animated scene">
//         <p className="mb-3 font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
//           {"// 1 · animated + mutating scene — drag the panes"}
//         </p>
//         <div ref={stageA} className="relative h-[34rem] overflow-hidden rounded-[32px] border border-border">
//           <MarqueeScene id="cg-lab-scene" tick={tick} />
//           {blind ? <div aria-hidden className="absolute inset-0 bg-black" /> : null}
//           <Pane paneRef={paneA} hostRef={hostA} label="clone-glass" sub={`copy source: ${used || "…"}`} className="h-60 w-[22.5rem]" />
//           {compare ? (
//             <Pane paneRef={paneB} label="current engine" sub={`backdrop-filter → ${mode || "…"}`} className="h-60 w-[22.5rem]" />
//           ) : null}
//         </div>
//       </section>
// 
//       <section aria-label="Scrolling scene">
//         <p className="mb-3 font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
//           {"// 2 · scroll inside the box — the pane must track the content"}
//         </p>
//         <div className="relative h-[30rem] overflow-hidden rounded-[32px] border border-border">
//           <ScrollScene id="cg-lab-scroll" />
//           {blind ? <div aria-hidden className="pointer-events-none absolute inset-0 bg-black" /> : null}
//           <Pane paneRef={paneC} hostRef={hostC} label="clone-glass" sub="over a scroller" className="pointer-events-none h-52 w-[26rem]" />
//         </div>
//       </section>
//     </div>
//   );
// }
