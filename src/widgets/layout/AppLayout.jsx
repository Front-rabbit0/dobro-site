import { Outlet, Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Container } from "@/shared/ui/Container/Container";
import { Button } from "@/shared/ui/Button/Button";
import styles from "./AppLayout.module.css";
import { useAuth } from "@/entities/auth/model/useAuth";

export function AppLayout() {
  const { isAuthenticated, logout, role } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  function goLogin() {
    nav("/login", { state: { from: location.pathname } });
  }

  function goApply() {
    if (!isAuthenticated) {
      nav("/login", { state: { from: "/opportunities" } });
      return;
    }
    nav("/opportunities");
  }

  function onLogout() {
    logout();
    nav("/", { replace: true });
  }

  const showApply = !isAuthenticated || role === "student";

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

              {/* ✅ Админка только для куратора */}
              {isAuthenticated && role === "curator" ? (
                <NavLink
                  to="/admin/stats"
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                  }
                >
                  Админ
                </NavLink>
              ) : null}
            </nav>

            <div className={styles.headerActions}>
              {isAuthenticated ? (
                <Button variant="danger" onClick={onLogout}>
                  Выйти
                </Button>
              ) : (
                <Button variant="secondary" onClick={goLogin}>
                  Войти
                </Button>
              )}

              {showApply ? (
                <Button variant="accent" onClick={goApply}>
                  Подать заявку
                </Button>
              ) : null}
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
          <div className={styles.footerInner}>© {new Date().getFullYear()} DVFU-like platform</div>
        </Container>
      </footer>
    </div>
  );
}
