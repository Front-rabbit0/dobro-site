import { useMemo, useState } from "react";
import { Card } from "@/shared/ui/Card/Card";
import { Button } from "@/shared/ui/Button/Button";
import { Badge } from "@/shared/ui/Badge/Badge";
import { Input } from "@/shared/ui/Input/Input";
import { opportunitiesMock } from "@/entities/opportunity/model/mock";
import { useProjects } from "@/entities/project/model/useProjects";
import { useAdminProjectState } from "@/features/admin/projects/model/useAdminProjectState";
import { AdminNav } from "@/widgets/admin/AdminNav/AdminNav";

function statusLabel(status) {
  if (status === "archived") return "В архиве";
  if (status === "finished") return "Завершён";
  if (status === "in_progress") return "В процессе";
  return "Активный";
}

function statusVariant(status) {
  if (status === "archived") return "danger";
  if (status === "finished") return "success";
  return "primary";
}

export function AdminProjectsPage() {
  const projects = useProjects(); // created projects
  const admin = useAdminProjectState(); // state for mock projects (archive/delete)
  const [q, setQ] = useState("");

  const all = useMemo(() => {
    const created = (projects.projects ?? []).map((p) => ({
      ...p,
      __source: "local",
    }));

    const mock = (opportunitiesMock ?? [])
      .filter((p) => !admin.isDeleted(p.id))
      .map((p) => ({
        ...p,
        __source: "mock",
        status: admin.getStatus(p.id, p.status ?? "active"),
      }));

    const list = [...created, ...mock];

    const qq = String(q || "").trim().toLowerCase();
    if (!qq) return list;

    return list.filter((p) => {
      const text = `${p.title ?? ""} ${p.description ?? ""} ${p.city ?? ""} ${p.category ?? ""}`.toLowerCase();
      return text.includes(qq);
    });
  }, [projects.projects, admin, q]);

  function toggleArchive(p) {
    const next = p.status === "archived" ? "active" : "archived";

    if (p.__source === "local") {
      projects.update(p.id, { status: next });
    } else {
      admin.setStatus(p.id, next);
    }
  }

  function removeProject(p) {
    if (p.__source === "local") {
      projects.remove(p.id);
    } else {
      admin.setDeleted(p.id, true);
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <AdminNav />

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Админ: проекты</h2>
        <Badge variant="primary">MVP</Badge>
      </div>

      <Card>
        <Card.Body>
          <div style={{ display: "grid", gap: 10 }}>
            <Input
              label="Поиск"
              placeholder="Название, город, описание…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Всего: <b>{all.length}</b> (созданные: <b>{(projects.projects ?? []).length}</b>, моки:{" "}
              <b>{(opportunitiesMock ?? []).filter((p) => !admin.isDeleted(p.id)).length}</b>)
            </div>
          </div>
        </Card.Body>
      </Card>

      {all.length === 0 ? (
        <Card>
          <Card.Body>
            <p style={{ margin: 0 }}>Проектов не найдено.</p>
          </Card.Body>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {all.map((p) => (
            <Card key={`${p.__source}:${p.id}`}>
              <Card.Body>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <strong>{p.title}</strong>
                      <Badge variant={statusVariant(p.status)}>{statusLabel(p.status)}</Badge>
                      <Badge>{p.__source === "local" ? "Созданный" : "Mock"}</Badge>
                    </div>

                    {p.city ? (
                      <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>
                        📍 {p.city}
                      </div>
                    ) : null}

                    {p.description ? (
                      <p style={{ fontSize: 12, margin: 0, color: "var(--text)" }}>{p.description}</p>
                    ) : null}
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <Button variant="secondary" onClick={() => toggleArchive(p)}>
                      {p.status === "archived" ? "Вернуть из архива" : "В архив"}
                    </Button>

                    <Button variant="danger" onClick={() => removeProject(p)}>
                      Удалить
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <Card.Body>
          <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>
            В MVP моки “удаляются/архивируются” только в localStorage (ключ <b>mvp.adminProjectState</b>).
            Созданные проекты меняются в <b>mvp.projects</b>.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
