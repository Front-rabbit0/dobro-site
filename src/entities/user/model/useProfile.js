import { useCallback, useEffect } from "react";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { defaultProfile } from "./defaultProfile";
import { useAuth } from "@/entities/auth/model/useAuth";

const STORAGE_KEY = "mvp.profile";

export function useProfile() {
  const { isAuthenticated, me } = useAuth();
  const [profile, setProfile] = useLocalStorage(STORAGE_KEY, defaultProfile);

  // ✅ синхронизация с auth
  useEffect(() => {
    if (!isAuthenticated || !me?.email) return;

    setProfile((prev) => ({
      ...prev,
      email: me.email,
      role: me.role,
    }));
  }, [isAuthenticated, me?.email, me?.role, setProfile]);

  const update = useCallback((patch) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, [setProfile]);

  const setField = useCallback((name, value) => {
    // роль и email теперь управляются auth
    if (name === "role" || name === "email") return;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }, [setProfile]);

  const setSkillsFromText = useCallback((text) => {
    const skills = String(text || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const unique = Array.from(new Set(skills));
    setProfile((prev) => ({ ...prev, skills: unique }));
  }, [setProfile]);

  const reset = useCallback(() => {
    // не трогаем email/role если залогинен
    setProfile((prev) => ({
      ...defaultProfile,
      email: isAuthenticated && me?.email ? me.email : defaultProfile.email,
      role: isAuthenticated && me?.role ? me.role : defaultProfile.role,
    }));
  }, [isAuthenticated, me?.email, me?.role, setProfile]);

  return { profile, update, setField, setSkillsFromText, reset };
}
