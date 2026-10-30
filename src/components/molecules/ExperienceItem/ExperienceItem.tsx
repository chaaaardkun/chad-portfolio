import { Reveal } from "@/components/atoms/Reveal/Reveal";
import styles from "./ExperienceItem.module.scss";

type ExperienceItemProps = {
  company: string;
  location?: string;
  position: string;
  period: string;
  highlights: readonly string[];
};

export function ExperienceItem({ company, location, position, period, highlights }: ExperienceItemProps) {
  return (
    <article>
      <div className={styles.body}>
        <Reveal as="h3" className={styles.company}>
          {company}
        </Reveal>
        {location && (
          <Reveal as="p" className={styles.meta} delay={0.05}>
            {location}
          </Reveal>
        )}
        <Reveal as="p" className={styles.role} delay={0.1}>
          {position}
        </Reveal>
        <Reveal as="p" className={styles.meta} delay={0.15}>
          {period}
        </Reveal>
        <ul className={styles.highlights}>
          {highlights.map((highlight) => (
            <Reveal key={highlight} as="li">
              {highlight}
            </Reveal>
          ))}
        </ul>
      </div>
    </article>
  );
}
