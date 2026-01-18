import { Link } from "react-router-dom";
import { Card } from "@/shared/ui/Card/Card";
import { Button } from "@/shared/ui/Button/Button";
import { Badge } from "@/shared/ui/Badge/Badge";

function applicationLabel(status) {
  if (status === "approved") return "Заявка подтверждена";
  if (status === "rejected") return "Заявка отклонена";
  return "Заявка отправлена";
}

export function OpportunityCard({ opportunity, application, onCancelApplication }) {
  const directions =
    Array.isArray(opportunity.directions) && opportunity.directions.length
      ? opportunity.directions
      : opportunity.category
        ? [opportunity.category]
        : [];

  return (
    <Card>
      <Card.Header>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: 16 }}>{opportunity.title}</h2>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <Badge variant={opportunity.isActive ? "success" : "default"}>
                {opportunity.isActive ? "Активно" : "Завершено"}
              </Badge>

              {application ? (
                <Badge variant="primary">{applicationLabel(application.status)}</Badge>
              ) : null}
            </div>
          </div>

          {opportunity.city ? (
            <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>
              📍 {opportunity.city}
            </div>
          ) : null}
        </div>
      </Card.Header>

      <Card.Body>
        <p style={{ marginBottom: 12 }}>{opportunity.description}</p>

        {directions.length ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {directions.map((d) => (
              <Badge key={d} variant="primary">
                {d}
              </Badge>
            ))}
          </div>
        ) : null}
      </Card.Body>

      <Card.Footer>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to={`/opportunities/${opportunity.id}`}>
            <Button variant="secondary">Подробнее</Button>
          </Link>

          {application ? (
            <Button variant="secondary" onClick={onCancelApplication}>
              Отозвать
            </Button>
          ) : (
            <Link to={`/opportunities/${opportunity.id}`}>
              <Button>Откликнуться</Button>
            </Link>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
}
