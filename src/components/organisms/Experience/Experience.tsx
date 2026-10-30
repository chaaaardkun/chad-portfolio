"use client";

import { useState } from "react";
import { Dot } from "@/components/atoms/Dot/Dot";
import { SectionHeading } from "@/components/atoms/SectionHeading/SectionHeading";
import { WaveShape } from "@/components/atoms/WaveShape/WaveShape";
import { waves } from "@/components/atoms/WaveShape/waves";
import { ExperienceItem } from "@/components/molecules/ExperienceItem/ExperienceItem";
import { content } from "@/lib/content";
import styles from "./Experience.module.scss";

export function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const jobs = content.experience.items;
  const job = jobs[activeIndex];

  return (
    <section id="experience" className={styles.section}>
      <SectionHeading eyebrow={content.experience.eyebrow} title={content.experience.title} />
      <div className={styles.list}>
        <div className={styles.timeline} role="group" aria-label={content.experience.title}>
          {jobs.map((entry, index) => (
            <div key={entry.company} className={styles.step}>
              <Dot
                label={entry.company}
                active={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
              {index < jobs.length - 1 && <span className={styles.line} aria-hidden="true" />}
            </div>
          ))}
        </div>
        <div key={job.company} className={styles.panel}>
          <ExperienceItem {...job} />
        </div>
      </div>
      {/* Last child so the `:first-child` width rule in the module doesn't capture it. */}
      <WaveShape spec={waves.experience} />
    </section>
  );
}
