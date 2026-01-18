import { useState } from "react";
import { useProfile } from "@/entities/user/model/useProfile";
import { useProjects } from "@/entities/project/model/useProjects";
import { Card } from "@/shared/ui/Card/Card";
import { Button } from "@/shared/ui/Button/Button";
import { Badge } from "@/shared/ui/Badge/Badge";
import { CreateProjectForm } from "@/features/projects/create/CreateProjectForm";
import { ProjectApplicationsModal } from "@/widgets/projects/ProjectApplicationsModal/ProjectApplicationsModal";

function statusLabel(status) {
  if (status === "in_progress") return "В процессе";
  if (status === "finished") return "Завершён";
  return "Активный";
}

export function MyProjects() {
  const { profile } = useProfile();
  const projects = useProjects();
  const [creating, setCreating] = useState(false);

  const [openApps, setOpenApps] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);


  const canCreate = profile.role === "org" || profile.role === "curator";
  const ownerId = String(profile.email ?? "me").toLowerCase();
  const mine = projects.getMine(ownerId);


  if (!canCreate) {
    return (
      <Card>
        <Card.Body>
          <div style={{ display: "grid", gap: 8 }}>
            <strong>Мои проекты</strong>
            <p>Создавать проекты могут только роли: Организация или Куратор.</p>
            <p>Сменить роль можно в профиле.</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <strong style={{ fontSize: 16 }}>Мои проекты</strong>

        {creating ? (
          <Button variant="secondary" onClick={() => setCreating(false)}>
            Закрыть форму
          </Button>
        ) : (
          <Button onClick={() => setCreating(true)}>Создать проект</Button>
        )}
      </div>

      {creating ? (
        <CreateProjectForm
          onCreate={(p) => {
            const ownerId = String(profile.email ?? "me").toLowerCase();

            projects.add({
              ...p,
              ownerId,
            });

            setCreating(false);
          }}
          onCancel={() => setCreating(false)}
        />
      ) : mine.length === 0 ? (
        <Card>
          <Card.Body>
            <p>Пока нет созданных проектов. Нажми “Создать проект”.</p>
          </Card.Body>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {mine.map((p) => {
            const directions = Array.isArray(p.directions)
              ? p.directions
              : p.direction
                ? [p.direction]
                : [];

            return (
              <Card key={p.id}>
                <Card.Body>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "grid", gap: 6 }}>
                      <strong>{p.title}</strong>

                      <div style={{ display: "grid", gap: 6 }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          <Badge variant="primary">{statusLabel(p.status)}</Badge>
                          {directions.map((d) => (
                            <Badge key={d}>{d}</Badge>
                          ))}
                        </div>

                        {p.city ? (
                          <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>
                            📍 {p.city}
                          </div>
                        ) : null}
                      </div>

                      <p style={{ fontSize: 12 }}>{p.description}</p>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <Button variant="secondary" onClick={() => projects.remove(p.id)}>
                        Удалить
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedProject(p);
                          setOpenApps(true);
                        }}
                      >
                        Отклики
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
      <ProjectApplicationsModal
        open={openApps}
        onClose={() => setOpenApps(false)}
        project={selectedProject}
      />
    </div>
  );
}
