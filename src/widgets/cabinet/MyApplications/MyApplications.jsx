import { Link } from "react-router-dom";
import { useApplications } from "@/features/applications/model/useApplications";
import { useProjects } from "@/entities/project/model/useProjects";
import { useProfile } from "@/entities/user/model/useProfile";
import { opportunitiesMock } from "@/entities/opportunity/model/mock";
import { Card } from "@/shared/ui/Card/Card";
import { Badge } from "@/shared/ui/Badge/Badge";
import { Button } from "@/shared/ui/Button/Button";

function statusLabel(status) {
  if (status === "approved") return "Подтверждена";
  if (status === "rejected") return "Отклонена";
  return "На рассмотрении";
}

function mapProjectToOpportunity(p) {
  return {
    id: String(p.id),
    title: p.title,
    city: p.city,
    category: p.category,
    directions: Array.isArray(p.directions) ? p.directions : p.direction ? [p.direction] : [],
    description: p.description,
  };
}

function normalizeId(id) {
  const s = String(id);
  return s.startsWith("p_") ? s.slice(2) : s;
}

export function MyApplications() {
  const apps = useApplications();
  const { profile } = useProfile();
  const projects = useProjects();

  const userId = String(profile?.email ?? "me").toLowerCase();

  // ✅ мои заявки: по userId, плюс поддержка старых "legacy" если email не задан
  const my = apps.apps.filter(
    (a) => a.userId === userId || (userId === "me" && a.userId === "legacy")
  );

  // ✅ объединяем mock + user projects
  const allProjects = [
    ...(opportunitiesMock ?? []),
    ...((projects?.projects ?? []).map(mapProjectToOpportunity)),
  ];

  function findProjectById(id) {
    const raw = String(id);

    // 1) пробуем как есть
    let p = allProjects.find((x) => String(x.id) === raw);
    if (p) return p;

    // 2) пробуем без префикса p_
    const norm = normalizeId(raw);
    p = allProjects.find((x) => normalizeId(x.id) === norm);
    return p ?? null;
  }

  if (!my.length) {
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
      {my.map((a) => {
        const project = findProjectById(a.projectId);

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

                  {/* ✅ правильный отзыв: по id заявки */}
                  <Button variant="secondary" onClick={() => apps.cancelById(a.id)}>
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
