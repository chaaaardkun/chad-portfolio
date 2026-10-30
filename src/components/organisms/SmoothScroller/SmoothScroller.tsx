"use client";

import type { ReactNode } from "react";
import { MOTION_QUERY, ScrollSmoother, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

// Section snap tuning. Adjust here. The settle itself uses the smoother's own
// smoothing (its `smooth` value below), so there is no separate duration/ease.
const SMOOTH = 1;
const SNAP = {
  /** Only snap when a snap point is within this fraction of the viewport height. */
  reach: 0.4,
  /** Ignore moves smaller than this many pixels. */
  tolerance: 2,
};

/**
 * Wraps page content in the structure ScrollSmoother requires. Fixed elements
 * (header, side nav, top button, loader) must stay outside of it. Reduced
 * motion leaves native scrolling untouched.
 */
export function SmoothScroller({ children }: { children: ReactNode }) {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERY, () => {
      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: SMOOTH,
      });

      // Snap to section tops (and the bottom-aligned end of sections taller
      // than the viewport, plus the page end so the footer stays reachable).
      // Away from any point it does nothing, so long sections scroll freely.
      const sections = gsap.utils.toArray<HTMLElement>("main > section");
      const snapPoints = () => {
        const max = ScrollTrigger.maxScroll(window);
        const viewport = window.innerHeight;
        const points = sections.flatMap((section) => {
          const top = smoother.offset(section, "top top");
          const bottom = top + section.offsetHeight - viewport;
          return bottom > top ? [top, bottom] : [top];
        });
        return [...points, max].map((point) => Math.min(point, max));
      };

      // ScrollTrigger's built-in `snap` freezes ScrollSmoother's content after
      // a smoother.scrollTo, so snap by hand: when scrolling ends, glide on to
      // the nearest point ahead through the smoother itself.
      let direction = 0;
      const tracker = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          direction = self.direction;
        },
      });

      const handleScrollEnd = () => {
        // The native position is the destination; the smoother's own lags behind it.
        const scroll = window.scrollY;
        const reach = window.innerHeight * SNAP.reach;
        const near = snapPoints().filter((point) => Math.abs(point - scroll) <= reach);

        // Only snap forward, in the direction of travel: never pull the page
        // back past where the user was heading. No point ahead means stay put.
        const ahead = near.filter((point) => (direction >= 0 ? point >= scroll : point <= scroll));
        if (!ahead.length) return;
        const target = ahead.reduce((a, b) => (Math.abs(b - scroll) < Math.abs(a - scroll) ? b : a));
        if (Math.abs(target - scroll) > SNAP.tolerance) smoother.scrollTo(target, true);
      };
      ScrollTrigger.addEventListener("scrollEnd", handleScrollEnd);

      // ScrollSmoother only re-measures on window resize. Content that grows
      // later (images, carousels, the intro lock lifting) would leave the
      // scroll height stale and make the scroll snap. Refresh when it changes.
      const content = document.getElementById("smooth-content");
      let frame = 0;
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      if (content) observer.observe(content);

      return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        ScrollTrigger.removeEventListener("scrollEnd", handleScrollEnd);
        tracker.kill();
        smoother.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
