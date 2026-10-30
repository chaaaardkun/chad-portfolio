import styles from "./Dot.module.scss";

type DotProps = {
  active?: boolean;
  label: string;
  onClick?: () => void;
};

export function Dot({ active = false, label, onClick }: DotProps) {
  return (
    <button
      type="button"
      className={`${styles.dot} ${active ? styles.active : ""}`}
      aria-label={label}
      aria-current={active || undefined}
      onClick={onClick}
    />
  );
}
