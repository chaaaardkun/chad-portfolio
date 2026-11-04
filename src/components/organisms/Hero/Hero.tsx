import { content, profile } from "@/lib/content";
import { ScrollLink } from "@/components/molecules/ScrollLink/ScrollLink";
import { WaveShape } from "@/components/atoms/WaveShape/WaveShape";
import { waves } from "@/components/atoms/WaveShape/waves";
import { HeroGraphic } from "./HeroGraphic";
import { HeroTagline } from "./HeroTagline";
import { HeroTitle } from "./HeroTitle";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section id="top" className={styles.hero} aria-label={profile.name}>
      <WaveShape spec={waves.hero} />

      <div className={`${styles.content} ${styles.reveal}`} data-hero-reveal>
        <HeroTitle />
        <HeroTagline />
        <HeroGraphic />
        <ul className="sr-only">
          {content.hero.stats.map((stat) => (
            <li key={stat.label}>{`${stat.value}${stat.suffix} ${stat.label}`}</li>
          ))}
        </ul>
      </div>

      <div className={`${styles.footer} ${styles.reveal}`} data-hero-reveal>
        <ScrollLink href={content.hero.scrollHref} label={content.hero.scrollLabel} variant="down" />
      </div>
    </section>
  );
}
