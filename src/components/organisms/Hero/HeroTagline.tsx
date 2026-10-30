"use client";

import { Fragment, useRef } from "react";
import { MOTION_QUERY, gsap, useGSAP } from "@/lib/gsap";
import { profile } from "@/lib/content";
import styles from "./Hero.module.scss";

/**
 * Hero tagline. Words rise and fade in after the heading (see HeroTitle),
 * with the same intro wait. The split spans are hidden from assistive tech;
 * the paragraph carries the full text. Reduced motion shows the plain text.
 */
export function HeroTagline() {
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const tagline = taglineRef.current;
      if (!tagline) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERY, () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-word]", tagline);
        const root = document.documentElement;

        // Starts while the heading is still settling, so it follows without competing.
        const play = () =>
          gsap.fromTo(
            words,
            { yPercent: 40, opacity: 0, filter: "blur(8px)" },
            {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1,
              ease: "power3.out",
              stagger: 0.04,
              clearProps: "filter",
              delay: 1.2,
              overwrite: "auto",
            },
          );

        // Hold the words back until the intro (see Loader) has finished.
        let observer: MutationObserver | undefined;
        if (root.dataset.intro === "pending") {
          gsap.set(words, { yPercent: 40, opacity: 0 });
          observer = new MutationObserver(() => {
            if (root.dataset.intro === "pending") return;
            observer?.disconnect();
            play();
          });
          observer.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
        } else {
          play();
        }

        return () => observer?.disconnect();
      });

      return () => mm.revert();
    },
    { scope: taglineRef },
  );

  return (
    <p ref={taglineRef} className={styles.tagline} aria-label={profile.tagline}>
      <span aria-hidden="true">
        {profile.tagline.split(" ").map((word, index, words) => (
          <Fragment key={index}>
            <span className={styles.word} data-word>
              {word}
            </span>
            {/* Outside the inline-block word: a trailing space inside it collapses. */}
            {index < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </p>
  );
}
