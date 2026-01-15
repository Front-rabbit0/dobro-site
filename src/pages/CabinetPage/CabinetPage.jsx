import { useState } from "react";
import { Card } from "@/shared/ui/Card/Card";
import { Button } from "@/shared/ui/Button/Button";
import { MyApplications } from "@/widgets/cabinet/MyApplications/MyApplications";
import { Profile } from "@/widgets/cabinet/Profile/Profile";
import { MyProjects } from "@/widgets/cabinet/MyProjects/MyProjects";


export function CabinetPage() {
  const [tab, setTab] = useState("applications"); // applications | projects | profile

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <h1>Личный кабинет</h1>

      <Card>
        <Card.Body>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              variant={tab === "applications" ? "primary" : "secondary"}
              onClick={() => setTab("applications")}
            >
              Мои отклики
            </Button>
            <Button
              variant={tab === "profile" ? "primary" : "secondary"}
              onClick={() => setTab("profile")}
            >
              Профиль
            </Button>
            <Button
              variant={tab === "projects" ? "primary" : "secondary"}
              onClick={() => setTab("projects")}
            >
              Мои проекты
            </Button>
          </div>
        </Card.Body>
      </Card>

      {tab === "applications" ? <MyApplications /> : tab === "projects" ? <MyProjects /> : <Profile />}
    </div>
  );
}
