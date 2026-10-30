"use client";

import { useRef } from "react";
import { MOTION_QUERY, REDUCED_QUERY, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { WaveShape } from "@/components/atoms/WaveShape/WaveShape";
import { waves } from "@/components/atoms/WaveShape/waves";
import { profile } from "@/lib/content";
import styles from "./Loader.module.scss";

// Keep in sync with the inline script in app/layout.tsx.
const STORAGE_KEY = "portfolio:intro-played";

const markPlayed = () => {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Storage unavailable: the intro simply plays on every load.
  }
};

const finish = () => {
  markPlayed();
  delete document.documentElement.dataset.intro;
};

/**
 * Session intro. The layout script marks <html data-intro="pending"> before
 * paint when the intro has not played this session; this component plays it,
 * then reveals the hero. Reduced motion skips it.
 */
export function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const wave = waveRef.current;
      if (!root || !wave || document.documentElement.dataset.intro !== "pending") return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_QUERY, () => {
        finish();
      });

      mm.add(MOTION_QUERY, () => {
        // Outside this component's useGSAP scope, so query the document directly.
        const hero = Array.from(document.querySelectorAll<HTMLElement>("[data-hero-reveal]"));

        // The hold lifts mid-exit (see finish below), so keep the panel and wave
        // shown until the timeline is done.
        const exiting = [root, wave];
        exiting.forEach((el) => el.setAttribute("data-exiting", ""));
        const hide = () => exiting.forEach((el) => el.removeAttribute("data-exiting"));

        const tl = gsap.timeline({
          onComplete: () => {
            hide();
            finish();
            gsap.set(hero, { clearProps: "opacity,transform" });
            ScrollTrigger.refresh();
          },
        });

        tl.fromTo(markRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" })
          .fromTo(fillRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, "<0.2")
          .to(markRef.current, { y: -16, opacity: 0, duration: 0.35, ease: "power2.in" })
          // The liquid rises first and covers the panel, then carries off the top. It
          // travels past -100 so its swelling bottom edge (anchors at 1300 of 1000) clears the screen.
          .fromTo(wave, { yPercent: 100 }, { yPercent: -150, duration: 1, ease: "power2.inOut" }, "<")
          .to(root, { yPercent: -100, duration: 0.8, ease: "power3.inOut" }, "<0.1")
          // Lift the intro hold as the hero starts to reveal, so the graphics' CSS
          // entrance plays now (under the hero fade) instead of replaying after it.
          .call(finish, [], "<0.35")
          .fromTo(hero, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.12 }, "<");

        return hide;
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <>
      <div ref={rootRef} className={styles.loader} aria-hidden="true">
        <span ref={markRef} className={styles.mark}>
          {profile.name}
        </span>
        <span className={styles.bar}>
          <span ref={fillRef} className={styles.fill} />
        </span>
      </div>
      <div ref={waveRef} className={styles.wave} aria-hidden="true">
        <WaveShape spec={waves.loader} />
      </div>
    </>
  );
}
