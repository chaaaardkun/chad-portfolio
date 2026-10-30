import Image from "next/image";
import styles from "./ProjectCard.module.scss";

type ProjectCardProps = {
  title: string;
  color: string;
  logo: string;
};

export function ProjectCard({ title, color, logo }: ProjectCardProps) {
  return (
    <div className={styles.card} style={{ background: color }}>
      <Image
        className={styles.image}
        src={logo}
        alt={title}
        width={300}
        height={300}
        draggable={false}
      />
    </div>
  );
}
