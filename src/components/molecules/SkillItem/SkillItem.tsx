import type { CSSProperties } from "react";
import { Icon, type IconName } from "@/components/atoms/Icon/Icon";
import { Reveal } from "@/components/atoms/Reveal/Reveal";
import styles from "./SkillItem.module.scss";

type SkillItemProps = {
  name: string;
  icon: IconName;
  color: string;
};

export function SkillItem({ name, icon, color }: SkillItemProps) {
  return (
    <li
      className={styles.item}
      style={{ "--skill-color": color } as CSSProperties}
    >
      <Icon name={icon} size={64} className={styles.icon} />
      <Reveal as="span" className={styles.name}>
        {name}
      </Reveal>
    </li>
  );
}
