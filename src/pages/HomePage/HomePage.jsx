import { Hero } from "@/widgets/home/Hero/Hero";
import { HowItWorks } from "@/widgets/home/HowItWorks/HowItWorks";
import { FeaturedProjects } from "@/widgets/home/FeaturedProjects/FeaturedProjects";

export function HomePage() {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <Hero />
      <HowItWorks />
      <FeaturedProjects />
    </div>
  );
}
