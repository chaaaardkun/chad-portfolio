"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ProjectModal } from "@/components/organisms/ProjectModal/ProjectModal";
import { content, fill } from "@/lib/content";
import { MOTION_QUERY, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import styles from "./HorizontalScroller.module.scss";

type Project = (typeof content.work.items)[number];

// Long enough rows that each one travels past the viewport on its own.
const ROW_SIZE = 5;
const projects = content.work.items;

export function HorizontalScroller() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  // The rows start moving as soon as the section rises from the bottom of the
  // screen, so nothing sits blank. The section pins once it reaches the top and
  // releases when the rows finish. Even rows enter from the left, odd rows from
  // the right. Reduced motion skips the pin and the rows scroll natively instead.
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERY, () => {
        const pairs = gsap.utils
          .toArray<HTMLElement>("[data-row]", section)
          .flatMap((row, index) => {
            const track = row.querySelector<HTMLElement>("[data-track]");
            return track ? [{ row, track, fromLeft: index % 2 === 0 }] : [];
          });

        // Pixels the longest row moves. A row ends with its last card at the right edge.
        const travel = () =>
          Math.max(
            0,
            ...pairs.map(({ row, track }) =>
              Math.max(track.scrollWidth, row.offsetWidth),
            ),
          );

        // Travel runs across the approach (section rising into view) and the pin.
        // The pin lasts exactly as long as the travel, so the rows finish on release.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: () => `+=${window.innerHeight + travel()}`,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        pairs.forEach(({ row, track, fromLeft }) => {
          const distance = () =>
            Math.max(0, track.scrollWidth - row.offsetWidth);

          tl.fromTo(
            track,
            { x: () => (fromLeft ? -track.scrollWidth : row.offsetWidth) },
            {
              x: () => (fromLeft ? 0 : -distance()),
              ease: "none",
              duration: 1,
            },
            0,
          );
        });

        // Named so SmoothScroller can send in-page links to the end of this pin.
        ScrollTrigger.create({
          id: `${section.id}-pin`,
          trigger: section,
          start: "top top",
          end: () => `+=${travel()}`,
          pin: true,
          invalidateOnRefresh: true,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const rows: Project[][] = [];
  for (let i = 0; i < projects.length; i += ROW_SIZE) {
    rows.push(projects.slice(i, i + ROW_SIZE));
  }

  return (
    <>
      <section id="projects" ref={sectionRef} className={styles.section} aria-label={content.highlights.title}>
        <div className={styles.rows}>
          {/* Title first, then the project rows. */}
          <div data-row className={styles.row}>
            <div data-track className={styles.track}>
              <h2 className={styles.big}>{content.highlights.title}</h2>
            </div>
          </div>

          {rows.map((items, rowIndex) => (
            <div key={rowIndex} data-row className={styles.row}>
              <ul data-track className={styles.track}>
                {items.map((project) => (
                  <li
                    key={project.title}
                    className={styles.card}
                    style={{ background: project.color }}
                  >
                    <button
                      type="button"
                      className={styles.cardButton}
                      aria-label={fill(content.work.modal.openLabel, {
                        title: project.title,
                      })}
                      aria-haspopup="dialog"
                      onClick={() => setSelected(project)}
                    >
                      <Image
                        className={styles.image}
                        src={project.image}
                        alt=""
                        width={1440}
                        height={900}
                        draggable={false}
                        unoptimized
                      />
                      <span className={styles.overlay} aria-hidden="true">
                        <span className={styles.overlayTitle}>
                          {project.title}
                        </span>
                        <span className={styles.overlayHint}>
                          {content.work.modal.hintLabel}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
