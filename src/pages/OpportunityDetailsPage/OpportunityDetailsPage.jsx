import { useParams, Link } from "react-router-dom";
import { opportunitiesMock } from "@/entities/opportunity/model/mock";
import { Card } from "@/shared/ui/Card/Card";
import { Badge } from "@/shared/ui/Badge/Badge";
import { Button } from "@/shared/ui/Button/Button";
import { useState } from "react";
import { useApplications } from "@/features/applications/model/useApplications";
import { ApplyModal } from "@/features/applications/ui/ApplyModal";


export function OpportunityDetailsPage() {
  const { id } = useParams();

  const opportunity = opportunitiesMock.find((item) => item.id === id);

  const apps = useApplications();
  const existing = opportunity ? apps.getByProjectId(opportunity.id) : null;

  const [openApply, setOpenApply] = useState(false);


  if (!opportunity) {
    return (
      <div>
        <h1>Возможность не найдена</h1>
        <Link to="/opportunities">← Вернуться к каталогу</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <Link to="/opportunities">← Назад к каталогу</Link>

      <Card>
        <Card.Header>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <h1>{opportunity.title}</h1>
            <Badge variant={opportunity.isActive ? "success" : "default"}>
              {opportunity.isActive ? "Активно" : "Завершено"}
            </Badge>
          </div>
        </Card.Header>

        <Card.Body>
          <p style={{ marginBottom: 16 }}>{opportunity.description}</p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge>{opportunity.city}</Badge>
            <Badge variant="primary">{opportunity.category}</Badge>
          </div>
        </Card.Body>

        <Card.Footer>
          {existing ? (
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ fontWeight: 700 }}>
                Статус заявки:{" "}
                {existing.status === "pending"
                  ? "На рассмотрении"
                  : existing.status === "approved"
                    ? "Подтверждена"
                    : "Отклонена"}
              </div>

              <Button variant="secondary" onClick={() => apps.cancel(opportunity.id)}>
                Отозвать заявку
              </Button>
            </div>
          ) : (
            <Button
              fullWidth
              disabled={!opportunity.isActive}
              onClick={() => setOpenApply(true)}
            >
              {opportunity.isActive ? "Принять участие" : "Набор завершён"}
            </Button>
          )}
        </Card.Footer>
      </Card>
      <ApplyModal
        open={openApply}
        projectTitle={opportunity.title}
        onClose={() => setOpenApply(false)}
        onSubmit={(payload) =>
          apps.apply({
            projectId: opportunity.id,
            ...payload,
          })
        }
      />
    </div>
  );
}
