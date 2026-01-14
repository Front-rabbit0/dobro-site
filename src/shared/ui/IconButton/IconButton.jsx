import styles from "./IconButton.module.css";
import { cn } from "@/shared/lib/cn";

export function IconButton({ active = false, className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(styles.btn, active && styles.active, className)}
      {...props}
    >
      {children}
    </button>
  );
}
