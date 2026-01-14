import { cn } from "@/shared/lib/cn";
import styles from "./Button.module.css";

export function Button({
  children,
  variant = "primary",   // primary | secondary | danger
  size = "md",          // sm | md | lg
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth && styles.full,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <span className={styles.inner}>
        {loading ? "Загрузка..." : children}
      </span>
    </button>
  );
}
