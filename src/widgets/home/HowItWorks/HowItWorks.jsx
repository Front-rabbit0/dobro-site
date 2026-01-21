import { Card } from "@/shared/ui/Card/Card";
import { Badge } from "@/shared/ui/Badge/Badge";

export function HowItWorks() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2>Как это работает</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        <Step
          num="1"
          title="Выберите проект"
          text="Откройте каталог, используйте фильтры, изучите цели и задачи."
        />
        <Step
          num="2"
          title="Откликнитесь"
          text="Нажмите «Принять участие» — отправьте заявку куратору/организации."
        />
        <Step
          num="3"
          title="Участвуйте и получайте опыт"
          text="Ведите работу по задачам, получайте фидбек и подтверждение участия."
        />
      </div>
    </div>
  );
}

function Step({ num, title, text }) {
  return (
    <Card>
      <Card.Body>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              {num}
            </div>
            <strong>{title}</strong>
          </div>
          <p>{text}</p>
        </div>
      </Card.Body>
    </Card>
  );
}
