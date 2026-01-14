import { Link } from "react-router-dom";
import { Card } from "@/shared/ui/Card/Card";
import { Button } from "@/shared/ui/Button/Button";
import { Badge } from "@/shared/ui/Badge/Badge";

export function OpportunityCard({ opportunity, application, onCancelApplication }) {
  return (
    <Card>
      <Card.Header>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 16 }}>{opportunity.title}</h2>
          <Badge variant={opportunity.isActive ? "success" : "default"}>
            {opportunity.isActive ? "Активно" : "Завершено"}
          </Badge>
          {application ? (
            <Badge variant="primary">
              {application.status === "pending"
                ? "Заявка отправлена"
                : application.status === "approved"
                  ? "Заявка подтверждена"
                  : "Заявка отклонена"}
            </Badge>
          ) : null}
        </div>
      </Card.Header>

      <Card.Body>
        <p style={{ marginBottom: 12 }}>{opportunity.description}</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge>{opportunity.city}</Badge>
          <Badge variant="primary">{opportunity.category}</Badge>
        </div>
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
