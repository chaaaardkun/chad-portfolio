import { Reveal } from "@/components/atoms/Reveal/Reveal";
import styles from "./SectionHeading.module.scss";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  align?: "center" | "start";
};

export function SectionHeading({
  eyebrow,
  title,
  align = "center",
}: SectionHeadingProps) {
  return (
    <header className={`${styles.heading} ${styles[align]}`}>
      {eyebrow && (
        <Reveal as="p" className={styles.eyebrow}>
          {eyebrow}
        </Reveal>
      )}
      <Reveal as="h2" className={styles.title} delay={eyebrow ? 0.1 : 0}>
        {title}
      </Reveal>
    </header>
  );
}
