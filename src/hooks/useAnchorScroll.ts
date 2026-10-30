"use client";

import { MOTION_QUERY, REDUCED_QUERY, ScrollSmoother, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

// In-page link glide: seconds and easing. Focus waits for the glide to finish.
const ANCHOR_GLIDE = { duration: 1.8, ease: "power2.inOut" };

// Pending deferred focus, so a newer click cancels an older one.
let pendingFocus: gsap.core.Tween | undefined;

/**
 * Smooth-scrolls in-page `#anchor` clicks with ScrollSmoother (or GSAP ScrollToPlugin as a fallback), offset by
 * the fixed header. Reduced motion jumps instantly. Unknown targets and bare
 * "#" fall through to default browser behavior.
 */
export function useAnchorScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({ motion: MOTION_QUERY, reduced: REDUCED_QUERY }, (context) => {
      const reduced = Boolean(context.conditions?.reduced);

      const handleClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const anchor = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
        const hash = anchor?.getAttribute("href");
        if (!anchor || !hash || hash === "#" || anchor.target) return;

        let id: string;
        try {
          id = decodeURIComponent(hash.slice(1));
        } catch {
          return;
        }
        const target = document.getElementById(id);
        if (!target) return;

        event.preventDefault();

        const header = document.querySelector<HTMLElement>("[data-site-header]");
        const offset = id === "top" ? 0 : (header?.offsetHeight ?? 0);

        const smoother = ScrollSmoother.get();
        const focusTarget = () => {
          if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        };
        let focusLater = false;

        if (reduced) {
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "instant" });
        } else if (smoother) {
          // A pinned section is only fully shown once its pin has run out, so
          // it goes to the pin's end rather than its top.
          const pin = ScrollTrigger.getById(`${id}-pin`);
          const top = pin ? pin.end : smoother.offset(target, `top ${offset}px`);
          // Tween scrollTop rather than calling smoother.scrollTo: scrollTo
          // jumps the content in one frame when it starts from a pin's end.
          // Focus only once the target is on screen: ScrollSmoother jumps
          // instantly to any off-screen element that receives focus.
          focusLater = true;
          gsap.to(smoother, { ...ANCHOR_GLIDE, scrollTop: top, overwrite: "auto" });
          pendingFocus?.kill();
          pendingFocus = gsap.delayedCall(ANCHOR_GLIDE.duration, focusTarget);
        } else {
          gsap.to(window, {
            duration: 0.9,
            ease: "power2.inOut",
            scrollTo: { y: target, offsetY: offset },
            overwrite: "auto",
          });
        }

        history.pushState(null, "", hash);
        if (!focusLater) focusTarget();
      };

      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    });

    return () => mm.revert();
  }, []);
}
