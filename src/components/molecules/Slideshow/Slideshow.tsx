"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { content, fill } from "@/lib/content";
import styles from "./Slideshow.module.scss";

type SlideshowProps = {
  images: string[];
  /** Alt text prefix. Each slide appends its number. */
  alt: string;
  width: number;
  height: number;
  /** Autoplay only while true, so a hidden slideshow does not keep ticking. */
  playing: boolean;
  /** Milliseconds each slide stays before the cross-fade to the next. */
  interval?: number;
};

/**
 * Cross-fading gallery that fills its parent. Slides are stacked and only the
 * active one is visible. Reduced motion turns autoplay off; the dots still work.
 */
export function Slideshow({
  images,
  alt,
  width,
  height,
  playing,
  interval = 3500,
}: SlideshowProps) {
  const [index, setIndex] = useState(0);

  // Depends on `index` so picking a dot restarts the timer from zero.
  useEffect(() => {
    if (!playing || images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % images.length),
      interval,
    );
    return () => window.clearTimeout(timer);
  }, [playing, index, images.length, interval]);

  return (
    <div className={styles.slideshow}>
      {images.map((src, i) => (
        <Image
          key={src}
          className={styles.slide}
          data-active={i === index}
          src={src}
          alt={`${alt} ${i + 1}`}
          width={width}
          height={height}
          draggable={false}
          unoptimized
        />
      ))}
      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={styles.dot}
              aria-label={fill(content.work.modal.slideLabel, {
                n: i + 1,
                total: images.length,
              })}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
