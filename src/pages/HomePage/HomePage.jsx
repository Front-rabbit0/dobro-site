import { Card } from "@/shared/ui/Card/Card";
import { useContent } from "@/entities/content/model/useContent";

import { Hero } from "@/widgets/home/Hero/Hero";
import { HowItWorks } from "@/widgets/home/HowItWorks/HowItWorks";
import { FeaturedProjects } from "@/widgets/home/FeaturedProjects/FeaturedProjects";

export function HomePage() {
  const { getPage } = useContent();

  return (
    <div style={{ display: "grid", gap: 18 }}>
      {/* HERO */}
      <Hero />

      {/* О ПРОЕКТЕ */}
      <Card>
        <Card.Body>
          <h2 style={{ marginTop: 0 }}>О проекте</h2>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {getPage("about")}
          </p>
        </Card.Body>
      </Card>

      {/* КАК ЭТО РАБОТАЕТ */}
      <HowItWorks />

      {/* РЕКОМЕНДУЕМЫЕ ПРОЕКТЫ */}
      <FeaturedProjects />

      {/* МИССИЯ */}
      <Card>
        <Card.Body>
          <h2 style={{ marginTop: 0 }}>Миссия и цели</h2>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {getPage("mission")}
          </p>
        </Card.Body>
      </Card>

      {/* КОНТАКТЫ */}
      <Card>
        <Card.Body>
          <h2 style={{ marginTop: 0 }}>Контакты</h2>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {getPage("contacts")}
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
