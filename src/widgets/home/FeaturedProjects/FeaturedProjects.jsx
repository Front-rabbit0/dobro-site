import { Link } from "react-router-dom";
import { opportunitiesMock } from "@/entities/opportunity/model/mock";
import { OpportunityCard } from "@/entities/opportunity/ui/OpportunityCard";
import { Button } from "@/shared/ui/Button/Button";
import { useApplications } from "@/features/applications/model/useApplications";
import { useAuth } from "@/entities/auth/model/useAuth";

export function FeaturedProjects() {
  const top = opportunitiesMock.slice(0, 3);

  const apps = useApplications();
  const auth = useAuth();

  // ✅ ВАЖНО: "мой userId" существует ТОЛЬКО когда я авторизован
  const userId =
    auth.isAuthenticated && auth?.me?.email?.trim?.()
      ? auth.me.email.trim().toLowerCase()
      : "";

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h2>Рекомендуемые проекты</h2>
        <Link to="/opportunities">
          <Button variant="secondary">Все проекты →</Button>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 18,
          alignItems: "start",
        }}
      >
        {top.map((op) => {
          const myApp = userId ? apps.getMyByProjectId(op.id, userId) : null;

          return (
            <OpportunityCard
              key={op.id}
              opportunity={op}
              application={myApp}
              onCancelApplication={() => {
                if (myApp?.id) apps.cancelById(myApp.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
