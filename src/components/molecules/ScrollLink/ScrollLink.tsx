import { Icon } from "@/components/atoms/Icon/Icon";
import styles from "./ScrollLink.module.scss";

type ScrollLinkProps = {
  href: string;
  label: string;
  variant: "down" | "up";
};

export function ScrollLink({ href, label, variant }: ScrollLinkProps) {
  return (
    <a href={href} className={styles.link}>
      {variant === "up" ? <Icon name="arrow-up" size={16} /> : <span className={styles.line} aria-hidden="true" />}
      <span className={styles.label}>{label}</span>
    </a>
  );
}
