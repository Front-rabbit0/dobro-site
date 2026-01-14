import { useCallback } from "react";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";

const STORAGE_KEY = "mvp.applications";

function nowIso() {
  return new Date().toISOString();
}

export function useApplications() {
  const [apps, setApps] = useLocalStorage(STORAGE_KEY, []);

  const getByProjectId = useCallback(
    (projectId) => apps.find((a) => a.projectId === String(projectId)) ?? null,
    [apps]
  );

  const apply = useCallback(
    ({ projectId, name, email, message }) => {
      const pid = String(projectId);

      setApps((prev) => {
        // если уже есть — не дублируем
        const existing = prev.find((a) => a.projectId === pid);
        if (existing) return prev;

        return [
          ...prev,
          {
            id: crypto?.randomUUID?.() ?? String(Math.random()).slice(2),
            projectId: pid,
            status: "pending", // pending | approved | rejected
            createdAt: nowIso(),
            applicant: { name, email },
            message: message ?? "",
          },
        ];
      });
    },
    [setApps]
  );

  const cancel = useCallback(
    (projectId) => {
      const pid = String(projectId);
      setApps((prev) => prev.filter((a) => a.projectId !== pid));
    },
    [setApps]
  );

  // (на будущее) для куратора/организации: менять статус
  const setStatus = useCallback(
    (projectId, status) => {
      const pid = String(projectId);
      setApps((prev) =>
        prev.map((a) => (a.projectId === pid ? { ...a, status } : a))
      );
    },
    [setApps]
  );

  return { apps, getByProjectId, apply, cancel, setStatus };
}
