import { useEffect, useState } from "react";

/**
 * Хук для работы с localStorage как с обычным useState
 * @param {string} key
 * @param {*} initialValue
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // может упасть в приватном режиме — игнорируем
    }
  }, [key, value]);

  return [value, setValue];
}
