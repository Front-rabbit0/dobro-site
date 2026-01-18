import { Modal } from "@/shared/ui/Modal/Modal";
import { Card } from "@/shared/ui/Card/Card";
import { Button } from "@/shared/ui/Button/Button";
import { Badge } from "@/shared/ui/Badge/Badge";
import { useApplications } from "@/features/applications/model/useApplications";

function statusLabel(status) {
  if (status === "approved") return "Подтверждён";
  if (status === "rejected") return "Отклонён";
  return "На рассмотрении";
}

function statusVariant(status) {
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  return "primary";
}

export function ProjectApplicationsModal({ open, onClose, project }) {
  const apps = useApplications();
  if (!project) return null;

  const projectId = String(project.id);
  const prefixedId = projectId.startsWith("p_") ? projectId : `p_${projectId}`;

  // собираем заявки и по обычному id, и по p_… (на случай старых данных)
  const list = [
    ...apps.listByProjectId(projectId),
    ...apps.listByProjectId(prefixedId),
  ];

  // ✅ дедупликация
  const uniq = new Map(list.map((a) => [a.id, a]));
  const listUniq = Array.from(uniq.values());

  return (
    <Modal
      open={open}
      title={`Отклики на проект: ${project.title}`}
      onClose={onClose}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      }
    >
      <div style={{ display: "grid", gap: 12 }}>
        {!listUniq.length ? (
          <Card>
            <Card.Body>
              <p>Пока нет откликов на этот проект.</p>
            </Card.Body>
          </Card>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {listUniq.map((app) => (
              <Card key={app.id}>
                <Card.Body>
                  <div style={{ display: "grid", gap: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <strong>{app.userName || "Пользователь"}</strong>

                      {app.userEmail ? (
                        <span style={{ fontSize: 12, color: "var(--muted)" }}>
                          {app.userEmail}
                        </span>
                      ) : null}

                      <Badge variant={statusVariant(app.status)}>
                        {statusLabel(app.status)}
                      </Badge>
                    </div>

                    <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
                      Отправлено: {new Date(app.createdAt).toLocaleString("ru-RU")}
                    </p>

                    {app.message ? <p style={{ margin: 0 }}>{app.message}</p> : null}

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <Button onClick={() => apps.setStatus(app.id, "approved")}>
                        Подтвердить
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => apps.setStatus(app.id, "rejected")}
                      >
                        Отклонить
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => apps.setStatus(app.id, "pending")}
                      >
                        Сбросить
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, color: "var(--muted)" }}>
          Это MVP: список заявок хранится в localStorage. Позже подключим бэк, и тут будут
          реальные пользователи.
        </p>
      </div>
    </Modal>
  );
}
