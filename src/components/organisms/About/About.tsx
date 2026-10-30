import Image from "next/image";
import { SectionHeading } from "@/components/atoms/SectionHeading/SectionHeading";
import { WaveShape } from "@/components/atoms/WaveShape/WaveShape";
import { waves } from "@/components/atoms/WaveShape/waves";
import { content, fill, profile } from "@/lib/content";
import { Reveal } from "@/components/atoms/Reveal/Reveal";
import styles from "./About.module.scss";

export function About() {
  return (
    <section id="about" className={styles.section}>
      <WaveShape spec={waves.about} />

      <div className={styles.inner}>
        <div className={styles.avatarWrapper}>
          <Image
            src={profile.avatar}
            alt={fill(profile.avatarAlt, { name: profile.name })}
            width={280}
            height={280}
            className={styles.avatar}
            sizes="(min-width: 768px) 280px, 240px"
          />
        </div>

        <div className={styles.copy}>
          <SectionHeading title={content.about.title} align="start" />
          {content.about.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} as="p" className={styles.paragraph} delay={0.1 * (index + 1)}>
              {paragraph}
            </Reveal>
          ))}
        </div>
      </div>

      <a href={`mailto:${profile.email}`} className={styles.email}>
        {profile.email}
      </a>
    </section>
  );
}
