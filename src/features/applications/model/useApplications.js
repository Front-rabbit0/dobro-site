import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";

const STORAGE_KEY = "mvp.applications";
const STATUSES = ["pending", "approved", "rejected"];

function safeStatus(status) {
  return STATUSES.includes(status) ? status : "pending";
}

function uid() {
  return (crypto?.randomUUID?.() ?? String(Math.random()).slice(2)) + "";
}

export function useApplications() {
  const [apps, setApps] = useLocalStorage(STORAGE_KEY, []);

  // Мягкая миграция старых записей (без userId/appId и т.п.)
  const normalized = useMemo(() => {
    return (apps ?? []).map((a) => ({
      id: a.id ?? uid(),
      projectId: String(a.projectId ?? a.id ?? ""),
      userId: a.userId ?? "legacy",
      userEmail: a.userEmail ?? "",
      userName: a.userName ?? "Пользователь",
      message: a.message ?? "",
      status: safeStatus(a.status),
      createdAt: a.createdAt ?? new Date().toISOString(),
      updatedAt: a.updatedAt ?? a.createdAt ?? new Date().toISOString(),
    }));
  }, [apps]);

  const replaceAll = useCallback(
    (next) => {
      setApps(next);
    },
    [setApps]
  );

  const listByProjectId = useCallback(
    (projectId) => normalized.filter((a) => a.projectId === String(projectId)),
    [normalized]
  );

  const getMyByProjectId = useCallback(
    (projectId, userId) =>
      normalized.find(
        (a) => a.projectId === String(projectId) && a.userId === String(userId)
      ) ?? null,
    [normalized]
  );

  const listMine = useCallback(
    (userId) => normalized.filter((a) => a.userId === String(userId)),
    [normalized]
  );

  const apply = useCallback(
    (projectId, payload) => {
      const pid = String(projectId);
      const userId = String(payload?.userId ?? "me");

      // не даём одному пользователю подать 2 заявки на один проект
      const already = normalized.some((a) => a.projectId === pid && a.userId === userId);
      if (already) return;

      const next = [
        {
          id: uid(),
          projectId: pid,
          userId,
          userEmail: payload?.userEmail ?? "",
          userName: payload?.userName ?? "Пользователь",
          message: payload?.message ?? "",
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...normalized,
      ];

      replaceAll(next);
    },
    [normalized, replaceAll]
  );

  const cancelById = useCallback(
    (applicationId) => {
      const id = String(applicationId);
      replaceAll(normalized.filter((a) => a.id !== id));
    },
    [normalized, replaceAll]
  );

  const cancelMy = useCallback(
    (projectId, userId) => {
      const pid = String(projectId);
      const uid2 = String(userId);
      replaceAll(normalized.filter((a) => !(a.projectId === pid && a.userId === uid2)));
    },
    [normalized, replaceAll]
  );

  const setStatus = useCallback(
    (applicationId, status) => {
      const id = String(applicationId);
      const st = safeStatus(status);

      replaceAll(
        normalized.map((a) =>
          a.id === id ? { ...a, status: st, updatedAt: new Date().toISOString() } : a
        )
      );
    },
    [normalized, replaceAll]
  );

  return {
    apps: normalized,              // массив заявок
    listByProjectId,               // заявки по проекту (массив)
    getMyByProjectId,              // моя заявка по проекту (1 или null)
    listMine,                      // мои заявки (для "Мои отклики")
    apply,                         // создать заявку
    cancelById,                    // удалить заявку по id
    cancelMy,                      // удалить мою заявку по (projectId,userId)
    setStatus,                     // approve/reject по id заявки
  };
}
