import { useCallback } from "react";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";

const STORAGE_KEY = "mvp.content";

const DEFAULT_CONTENT = {
  about: "Это платформа для участия студентов в социально значимых проектах.",
  how: "Выберите проект → подайте заявку → дождитесь подтверждения → участвуйте.",
  mission: "Наша миссия — объединять студентов и организации для полезных дел.",
  contacts: "Email: borik.sa@dvfu.ru\nТелефон: +7 (996) 086-92-87",
};

export function useContent() {
  const [content, setContent] = useLocalStorage(STORAGE_KEY, DEFAULT_CONTENT);

  const getPage = useCallback(
    (key) => content?.[key] ?? DEFAULT_CONTENT[key] ?? "",
    [content]
  );

  const setPage = useCallback(
    (key, value) => {
      setContent((prev) => ({ ...prev, [key]: value }));
    },
    [setContent]
  );

  return { content, getPage, setPage };
}
