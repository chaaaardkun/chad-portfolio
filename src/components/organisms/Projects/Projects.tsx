"use client";

import { type PointerEvent, useRef } from "react";
import { Icon } from "@/components/atoms/Icon/Icon";
import { SectionHeading } from "@/components/atoms/SectionHeading/SectionHeading";
import { WaveShape } from "@/components/atoms/WaveShape/WaveShape";
import { waves } from "@/components/atoms/WaveShape/waves";
import { ProjectCard } from "@/components/molecules/ProjectCard/ProjectCard";
import { content } from "@/lib/content";
import { MOTION_QUERY, gsap, useGSAP } from "@/lib/gsap";
import styles from "./Projects.module.scss";

// Seconds for one full set of cards to pass by.
const LOOP_DURATION = 32;

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const hoveredRef = useRef(false);

  const syncPlayback = () => {
    const tween = tweenRef.current;
    if (!tween) return;
    gsap.to(tween, {
      timeScale: hoveredRef.current ? 0 : 1,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });
  };

  // Infinite marquee: the track holds two identical sets, so moving it by -50%
  // lands exactly where it started.
  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERY, () => {
        tweenRef.current = gsap.to(track, {
          xPercent: -50,
          duration: LOOP_DURATION,
          ease: "none",
          repeat: -1,
        });
        syncPlayback();

        return () => {
          tweenRef.current = null;
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const handlePointerEnter = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    hoveredRef.current = true;
    syncPlayback();
  };

  const handlePointerLeave = () => {
    hoveredRef.current = false;
    syncPlayback();
  };

  // Reduced motion: the row is a plain scroller, stepped one card at a time.
  const step = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    const card = trackRef.current?.firstElementChild as HTMLElement | null;
    if (!viewport || !card) return;
    viewport.scrollBy({
      left: direction * card.offsetWidth,
      behavior: "instant",
    });
  };

  return (
    <section id="clients" ref={sectionRef} className={styles.section} aria-label={content.projects.title}>
      <WaveShape spec={waves.projects} />

      <div className={styles.heading}>
        <SectionHeading eyebrow={content.projects.eyebrow} title={content.projects.title} />
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div ref={trackRef} className={styles.track}>
          {[false, true].map((isClone) =>
            content.projects.items.map((project) => (
              <div
                key={`${isClone ? "clone" : "set"}-${project.title}`}
                className={`${styles.slide} ${isClone ? styles.clone : ""}`}
                aria-hidden={isClone || undefined}
              >
                <ProjectCard title={project.title} color={project.color} logo={project.logo} />
              </div>
            )),
          )}
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.control}
          aria-label={content.projects.previousLabel}
          onClick={() => step(-1)}
        >
          <Icon name="chevron-left" size={20} />
        </button>
        <button
          type="button"
          className={styles.control}
          aria-label={content.projects.nextLabel}
          onClick={() => step(1)}
        >
          <Icon name="chevron-right" size={20} />
        </button>
      </div>
    </section>
  );
}
