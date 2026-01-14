import { Link } from "react-router-dom";
import { useApplications } from "@/features/applications/model/useApplications";
import { opportunitiesMock } from "@/entities/opportunity/model/mock";
import { Card } from "@/shared/ui/Card/Card";
import { Badge } from "@/shared/ui/Badge/Badge";
import { Button } from "@/shared/ui/Button/Button";

function statusLabel(status) {
  if (status === "approved") return "Подтверждена";
  if (status === "rejected") return "Отклонена";
  return "На рассмотрении";
}

export function MyApplications() {
  const apps = useApplications();

  if (!apps.apps.length) {
    return (
      <Card>
        <Card.Body>
          <div style={{ display: "grid", gap: 8 }}>
            <strong>У вас пока нет откликов</strong>
            <p>Откройте каталог и откликнитесь на проект.</p>
            <Link to="/opportunities">
              <Button>Перейти к проектам</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {apps.apps.map((a) => {
        const project = opportunitiesMock.find((p) => p.id === a.projectId);

        return (
          <Card key={a.id}>
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "grid", gap: 6 }}>
                  <strong>{project ? project.title : "Проект не найден"}</strong>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Badge variant="primary">{statusLabel(a.status)}</Badge>
                    {project?.city ? <Badge>{project.city}</Badge> : null}
                    {project?.category ? <Badge>{project.category}</Badge> : null}
                  </div>
                  <p style={{ fontSize: 12 }}>
                    Отправлено: {new Date(a.createdAt).toLocaleString("ru-RU")}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {project ? (
                    <Link to={`/opportunities/${project.id}`}>
                      <Button variant="secondary">Открыть проект</Button>
                    </Link>
                  ) : null}

                  <Button variant="secondary" onClick={() => apps.cancel(a.projectId)}>
                    Отозвать
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}
