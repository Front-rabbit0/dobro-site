import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card } from "@/shared/ui/Card/Card";
import { Button } from "@/shared/ui/Button/Button";
import { Badge } from "@/shared/ui/Badge/Badge";
import { Modal } from "@/shared/ui/Modal/Modal";

import { opportunitiesMock } from "@/entities/opportunity/model/mock";
import { useProjects } from "@/entities/project/model/useProjects";
import { useApplications } from "@/features/applications/model/useApplications";
import { useProfile } from "@/entities/user/model/useProfile";

function mapProjectToOpportunity(p) {
  return {
    id: `p_${p.id}`,
    title: p.title,
    description: p.description,
    city: p.city,
    isActive: p.status === "active" || p.status === "in_progress",
    status: p.status,
    directions: p.directions ?? [],
    source: "user",
  };
}

function appLabel(status) {
  if (status === "approved") return "Заявка подтверждена";
  if (status === "rejected") return "Заявка отклонена";
  return "Заявка отправлена";
}

export function OpportunityDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const projects = useProjects();
  const apps = useApplications();
  const { profile } = useProfile();

  // ✅ userId берём из профиля (вариант B)
  const userId = profile?.email?.trim()
    ? profile.email.trim().toLowerCase()
    : "me";

  const userEmail = profile?.email?.trim() ? profile.email.trim() : "";
  const userName = profile?.fullName?.trim()
    ? profile.fullName.trim()
    : profile?.name?.trim()
      ? profile.name.trim()
      : "Пользователь";

  const opportunity = useMemo(() => {
    // 1) Моки
    const mock = opportunitiesMock.find((x) => String(x.id) === String(id));
    if (mock) return mock;

    // 2) Созданные проекты
    if (String(id).startsWith("p_")) {
      const realId = String(id).slice(2);
      const p = projects.getById(realId);
      if (p) return mapProjectToOpportunity(p);
    }

    return null;
  }, [id, projects, projects.projects]);

  const application = opportunity
    ? apps.getMyByProjectId(opportunity.id, userId)
    : null;

  const [openApply, setOpenApply] = useState(false);

  if (!opportunity) {
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <h1>Проект не найден</h1>
        <Button variant="secondary" onClick={() => nav(-1)}>
          Назад
        </Button>
      </div>
    );
  }

  const directions =
    Array.isArray(opportunity.directions) && opportunity.directions.length
      ? opportunity.directions
      : opportunity.category
        ? [opportunity.category]
        : [];

  const canApply = profile?.role === "student";

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="secondary" onClick={() => nav(-1)}>
          ← Назад
        </Button>

        <Badge variant={opportunity.isActive ? "success" : "default"}>
          {opportunity.isActive ? "Активно" : "Завершено"}
        </Badge>

        {application ? <Badge variant="primary">{appLabel(application.status)}</Badge> : null}
      </div>

      <Card>
        <Card.Body>
          <div style={{ display: "grid", gap: 10 }}>
            <h1 style={{ margin: 0 }}>{opportunity.title}</h1>

            {opportunity.city ? (
              <div style={{ fontSize: 14, color: "var(--muted)", fontWeight: 700 }}>
                📍 {opportunity.city}
              </div>
            ) : null}

            {directions.length ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {directions.map((d) => (
                  <Badge key={d} variant="primary">
                    {d}
                  </Badge>
                ))}
              </div>
            ) : null}

            <p style={{ margin: 0 }}>{opportunity.description}</p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
              {application ? (
                <Button variant="secondary" onClick={() => apps.cancelById(application.id)}>
                  Отозвать отклик
                </Button>
              ) : canApply ? (
                <Button onClick={() => setOpenApply(true)}>Принять участие</Button>
              ) : (
                <Badge>Отклик доступен только студенту</Badge>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <Modal
        open={openApply}
        title="Отклик на проект"
        onClose={() => setOpenApply(false)}
        footer={
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="secondary" onClick={() => setOpenApply(false)}>
              Отмена
            </Button>
            <Button
              onClick={() => {
                apps.apply(opportunity.id, {
                  userId,
                  userEmail,
                  userName,
                  message: "",
                });
                setOpenApply(false);
              }}
            >
              Отправить
            </Button>
          </div>
        }
      >
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Сейчас это MVP: отправляем отклик без текста. Позже добавим сообщение и данные пользователя.
        </p>
      </Modal>
    </div>
  );
}
