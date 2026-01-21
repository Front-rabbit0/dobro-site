import { Link } from "react-router-dom";
import { opportunitiesMock } from "@/entities/opportunity/model/mock";
import { OpportunityCard } from "@/entities/opportunity/ui/OpportunityCard";
import { Button } from "@/shared/ui/Button/Button";
import { useApplications } from "@/features/applications/model/useApplications";
import { useAuth } from "@/entities/auth/model/useAuth";
import { useProfile } from "@/entities/user/model/useProfile";

export function FeaturedProjects() {
  const top = opportunitiesMock.slice(0, 3);

  const apps = useApplications();
  const auth = useAuth();
  const { profile } = useProfile();

  // В MVP userId часто = email. Берём из auth, а если нет — из profile (но откликаться без auth всё равно нельзя).
  const userId =
    auth?.me?.email?.trim?.()
      ? auth.me.email.trim().toLowerCase()
      : profile?.email?.trim?.()
        ? profile.email.trim().toLowerCase()
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
          const myApp =
            userId ? apps.getMyByProjectId(op.id, userId) : null;

          return (
            <OpportunityCard
              key={op.id}
              opportunity={op}
              application={myApp}
              onCancelApplication={() => {
                // если заявка есть — можно удалить по id
                if (myApp?.id) apps.cancelById(myApp.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
