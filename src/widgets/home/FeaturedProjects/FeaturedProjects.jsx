import { Link } from "react-router-dom";
import { opportunitiesMock } from "@/entities/opportunity/model/mock";
import { OpportunityCard } from "@/entities/opportunity/ui/OpportunityCard";
import { Button } from "@/shared/ui/Button/Button";

export function FeaturedProjects() {
  const top = opportunitiesMock.slice(0, 3);

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
        {top.map((op) => (
          <OpportunityCard key={op.id} opportunity={op} />
        ))}
      </div>
    </div>
  );
}
