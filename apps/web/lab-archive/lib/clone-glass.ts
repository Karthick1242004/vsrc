// ARCHIVED — not compiled. Restore: move to apps/web/lib/clone-glass.ts and strip the leading "// " from every line.
// /*
//  * clone-glass — EXPERIMENTAL cross-engine refraction (lab only, not shipped).
//  *
//  * Chromium filters the real backdrop (`backdrop-filter: url(#svg)`); WebKit and
//  * Gecko parse that and silently drop it. Every engine does paint a plain
//  * `filter: url(#svg)` on an ordinary element, so this refracts a COPY of the
//  * scene instead: a lens layer inside the pane holds a live copy, counter-
//  * positioned to line up pixel-for-pixel with what is behind the pane, and the
//  * vsrc optic (gradient-difference displacement map, three per-channel passes
//  * for the prism fringe, sRGB interpolation) runs on that copy.
//  *
//  * Copy source:
//  *   - "moz-element": Gecko's `-moz-element(#scene)` — a live paint, no DOM work.
//  *   - "clone": deep DOM clone kept in sync (mutations, WAAPI clock, scroll).
//  *
//  * Known limits of "clone": canvas pixels, <video> playback, form values,
//  * :hover/:focus state and ancestor-dependent styles are not mirrored.
//  */
// 
// const SVG_NS = "http://www.w3.org/2000/svg";
// const XLINK_NS = "http://www.w3.org/1999/xlink";
// 
// export type CopySource = "moz-element" | "clone";
// 
// export interface CloneGlassOptions {
//   /** Displacement strength; negative = magnifying rim. */
//   scale?: number;
//   /** Per-channel scale stagger (prism fringe). */
//   chroma?: number;
//   /** Rim band as a fraction of the pane's smaller side. */
//   border?: number;
//   /** Rim curvature (px). */
//   mapBlur?: number;
//   saturate?: number;
//   source?: "auto" | CopySource;
// }
// 
// export interface CloneGlassInstance {
//   readonly source: CopySource;
//   destroy(): void;
// }
// 
// const DEFAULTS = { scale: -80, chroma: 8, border: 0.09, mapBlur: 14, saturate: 1.25 };
// 
// let uid = 0;
// let defs: SVGDefsElement | null = null;
// 
// export function supportsMozElement(): boolean {
//   return typeof CSS !== "undefined" && CSS.supports("background-image", "-moz-element(#a)");
// }
// 
// function ensureDefs(): SVGDefsElement {
//   if (defs && defs.isConnected) return defs;
//   const svg = document.createElementNS(SVG_NS, "svg");
//   svg.setAttribute("width", "0");
//   svg.setAttribute("height", "0");
//   svg.setAttribute("aria-hidden", "true");
//   svg.style.position = "absolute";
//   defs = document.createElementNS(SVG_NS, "defs");
//   svg.appendChild(defs);
//   document.body.appendChild(svg);
//   return defs;
// }
// 
// /** Map sized to the lens layer (pane + margin m). The margin and the pane's
//  *  interior are neutral gray; only the rim band carries the ramps. */
// function makeMap(lw: number, lh: number, m: number, w: number, h: number, radius: number, border: number, mapBlur: number): string {
//   const c = document.createElement("canvas");
//   c.width = lw;
//   c.height = lh;
//   const ctx = c.getContext("2d")!;
//   ctx.save();
//   ctx.translate(m, m);
//   const gx = ctx.createLinearGradient(0, 0, w, 0);
//   gx.addColorStop(0, "rgb(0,0,0)");
//   gx.addColorStop(1, "rgb(255,0,0)");
//   ctx.fillStyle = gx;
//   ctx.fillRect(0, 0, w, h);
//   const gy = ctx.createLinearGradient(0, 0, 0, h);
//   gy.addColorStop(0, "rgb(0,0,0)");
//   gy.addColorStop(1, "rgb(0,0,255)");
//   ctx.globalCompositeOperation = "difference";
//   ctx.fillStyle = gy;
//   ctx.fillRect(0, 0, w, h);
//   ctx.restore();
//   ctx.globalCompositeOperation = "source-over";
//   const frame = new Path2D();
//   frame.rect(0, 0, lw, lh);
//   frame.roundRect(m, m, w, h, radius);
//   ctx.fillStyle = "rgb(128,128,128)";
//   ctx.fill(frame, "evenodd");
//   const inset = border * Math.min(w, h);
//   ctx.filter = `blur(${mapBlur}px)`;
//   ctx.fillStyle = "rgba(128,128,128,0.93)";
//   ctx.beginPath();
//   ctx.roundRect(m + inset, m + inset, w - inset * 2, h - inset * 2, Math.max(radius - inset, 2));
//   ctx.fill();
//   ctx.filter = "none";
//   return c.toDataURL();
// }
// 
// function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string>): SVGElementTagNameMap[K] {
//   const node = document.createElementNS(SVG_NS, tag);
//   for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
//   return node;
// }
// 
// /**
//  * A complete, ready filter: map and scales are baked in BEFORE insertion.
//  * WebKit ignores feImage href changes on a filter already in the document,
//  * so every map change builds a new filter rather than mutating this one.
//  */
// function buildFilter(id: string, url: string, scales: number[], saturate: number): SVGFilterElement {
//   // objectBoundingBox primitives: WebKit mis-places a px-positioned feImage
//   // under a CSS filter on HTML (the map lands off-element and the whole
//   // output goes blank); fractions of the box work in every engine.
//   const f = el("filter", {
//     id,
//     x: "0",
//     y: "0",
//     width: "1",
//     height: "1",
//     filterUnits: "objectBoundingBox",
//     primitiveUnits: "objectBoundingBox",
//     // Load-bearing: linearRGB would turn neutral gray 128 into a constant shift.
//     "color-interpolation-filters": "sRGB",
//   });
//   const img = el("feImage", { x: "0", y: "0", width: "1", height: "1", preserveAspectRatio: "none", result: "map", href: url });
//   img.setAttributeNS(XLINK_NS, "xlink:href", url);
//   f.appendChild(img);
//   const keep = [
//     "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
//     "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
//     "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
//   ];
//   scales.forEach((sc, i) => {
//     f.appendChild(
//       el("feDisplacementMap", { in: "SourceGraphic", in2: "map", scale: String(sc), xChannelSelector: "R", yChannelSelector: "B", result: `d${i}` }),
//     );
//     f.appendChild(el("feColorMatrix", { in: `d${i}`, type: "matrix", values: keep[i]!, result: `c${i}` }));
//   });
//   f.appendChild(el("feBlend", { in: "c0", in2: "c1", mode: "screen", result: "c01" }));
//   f.appendChild(el("feBlend", { in: "c01", in2: "c2", mode: "screen", result: "rgb" }));
//   f.appendChild(el("feColorMatrix", { in: "rgb", type: "saturate", values: String(saturate) }));
//   ensureDefs().appendChild(f);
//   return f;
// }
// 
// interface Twin {
//   src: HTMLElement;
//   dst: HTMLElement;
// }
// 
// function pathOf(root: Element, el: Element): number[] | null {
//   const path: number[] = [];
//   for (let n: Element | null = el; n && n !== root; n = n.parentElement) {
//     const p: Element | null = n.parentElement;
//     if (!p) return null;
//     path.unshift(Array.prototype.indexOf.call(p.children, n));
//   }
//   return path;
// }
// 
// function nodeAt(root: Element, path: number[]): HTMLElement | null {
//   let n: Element | undefined = root;
//   for (const i of path) n = n?.children[i];
//   return (n as HTMLElement | undefined) ?? null;
// }
// 
// const SCROLLS = new Set(["auto", "scroll"]);
// 
// /**
//  * Keep the copy OFF the compositor. WebKit applies SVG reference filters only
//  * when it paints in software; if anything inside the filtered layer gets its
//  * own compositing layer (accelerated CSS animations, scrollable overflow,
//  * will-change), the filter is handed to Core Animation, which cannot run SVG
//  * filters, and Safari silently drops it. So the copy gets no animations and no
//  * scrollers: animated elements are posed inline from their originals every
//  * frame, and scroll containers become overflow:hidden with mirrored offsets.
//  */
// function decomposite(scene: HTMLElement, copy: HTMLElement): { animated: Twin[]; scrollers: Twin[] } {
//   for (const n of [copy, ...copy.querySelectorAll<HTMLElement>("*")]) {
//     if (!n.style) continue;
//     n.style.animation = "none";
//     n.style.transition = "none";
//     n.style.willChange = "auto";
//   }
//   const twin = (src: Element): Twin | null => {
//     const path = pathOf(scene, src);
//     const dst = path && nodeAt(copy, path);
//     return dst ? { src: src as HTMLElement, dst } : null;
//   };
//   const targets = new Set<Element>();
//   for (const a of scene.getAnimations({ subtree: true })) {
//     const t = (a.effect as KeyframeEffect | null)?.target;
//     if (t) targets.add(t);
//   }
//   const animated = [...targets].map(twin).filter((x): x is Twin => x !== null);
//   const scrollers: Twin[] = [];
//   for (const src of [scene, ...scene.querySelectorAll("*")]) {
//     const cs = getComputedStyle(src);
//     if (!SCROLLS.has(cs.overflowY) && !SCROLLS.has(cs.overflowX)) continue;
//     const t = twin(src);
//     if (!t) continue;
//     t.dst.style.overflow = "hidden";
//     scrollers.push(t);
//   }
//   return { animated, scrollers };
// }
// 
// function freshClone(scene: HTMLElement): HTMLElement {
//   // ids stay so id-based styles still match; the copy is inert and later in
//   // tree order, so getElementById keeps resolving to the original.
//   const copy = scene.cloneNode(true) as HTMLElement;
//   for (const n of copy.querySelectorAll("[data-cg-host]")) n.remove();
//   copy.setAttribute("aria-hidden", "true");
//   copy.inert = true;
//   return copy;
// }
// 
// /**
//  * Refract `scene` inside `host`. `host` must be an EMPTY element filling the
//  * pane (absolute, inset 0) — the engine owns its children. The pane needs
//  * overflow:hidden + border-radius; anything painted after `host` sits on top.
//  */
// export function cloneGlass(host: HTMLElement, scene: HTMLElement, opts: CloneGlassOptions = {}): CloneGlassInstance {
//   const o = { ...DEFAULTS, ...opts };
//   const id = `cg-${++uid}`;
//   const M = Math.ceil(Math.abs(o.scale) / 2 + Math.abs(o.chroma) * 2 + 4);
//   let f: SVGFilterElement | null = null;
//   const pxScales = [o.scale, o.scale + o.chroma, o.scale + 2 * o.chroma];
//   const source: CopySource = !o.source || o.source === "auto" ? (supportsMozElement() ? "moz-element" : "clone") : o.source;
// 
//   const lens = document.createElement("div");
//   Object.assign(lens.style, { position: "absolute", left: `${-M}px`, top: `${-M}px`, overflow: "hidden", pointerEvents: "none" });
//   host.setAttribute("data-cg-host", "");
// 
//   let copy: HTMLElement;
//   if (source === "moz-element") {
//     if (!scene.id) scene.id = `cg-scene-${uid}`;
//     copy = document.createElement("div");
//     copy.style.backgroundImage = `-moz-element(#${scene.id})`;
//     copy.style.backgroundRepeat = "no-repeat";
//   } else {
//     copy = freshClone(scene);
//   }
//   const place = (c: HTMLElement) => Object.assign(c.style, { position: "absolute", left: "0", top: "0", right: "auto", bottom: "auto", margin: "0", pointerEvents: "none", transformOrigin: "0 0" });
//   place(copy);
//   lens.appendChild(copy);
//   host.appendChild(lens);
// 
//   let mo: MutationObserver | null = null;
//   let dirty = false;
//   let twins: { animated: Twin[]; scrollers: Twin[] } | null = source === "clone" ? decomposite(scene, copy) : null;
//   if (source === "clone") {
//     mo = new MutationObserver(() => (dirty = true));
//     mo.observe(scene, { subtree: true, childList: true, characterData: true, attributes: true });
//   }
// 
//   let lastKey = "";
//   let gen = 0;
//   let raf = 0;
// 
//   function update() {
//     if (dirty) {
//       dirty = false;
//       const fresh = freshClone(scene);
//       place(fresh);
//       copy.replaceWith(fresh);
//       copy = fresh;
//       twins = decomposite(scene, copy);
//     }
//     const hr = host.getBoundingClientRect();
//     const sr = scene.getBoundingClientRect();
//     const w = host.offsetWidth;
//     const h = host.offsetHeight;
//     if (!w || !h) return;
//     // Square lens layer: with objectBoundingBox units Chromium scales the
//     // displacement by the box WIDTH on both axes while WebKit uses width for
//     // x and height for y. A square box makes both agree; the pane clips the
//     // extra area.
//     const S = Math.max(w, h) + 2 * M;
//     copy.style.width = `${scene.offsetWidth}px`;
//     copy.style.height = `${scene.offsetHeight}px`;
//     copy.style.transform = `translate(${sr.left - hr.left + M}px, ${sr.top - hr.top + M}px)`;
//     if (twins) {
//       // Pose each animated twin from its original's current computed values.
//       for (const { src, dst } of twins.animated) {
//         const cs = getComputedStyle(src);
//         dst.style.transform = cs.transform;
//         dst.style.translate = cs.translate;
//         dst.style.rotate = cs.rotate;
//         dst.style.scale = cs.scale;
//         dst.style.opacity = cs.opacity;
//       }
//       for (const { src, dst } of twins.scrollers) {
//         if (dst.scrollTop !== src.scrollTop) dst.scrollTop = src.scrollTop;
//         if (dst.scrollLeft !== src.scrollLeft) dst.scrollLeft = src.scrollLeft;
//       }
//     }
//     lens.style.width = `${S}px`;
//     lens.style.height = `${S}px`;
//     const radius = parseFloat(getComputedStyle(host.parentElement ?? host).borderTopLeftRadius) || 0;
//     const key = `${w}x${h}r${radius}`;
//     if (key !== lastKey) {
//       lastKey = key;
//       const url = makeMap(S, S, M, w, h, radius, o.border, o.mapBlur);
//       // New element + new id per map: WebKit neither reloads a changed
//       // feImage href nor invalidates cached output for a reused id.
//       const fid = `${id}-${++gen}`;
//       const next = buildFilter(fid, url, pxScales.map((v) => v / S), o.saturate);
//       lens.style.filter = `url(#${fid})`;
//       f?.remove();
//       f = next;
//     }
//   }
// 
//   const loop = () => {
//     update();
//     raf = requestAnimationFrame(loop);
//   };
//   update();
//   raf = requestAnimationFrame(loop);
// 
//   return {
//     source,
//     destroy() {
//       cancelAnimationFrame(raf);
//       mo?.disconnect();
//       lens.remove();
//       f?.remove();
//       host.removeAttribute("data-cg-host");
//     },
//   };
// }
