"use client";

import { useEffect, useRef } from "react";
import { MOTION_QUERY } from "@/lib/gsap";

const DURATION_MS = 1100;

interface HeroStatValueProps {
  value: number;
  suffix?: string;
  /** Seconds after the intro ends before counting starts. Matches the card's CSS entrance delay. */
  delay: number;
}

/**
 * Stat number that counts up from 0 once the card enters. The final text is
 * rendered in the markup, so it reads correctly without JS or before hydration.
 * Reduced motion keeps the final value untouched.
 */
export function HeroStatValue({ value, suffix = "", delay }: HeroStatValueProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia(MOTION_QUERY).matches) return;

    const final = `${value}${suffix}`;
    const root = document.documentElement;
    let frame = 0;
    let timer: number | undefined;
    let observer: MutationObserver | undefined;

    el.textContent = `0${suffix}`;

    const start = () => {
      timer = window.setTimeout(() => {
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / DURATION_MS, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = p < 1 ? `${Math.round(value * eased)}${suffix}` : final;
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      }, delay * 1000);
    };

    // Same hold as the card entrance: wait for the session intro (see Loader).
    if (root.dataset.intro === "pending") {
      observer = new MutationObserver(() => {
        if (root.dataset.intro === "pending") return;
        observer?.disconnect();
        start();
      });
      observer.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
    } else {
      start();
    }

    return () => {
      observer?.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      el.textContent = final;
    };
  }, [value, suffix, delay]);

  return (
    <strong ref={ref} suppressHydrationWarning>
      {`${value}${suffix}`}
    </strong>
  );
}
