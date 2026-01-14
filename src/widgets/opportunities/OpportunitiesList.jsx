import { OpportunityCard } from "@/entities/opportunity/ui/OpportunityCard";

export function OpportunitiesList({ items, getApplicationById, onCancelApplication }) {
  if (!items.length) {
    return <div>Ничего не найдено по вашим фильтрам.</div>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 18,
        alignItems: "start",
      }}
    >
      {items.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          application={getApplicationById(opportunity.id)}
          onCancelApplication={() => onCancelApplication(opportunity.id)}
        />
      ))}
    </div>
  );
}
