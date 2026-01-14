import styles from "./Badge.module.css";
import { cn } from "@/shared/lib/cn";

export function Badge({ children, variant = "default", className }) {
  return (
    <span className={cn(styles.badge, variant !== "default" && styles[variant], className)}>
      {children}
    </span>
  );
}
