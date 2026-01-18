import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";

const STORAGE_KEY = "mvp.auth";

// упрощённая "база пользователей" для MVP без бэка
const USERS_KEY = "mvp.users";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function uid() {
  return (crypto?.randomUUID?.() ?? String(Math.random()).slice(2)) + "";
}

export function useAuth() {
  const [session, setSession] = useLocalStorage(STORAGE_KEY, {
    isAuthenticated: false,
    user: null, // { id, email, role }
    token: "",
  });

  const [users, setUsers] = useLocalStorage(USERS_KEY, []);

  const isAuthenticated = Boolean(session?.isAuthenticated && session?.user?.email);

  const getUserByEmail = useCallback(
    (email) => {
      const e = normalizeEmail(email);
      return (users ?? []).find((u) => normalizeEmail(u.email) === e) ?? null;
    },
    [users]
  );

  const register = useCallback(
    ({ email, password, role }) => {
      const e = normalizeEmail(email);
      if (!e || !e.includes("@")) {
        return { ok: false, error: "Введите корректный email" };
      }
      if (!password || String(password).length < 4) {
        return { ok: false, error: "Пароль должен быть минимум 4 символа" };
      }
      if (!role) {
        return { ok: false, error: "Выберите роль" };
      }

      const exists = getUserByEmail(e);
      if (exists) return { ok: false, error: "Пользователь с таким email уже существует" };

      const user = { id: uid(), email: e, role, password: String(password) };
      setUsers((prev) => [user, ...(prev ?? [])]);

      // сразу логиним
      setSession({
        isAuthenticated: true,
        user: { id: user.id, email: user.email, role: user.role },
        token: "mvp-" + uid(),
      });

      return { ok: true };
    },
    [getUserByEmail, setSession, setUsers]
  );

  const login = useCallback(
    ({ email, password }) => {
      const e = normalizeEmail(email);
      const user = getUserByEmail(e);
      if (!user) return { ok: false, error: "Пользователь не найден" };
      if (String(user.password) !== String(password)) return { ok: false, error: "Неверный пароль" };

      setSession({
        isAuthenticated: true,
        user: { id: user.id, email: user.email, role: user.role },
        token: "mvp-" + uid(),
      });

      return { ok: true };
    },
    [getUserByEmail, setSession]
  );

  const logout = useCallback(() => {
    setSession({ isAuthenticated: false, user: null, token: "" });
  }, [setSession]);

  const requestPasswordReset = useCallback((email) => {
    // MVP-заглушка: просто "успешно"
    const e = normalizeEmail(email);
    if (!e || !e.includes("@")) return { ok: false, error: "Введите корректный email" };
    return { ok: true };
  }, []);

  // удобные поля
  const me = useMemo(() => session?.user ?? null, [session]);
  const role = me?.role ?? "guest";

  return {
    isAuthenticated,
    me,
    role,
    users: users ?? [],
    register,
    login,
    logout,
    requestPasswordReset,
  };
}
