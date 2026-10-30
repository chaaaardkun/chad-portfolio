import type { ReactNode } from "react";
import styles from "./FormField.module.scss";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {children}
    </div>
  );
}
