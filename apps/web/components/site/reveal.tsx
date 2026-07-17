"use client";

import * as React from "react";

/**
 * Boot/scroll reveal. Hidden via [data-reveal] CSS (globals.css) until BOTH
 * the boot loader has lifted (html[data-booted] / "vsrc:booted") and the
 * element has entered the viewport — so hero pieces rise through the fading
 * loader, and lower sections wait for the scroll. Opacity + translate only:
 * a filter on a wrapper would give children a new backdrop root and cut the
 * glass refraction inside off from the page.
 */
export function Reveal({
  delay = 0,
  className,
  children,
}: {
  /** Stagger, in seconds. */
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let inView = false;
    let booted = document.documentElement.hasAttribute("data-booted");
    const maybe = () => {
      if (inView && booted) el.classList.add("is-revealed");
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          inView = true;
          io.disconnect();
          maybe();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    const onBoot = () => {
      booted = true;
      maybe();
    };
    window.addEventListener("vsrc:booted", onBoot);
    return () => {
      io.disconnect();
      window.removeEventListener("vsrc:booted", onBoot);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
