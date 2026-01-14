import { useCallback } from "react";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { defaultProfile } from "./defaultProfile";

const STORAGE_KEY = "mvp.profile";

export function useProfile() {
  const [profile, setProfile] = useLocalStorage(STORAGE_KEY, defaultProfile);

  const update = useCallback((patch) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, [setProfile]);

  const setField = useCallback((name, value) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  }, [setProfile]);

  const setSkillsFromText = useCallback((text) => {
    const skills = String(text || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // убираем дубли
    const unique = Array.from(new Set(skills));
    setProfile((prev) => ({ ...prev, skills: unique }));
  }, [setProfile]);

  const reset = useCallback(() => {
    setProfile(defaultProfile);
  }, [setProfile]);

  return { profile, update, setField, setSkillsFromText, reset };
}
