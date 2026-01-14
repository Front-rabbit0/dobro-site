import { Outlet, Link, NavLink } from "react-router-dom";
import { Container } from "@/shared/ui/Container/Container";
import { Button } from "@/shared/ui/Button/Button";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Container>
          <div className={styles.headerInner}>
            <Link to="/" className={styles.brand}>
              <span className={styles.brandMark}>ДВ</span>
              <span>Платформа</span>
            </Link>

            <nav className={styles.nav}>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
              >
                Главная
              </NavLink>

              <NavLink
                to="/opportunities"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
              >
                Возможности
              </NavLink>

              <NavLink
                to="/cabinet"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
              >
                Кабинет
              </NavLink>
            </nav>

            <div className={styles.headerActions}>
              <Button variant="secondary">Войти</Button>
              <Button variant="accent">Подать заявку</Button>
            </div>
          </div>
        </Container>
      </header>

      <main className={styles.main}>
        <Container>
          <Outlet />
        </Container>
      </main>

      <footer className={styles.footer}>
        <Container>
          <div className={styles.footerInner}>
            © {new Date().getFullYear()} DVFU-like platform
          </div>
        </Container>
      </footer>
    </div>
  );
}
