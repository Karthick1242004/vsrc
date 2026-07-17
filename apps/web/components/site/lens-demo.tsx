"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { canRefract } from "vsrc";

import { Button } from "@/registry/vsrc/ui/button";

/**
 * Sandboxed refraction demo, shown everywhere (not just non-refracting
 * browsers): the engine's displacement idea re-run as a WebGL fragment
 * shader over a scene we control, draggable, at a scale and framing the
 * live backdrop-filter panels above don't offer. WebGL, not SVG filters:
 * WebKit misplaces feImage inputs, so filter-based displacement is
 * unreliable there — this is also the only way non-refracting browsers see
 * the real optic at all.
 */

const WORDS = "refraction · dispersion · specular · caustics · chroma · rim-light · ";

const VERT = `
attribute vec2 a;
varying vec2 v_uv;
void main() { v_uv = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform vec2 u_res;
uniform vec2 u_lens;
uniform vec2 u_half;
uniform float u_rad;
uniform float u_band;
uniform float u_bend;

float sdRoundRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + vec2(r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
vec4 scene(vec2 p) { return texture2D(u_tex, p / u_res); }

void main() {
  vec2 p = vec2(v_uv.x, 1.0 - v_uv.y) * u_res;
  vec2 q = p - u_lens;
  float d = sdRoundRect(q, u_half, u_rad);
  vec3 col;
  if (d > 0.0) {
    col = scene(p).rgb;
  } else {
    float t = smoothstep(-u_band, 0.0, d);
    vec2 g = normalize(vec2(
      sdRoundRect(q + vec2(1.0, 0.0), u_half, u_rad) - sdRoundRect(q - vec2(1.0, 0.0), u_half, u_rad),
      sdRoundRect(q + vec2(0.0, 1.0), u_half, u_rad) - sdRoundRect(q - vec2(0.0, 1.0), u_half, u_rad)
    ) + vec2(1e-5));
    float s = u_bend * t * t;
    // Three staggered samples = the engine's chromatic fringe.
    col = vec3(
      scene(p + g * s * 1.10).r,
      scene(p + g * s).g,
      scene(p + g * s * 0.90).b
    );
    col = mix(col, vec3(1.0, 0.99, 0.86), 0.05 + 0.10 * t);
  }
  float ring = 1.0 - smoothstep(0.0, 1.6, abs(d));
  col = mix(col, vec3(1.0, 0.99, 0.86), ring * 0.45);
  gl_FragColor = vec4(col, 1.0);
}
`;

function drawScene(c: HTMLCanvasElement, family: string) {
  const x = c.getContext("2d");
  if (!x) return;
  const W = c.width;
  const H = c.height;
  x.fillStyle = "#181616";
  x.fillRect(0, 0, W, H);
  const blob = (bx: number, by: number, r: number, color: string) => {
    const g = x.createRadialGradient(bx, by, 0, bx, by, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(24,22,22,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
  };
  blob(W * 0.2, H * 0.25, H * 0.9, "rgba(255,56,49,0.5)");
  blob(W * 0.85, H * 0.8, H * 0.85, "rgba(224,39,35,0.45)");
  blob(W * 0.55, H * 0.5, H * 0.6, "rgba(255,253,219,0.1)");
  x.textBaseline = "alphabetic";
  x.font = `italic ${Math.round(H * 0.28)}px ${family}`;
  x.fillStyle = "#fffddb";
  x.fillText(WORDS.repeat(3), -W * 0.08, H * 0.36);
  x.fillStyle = "#ff3831";
  x.fillText(WORDS.repeat(3), -W * 0.32, H * 0.82);
}

function LensCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = (canvas.width = Math.round(canvas.clientWidth * dpr));
    const H = (canvas.height = Math.round(canvas.clientHeight * dpr));
    const gl = canvas.getContext("webgl", { antialias: true });
    if (!gl) {
      setFailed(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    gl.viewport(0, 0, W, H);
    gl.uniform2f(u("u_res"), W, H);
    gl.uniform2f(u("u_half"), W * 0.21, H * 0.26);
    gl.uniform1f(u("u_rad"), 30 * dpr);
    gl.uniform1f(u("u_band"), 42 * dpr);
    gl.uniform1f(u("u_bend"), 36 * dpr);
    const lensLoc = u("u_lens");

    let raf = 0;
    let dragging = false;
    const lens = { x: W / 2, y: H / 2 };
    const draw = () => {
      gl.uniform2f(lensLoc, lens.x, lens.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const loop = () => {
      if (!dragging) {
        const t = (performance.now() - start) / 1000;
        lens.x = W / 2 + Math.sin(t * 0.5) * W * 0.17;
        lens.y = H / 2 + Math.sin(t * 0.33 + 1.7) * H * 0.12;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    const toLens = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      lens.x = ((e.clientX - r.left) / r.width) * W;
      lens.y = ((e.clientY - r.top) / r.height) * H;
    };
    const down = (e: PointerEvent) => {
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
      toLens(e);
      if (still) draw();
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      toLens(e);
      if (still) draw();
    };
    const up = () => (dragging = false);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);

    let cancelled = false;
    const scene = document.createElement("canvas");
    scene.width = W;
    scene.height = H;
    // next/font mangles the family name — read the real one off the DOM.
    const probe = document.createElement("span");
    probe.className = "font-display";
    probe.style.position = "absolute";
    probe.ariaHidden = "true";
    document.body.appendChild(probe);
    const family = getComputedStyle(probe).fontFamily;
    probe.remove();
    document.fonts.ready.then(() => {
      if (cancelled) return;
      drawScene(scene, family);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scene);
      if (still) draw();
      else loop();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
    };
  }, []);

  if (failed) {
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">
        WebGL isn&apos;t available in this browser, so the re-creation can&apos;t run here.
      </p>
    );
  }
  return <canvas ref={canvasRef} className="h-full w-full touch-none" aria-label="Liquid glass refraction demo" />;
}

export function LensDemo({ size = "lg" }: { size?: "default" | "lg" }) {
  // Copy adapts to whether this browser already refracts live elsewhere on the
  // page; the button itself always shows (SSR default matches: canRefract() is
  // false with no window, so the non-refracting copy paints first either way).
  const [refracts, setRefracts] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    setRefracts(canRefract());
  }, []);

  React.useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <>
      <Button size={size} onClick={() => setOpen(true)}>
        {refracts ? "Play with the shader" : "See real refraction"}
      </Button>
      {/* Portal to <body>: the trigger lives inside a Reveal wrapper whose
          `translate` establishes a containing block, which would otherwise trap
          this fixed overlay to the button row instead of the viewport. */}
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Refraction demo"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/95 p-6"
          >
            <div className="h-[60vh] w-full max-w-4xl overflow-hidden rounded-[32px] border border-border">
              <LensCanvas />
            </div>
            <p className="max-w-xl text-center font-mono text-xs leading-relaxed text-muted-foreground">
              {"// webgl re-creation of the chromium render — same displacement optics. drag the lens."}
            </p>
            <Button ref={closeRef} variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>,
          document.body,
        )}
    </>
  );
}
