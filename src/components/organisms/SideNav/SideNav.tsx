"use client";

import { useRef, useState } from "react";
import { content } from "@/lib/content";
import { MOTION_QUERY, gsap, useGSAP } from "@/lib/gsap";
import styles from "./SideNav.module.scss";

const navigation = content.site.navigation.items;

/** Fixed side nav that marks the section currently in view. Sections come from `navigation`. */
export function SideNav() {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useGSAP(() => {
    const sections = navigation.flatMap((item) => {
      const id = item.href.slice(1);
      const section = document.getElementById(id);
      return section ? [{ id, section }] : [];
    });

    // The active section is the last one whose top has crossed the middle of the
    // screen. Live rects are used rather than ScrollTrigger ranges: a pinned
    // section shifts the sections below it, and ranges measured before the pin
    // spacer lands end too early.
    const update = () => {
      const line = window.innerHeight / 2;
      let current: string | null = null;
      for (const { id, section } of sections) {
        if (section.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };

    // Runs every frame: ScrollSmoother moves the sections with a transform, so
    // the rects change without a native scroll event.
    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  // The active dot springs up with an overshoot; the others settle back.
  // Reduced motion falls back to a static scale in the stylesheet.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERY, () => {
        // Tween only dots that exist: GSAP warns "target not found" for an empty
        // selection, and no dot is active until a section crosses the middle.
        const dots = gsap.utils.toArray<HTMLElement>("[data-dot]", navRef.current);
        const activeDots = dots.filter((dot) => dot.hasAttribute("data-active"));
        const inactiveDots = dots.filter((dot) => !dot.hasAttribute("data-active"));

        if (inactiveDots.length) {
          gsap.to(inactiveDots, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        }
        if (activeDots.length) {
          gsap.fromTo(
            activeDots,
            { scale: 0.4 },
            { scale: 1.5, duration: 1, ease: "elastic.out(1, 0.35)", overwrite: "auto" },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: navRef, dependencies: [active] },
  );

  return (
    <nav ref={navRef} className={styles.nav} aria-label={content.site.navigation.ariaLabel}>
      <ul className={styles.list}>
        {navigation.map((item) => {
          const isActive = active === item.href.slice(1);
          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={`${styles.link} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className={styles.label}>{item.label}</span>
                <span className={styles.dot} data-dot data-active={isActive ? "" : undefined} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
