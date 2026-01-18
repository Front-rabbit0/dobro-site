import { Link, useLocation } from "react-router-dom";
import { Card } from "@/shared/ui/Card/Card";
import { Button } from "@/shared/ui/Button/Button";

function isActivePath(pathname, target) {
  return pathname === target || pathname.startsWith(target + "/");
}

export function AdminNav() {
  const location = useLocation();

  const statsActive = isActivePath(location.pathname, "/admin/stats");
  const projectsActive = isActivePath(location.pathname, "/admin/projects");
  const contentActive = isActivePath(location.pathname, "/admin/content");

  return (
    <Card>
      <Card.Body>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <strong style={{ marginRight: 6 }}>Админка</strong>

          <Link to="/admin/stats" style={{ textDecoration: "none" }}>
            <Button variant={statsActive ? "primary" : "secondary"} size="sm">
              Статистика
            </Button>
          </Link>

          <Link to="/admin/projects" style={{ textDecoration: "none" }}>
            <Button variant={projectsActive ? "primary" : "secondary"} size="sm">
              Проекты
            </Button>
          </Link>

          <Link to="/admin/content" style={{ textDecoration: "none" }}>
            <Button variant={contentActive ? "primary" : "secondary"} size="sm">
              Контент
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
