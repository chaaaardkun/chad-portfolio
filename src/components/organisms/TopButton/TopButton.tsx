"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms/Icon/Icon";
import { content } from "@/lib/content";
import { REDUCED_QUERY, ScrollSmoother, gsap } from "@/lib/gsap";
import styles from "./TopButton.module.scss";

/** Fixed, centered scroll-to-top control. Shown only while the hero is out of view. */
export function TopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;

    // Fires on observe (so a mid-page reload starts correct) and on every
    // change in the hero's visibility. Works with ScrollSmoother transforms.
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    const smoother = ScrollSmoother.get();
    if (window.matchMedia(REDUCED_QUERY).matches) {
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (smoother) {
      gsap.to(smoother, { duration: 0.9, ease: "power2.inOut", scrollTop: 0, overwrite: "auto" });
    } else {
      gsap.to(window, { duration: 0.9, ease: "power2.inOut", scrollTo: { y: 0 }, overwrite: "auto" });
    }
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${visible ? styles.visible : ""}`}
      aria-label={content.site.topButton.ariaLabel}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={scrollToTop}
    >
      <Icon name="arrow-up-gradient" size={20} />
      <span className={styles.label}>{content.site.topButton.label}</span>
    </button>
  );
}
