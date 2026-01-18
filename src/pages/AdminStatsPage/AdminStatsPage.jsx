import { Card } from "@/shared/ui/Card/Card";
import { Badge } from "@/shared/ui/Badge/Badge";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { opportunitiesMock } from "@/entities/opportunity/model/mock";
import { AdminNav } from "@/widgets/admin/AdminNav/AdminNav";

export function AdminStatsPage() {
  const [users] = useLocalStorage("mvp.users", []);
  const [projects] = useLocalStorage("mvp.projects", []);
  const [apps] = useLocalStorage("mvp.applications", []);

  const totalUsers = Array.isArray(users) ? users.length : 0;

  // проекты = mock + созданные пользователями
  const createdProjects = Array.isArray(projects) ? projects.length : 0;
  const mockProjects = Array.isArray(opportunitiesMock) ? opportunitiesMock.length : 0;
  const totalProjects = mockProjects + createdProjects;

  const totalApps = Array.isArray(apps) ? apps.length : 0;
  const pendingApps = Array.isArray(apps)
    ? apps.filter((a) => a?.status === "pending").length
    : 0;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <AdminNav />

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Админ: статистика</h2>
        <Badge variant="primary">MVP</Badge>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        <StatCard title="Пользователи" value={totalUsers} hint="mvp.users" />
        <StatCard
          title="Проекты"
          value={totalProjects}
          hint={`mock: ${mockProjects}, создано: ${createdProjects}`}
        />
        <StatCard title="Заявки" value={totalApps} hint="mvp.applications" />
        <StatCard title="На рассмотрении" value={pendingApps} hint="status=pending" />
      </div>

      <Card>
        <Card.Body>
          <div style={{ display: "grid", gap: 6 }}>
            <strong>Примечание</strong>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
              Это MVP на фронте: числа считаются из localStorage и моков. На бэке эти метрики заменятся API.
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

function StatCard({ title, value, hint }) {
  return (
    <Card>
      <Card.Body>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{value}</div>
          {hint ? <div style={{ fontSize: 12, color: "var(--muted)" }}>{hint}</div> : null}
        </div>
      </Card.Body>
    </Card>
  );
}
