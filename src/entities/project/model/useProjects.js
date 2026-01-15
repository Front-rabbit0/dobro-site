import { useCallback } from "react";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";

const STORAGE_KEY = "mvp.projects";

export function useProjects() {
  const [projects, setProjects] = useLocalStorage(STORAGE_KEY, []);

  const add = useCallback((project) => {
    setProjects((prev) => [project, ...prev]);
  }, [setProjects]);

  const update = useCallback((id, patch) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, [setProjects]);

  const remove = useCallback((id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, [setProjects]);

  const getById = useCallback((id) => {
    return projects.find((p) => p.id === String(id)) ?? null;
  }, [projects]);

  const getMine = useCallback((ownerId = "me") => {
    return projects.filter((p) => p.ownerId === ownerId);
  }, [projects]);

  return { projects, add, update, remove, getById, getMine };
}
