"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.scss";

type RevealProps = {
  as?: "div" | "p" | "span" | "h2" | "h3" | "li";
  className?: string;
  id?: string;
  /** Seconds to hold back after entering view, to stagger siblings. */
  delay?: number;
  children: ReactNode;
};

/**
 * Scroll-triggered text reveal: rises from below while a diagonal tilt
 * straightens out. Replays every time the element re-enters the viewport.
 * The hidden state only exists under no-preference motion (see the SCSS), so
 * reduced motion shows the text immediately. Not used in the hero, which has
 * its own entrance.
 */
export function Reveal({ as: Tag = "div", className, id, delay = 0, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShown(entry.isIntersecting);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`${styles.reveal} ${className ?? ""}`}
      data-shown={shown || undefined}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
