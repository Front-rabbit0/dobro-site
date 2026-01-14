import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button/Button";
import { Card } from "@/shared/ui/Card/Card";

export function Hero() {
  return (
    <Card>
      <Card.Body>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 10 }}>
            <h1>Проекты для студентов и организаций</h1>
            <p>
              Платформа, где организации публикуют задачи, а студенты выбирают проекты,
              откликаются и получают практический опыт.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/opportunities">
              <Button>Найти проект</Button>
            </Link>

            <Link to="/about">
              <Button variant="secondary">О проекте</Button>
            </Link>
          </div>

          <div style={{ display: "display", gap: 10 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <MiniStat title="Проекты" value="120+" />
              <MiniStat title="Участники" value="3 000+" />
              <MiniStat title="Организации" value="80+" />
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function MiniStat({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "10px 12px",
        background: "var(--surface)",
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 18, fontWeight: 900 }}>{value}</div>
    </div>
  );
}
