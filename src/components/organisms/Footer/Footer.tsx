import { copyright } from "@/lib/content";
import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copy}>{copyright}</p>
    </footer>
  );
}
