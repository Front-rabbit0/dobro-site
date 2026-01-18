import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";

const KEY = "mvp.adminProjectState";
// shape:
// {
//   deleted: { [projectId]: true },
//   status:  { [projectId]: "active" | "archived" }
// }

export function useAdminProjectState() {
  const [state, setState] = useLocalStorage(KEY, { deleted: {}, status: {} });

  const isDeleted = useCallback((id) => Boolean(state?.deleted?.[String(id)]), [state]);
  const getStatus = useCallback(
    (id, fallback = "active") => state?.status?.[String(id)] ?? fallback,
    [state]
  );

  const setDeleted = useCallback(
    (id, deleted) => {
      const pid = String(id);
      setState((prev) => ({
        deleted: { ...(prev?.deleted ?? {}), [pid]: Boolean(deleted) },
        status: prev?.status ?? {},
      }));
    },
    [setState]
  );

  const setStatus = useCallback(
    (id, status) => {
      const pid = String(id);
      setState((prev) => ({
        deleted: prev?.deleted ?? {},
        status: { ...(prev?.status ?? {}), [pid]: status },
      }));
    },
    [setState]
  );

  const value = useMemo(
    () => ({ state, isDeleted, getStatus, setDeleted, setStatus }),
    [state, isDeleted, getStatus, setDeleted, setStatus]
  );

  return value;
}
