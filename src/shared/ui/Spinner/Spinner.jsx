import styles from "./Spinner.module.css";
import { cn } from "@/shared/lib/cn";

export function Spinner({ className }) {
  return <span className={cn(styles.spinner, className)} aria-label="Loading" />;
}
