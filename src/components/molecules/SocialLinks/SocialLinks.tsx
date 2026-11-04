import { Icon } from "@/components/atoms/Icon/Icon";
import { content } from "@/lib/content";
import styles from "./SocialLinks.module.scss";

const links = content.site.socialLinks;

export function SocialLinks() {
  return (
    <ul className={styles.list}>
      {links.map(({ label, href, icon }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (${content.site.newTabLabel})`} className={styles.link}>
            <Icon name={icon} size={28} />
          </a>
        </li>
      ))}
    </ul>
  );
}
