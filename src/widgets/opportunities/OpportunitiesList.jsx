import { OpportunityCard } from "@/entities/opportunity/ui/OpportunityCard";

export function OpportunitiesList({ items, getMyApplication, onCancelApplication }) {
  if (!items.length) return <div>Ничего не найдено по вашим фильтрам.</div>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 18,
        alignItems: "start",
      }}
    >
      {items.map((opportunity) => {
        const application = getMyApplication(opportunity.id);

        return (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            application={application}
            onCancelApplication={application ? () => onCancelApplication(application.id) : undefined}
          />
        );
      })}
    </div>
  );
}
