import { useEffect, useRef, useState } from "react";

const EVENT_NAME = "mvp_local_storage_sync";

export function useLocalStorage(key, initialValue) {
  // держим "последнее сырое значение" как строку, чтобы не ловить циклы из-за JSON.parse
  const lastRawRef = useRef(null);

  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      lastRawRef.current = raw; // запоминаем, что прочитали
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      lastRawRef.current = null;
      return initialValue;
    }
  });

  // запись в localStorage
  useEffect(() => {
    try {
      const raw = JSON.stringify(value);

      // если значение не изменилось — не пишем и не шлём событие
      if (lastRawRef.current === raw) return;

      localStorage.setItem(key, raw);
      lastRawRef.current = raw;

      // уведомляем другие хуки в этой же вкладке
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key } }));
    } catch {
      // ignore
    }
  }, [key, value]);

  // слушаем изменения (и из этой вкладки через CustomEvent, и из других вкладок через storage)
  useEffect(() => {
    function readFresh() {
      try {
        const raw = localStorage.getItem(key);

        // если "сырой" текст тот же — ничего не делаем
        if (lastRawRef.current === raw) return;

        lastRawRef.current = raw;
        const next = raw !== null ? JSON.parse(raw) : initialValue;
        setValue(next);
      } catch {
        lastRawRef.current = null;
        setValue(initialValue);
      }
    }

    function onCustom(e) {
      if (e?.detail?.key !== key) return;
      readFresh();
    }

    function onStorage(e) {
      if (e.key !== key) return;
      readFresh();
    }

    window.addEventListener(EVENT_NAME, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [key, initialValue]);

  return [value, setValue];
}
