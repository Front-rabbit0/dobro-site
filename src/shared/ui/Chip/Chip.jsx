import styles from "./Chip.module.css";
import { cn } from "@/shared/lib/cn";

export function Chip({ children, onRemove, className }) {
  return (
    <span className={cn(styles.chip, className)}>
      {children}
      {onRemove ? (
        <button type="button" className={styles.x} onClick={onRemove} aria-label="Удалить фильтр">
          ✕
        </button>
      ) : null}
    </span>
  );
}
