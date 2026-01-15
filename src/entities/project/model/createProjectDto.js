export function createProjectDto() {
  return {
    id: crypto?.randomUUID?.() ?? String(Math.random()).slice(2),
    title: "",
    description: "",
    goals: "",
    tasks: "",
    city: "",
    directions: [],     // массив направлений
    requiredSkills: "", // текстом (пока)
    curatorName: "",
    contacts: "",
    startDate: "",      // YYYY-MM-DD
    endDate: "",        // YYYY-MM-DD
    status: "active",   // active | in_progress | finished
    ownerId: "me",
    createdAt: new Date().toISOString(),
  };
}
