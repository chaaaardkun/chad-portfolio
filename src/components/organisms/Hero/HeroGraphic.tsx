import { content } from "@/lib/content";
import { HeroStatValue } from "./HeroStatValue";
import styles from "./Hero.module.scss";

// delay mirrors each card's --enter-delay in Hero.module.scss.
const STAT_LAYOUT = [
  { delay: 0.8, className: styles.statTopLeft },
  { delay: 0.92, className: styles.statTopRight },
  { delay: 1.04, className: styles.statBottomRight },
  { delay: 1.16, className: styles.statBottomMid },
];

const STATS = content.hero.stats.map((stat, index) => ({ ...stat, ...STAT_LAYOUT[index] }));

// Placeholder screen content. Decorative only, so the graphic is hidden from assistive tech.
const CARD_CLASSES = [styles.cardLight, styles.cardAccent, styles.cardViolet, styles.cardBlue];

function Screen() {
  return (
    <div className={styles.ui}>
      <div className={styles.uiBar}>
        <i />
        <i />
        <i />
        <u />
      </div>
      <div className={styles.uiBanner}>
        <h4>{content.hero.graphicScreenTitle}</h4>
        <p />
      </div>
      <div className={styles.uiCards}>
        {CARD_CLASSES.map((cardClass) => (
          <div key={cardClass} className={cardClass} />
        ))}
      </div>
    </div>
  );
}

/** Layered phone-over-laptop graphic. Stats are the owner's figures; screens are placeholders. */
export function HeroGraphic() {
  return (
    <div className={styles.graphic} aria-hidden="true">
      <div className={styles.laptop}>
        <div className={styles.laptopLid}>
          <div className={styles.screen}>
            <Screen />
          </div>
        </div>
        <div className={styles.laptopBase} />
      </div>
      <div className={styles.phone}>
        <div className={styles.screen}>
          <Screen />
        </div>
      </div>
      {STATS.map(({ value, suffix, label, delay, className }) => (
        <p key={label} className={`${styles.stat} ${className}`}>
          <HeroStatValue value={value} suffix={suffix} delay={delay} />
          <span>{label}</span>
        </p>
      ))}
    </div>
  );
}
