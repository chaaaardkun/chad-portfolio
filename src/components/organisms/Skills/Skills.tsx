import { SectionHeading } from "@/components/atoms/SectionHeading/SectionHeading";
import { SkillItem } from "@/components/molecules/SkillItem/SkillItem";
import { content } from "@/lib/content";
import styles from "./Skills.module.scss";

export function Skills() {
  return (
    <section id="skills" className={styles.section} aria-label={content.skills.title}>
      <SectionHeading eyebrow={content.skills.eyebrow} title={content.skills.title} />
      <ul className={styles.grid}>
        {content.skills.items.map((skill) => (
          <SkillItem
            key={skill.name}
            name={skill.name}
            icon={skill.icon}
            color={skill.color}
          />
        ))}
      </ul>
    </section>
  );
}
