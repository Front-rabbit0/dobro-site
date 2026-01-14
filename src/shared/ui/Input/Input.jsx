import styles from "./Input.module.css";
import { cn } from "@/shared/lib/cn";

export function Input({
  label,
  hint,
  error,
  className,
  ...props
}) {
  return (
    <div className={cn(styles.field, className)}>
      {label ? <div className={styles.label}>{label}</div> : null}

      <input className={styles.input} {...props} />

      {error ? (
        <div className={styles.error}>{error}</div>
      ) : hint ? (
        <div className={styles.hint}>{hint}</div>
      ) : null}
    </div>
  );
}
