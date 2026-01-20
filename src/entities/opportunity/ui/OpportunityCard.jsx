import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/shared/ui/Card/Card";
import { Button } from "@/shared/ui/Button/Button";
import { Badge } from "@/shared/ui/Badge/Badge";
import { useAuth } from "@/entities/auth/model/useAuth"; // поправь путь, если у тебя useAuth лежит иначе

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

  const { isAuthenticated, role } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  function onApplyClick(e) {
    // чтобы не сработал Link (если вдруг обернёшь кнопкой)
    e?.preventDefault?.();

    const toProject = `/opportunities/${opportunity.id}`;

    // Если не авторизован — отправляем на логин и возвращаем обратно на карточку проекта
    if (!isAuthenticated) {
      nav("/login", { state: { from: toProject } });
      return;
    }

    // Если роль не student — можно либо скрывать кнопку, либо показывать сообщение
    if (role && role !== "student") {
      // в MVP можно просто открыть детали, но заявку не давать
      nav(toProject);
      return;
    }

    // авторизован студент — открываем проект
    nav(toProject);
  }

  const canApplyButton = !application; // если уже есть заявка — показываем "Отозвать"

  return (
    <Card>
      <Card.Header>
        <div style={{ display: "grid", gap: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 16 }}>{opportunity.title}</h2>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <Badge variant={opportunity.isActive ? "success" : "default"}>
                {opportunity.isActive ? "Активно" : "Завершено"}
              </Badge>

              {application ? <Badge variant="primary">{applicationLabel(application.status)}</Badge> : null}
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
          <Link to={`/opportunities/${opportunity.id}`} state={{ from: location.pathname }}>
            <Button variant="secondary">Подробнее</Button>
          </Link>

          {application ? (
            <Button variant="secondary" onClick={onCancelApplication}>
              Отозвать
            </Button>
          ) : canApplyButton ? (
            <Button onClick={onApplyClick}>Откликнуться</Button>
          ) : null}
        </div>
      </Card.Footer>
    </Card>
  );
}
