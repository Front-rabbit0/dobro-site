import styles from "./Card.module.css";
import { cn } from "@/shared/lib/cn";

export function Card({ className, children }) {
  return <div className={cn(styles.card, className)}>{children}</div>;
}

Card.Header = function CardHeader({ className, children }) {
  return <div className={cn(styles.header, className)}>{children}</div>;
};

Card.Body = function CardBody({ className, children }) {
  return <div className={cn(styles.body, className)}>{children}</div>;
};

Card.Footer = function CardFooter({ className, children }) {
  return <div className={cn(styles.footer, className)}>{children}</div>;
};
