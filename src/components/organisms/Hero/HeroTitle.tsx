"use client";

import { Fragment, useRef } from "react";
import { MOTION_QUERY, gsap, useGSAP } from "@/lib/gsap";
import { profile } from "@/lib/content";
import styles from "./Hero.module.scss";

// Split into words (so lines never break mid-word) of per-character spans.
const splitWords = (text: string) =>
  text.split(" ").map((word, wordIndex, words) => (
    <Fragment key={wordIndex}>
      <span className={styles.word}>
        {Array.from(word).map((char, charIndex) => (
          <span key={charIndex} className={styles.char} data-char>
            {char}
          </span>
        ))}
      </span>
      {/* Outside the inline-block word: a trailing space inside it collapses. */}
      {wordIndex < words.length - 1 ? " " : null}
    </Fragment>
  ));

/**
 * Hero heading. Characters spring in one by one once the session intro is
 * done, and the character under the pointer jiggles on hover. The split spans
 * are hidden from assistive tech; the wrapper carries the full phrase.
 * Reduced motion shows the plain text.
 */
export function HeroTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const title = titleRef.current;
      if (!title) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERY, () => {
        const chars = gsap.utils.toArray<HTMLElement>("[data-char]", title);
        const root = document.documentElement;

        // Hover is ignored until the entrance has landed, so the two never fight.
        let ready = false;

        // Characters rise out of a soft blur, one after another.
        const play = () =>
          gsap.fromTo(
            chars,
            { yPercent: 40, opacity: 0, filter: "blur(8px)" },
            {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.1,
              ease: "power3.out",
              stagger: 0.05,
              clearProps: "filter",
              delay: 0.2,
              onComplete: () => {
                ready = true;
              },
            },
          );

        // Hold the characters back until the intro (see Loader) has finished.
        let observer: MutationObserver | undefined;
        if (root.dataset.intro === "pending") {
          gsap.set(chars, { yPercent: 40, opacity: 0 });
          observer = new MutationObserver(() => {
            if (root.dataset.intro === "pending") return;
            observer?.disconnect();
            play();
          });
          observer.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
        } else {
          play();
        }

        const handleOver = (event: PointerEvent) => {
          const char = (event.target as Element).closest<HTMLElement>("[data-char]");
          if (!ready || !char) return;
          // Kill any in-flight hover on this character so rapid passes never stack.
          gsap.killTweensOf(char);
          gsap
            .timeline()
            .to(char, { yPercent: -14, rotation: -5, duration: 0.25, ease: "power2.out" })
            .to(char, { yPercent: 0, rotation: 0, duration: 0.7, ease: "power3.out" });
        };

        title.addEventListener("pointerover", handleOver);

        return () => {
          observer?.disconnect();
          title.removeEventListener("pointerover", handleOver);
        };
      });

      return () => mm.revert();
    },
    { scope: titleRef },
  );

  return (
    <h1 ref={titleRef} className={styles.title} aria-label={`${profile.greeting} ${profile.name}.`}>
      <span aria-hidden="true">
        {splitWords(profile.greeting)}
        <br />
        <span className={styles.name}>{splitWords(`${profile.name}.`)}</span>
      </span>
    </h1>
  );
}
