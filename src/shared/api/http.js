export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

/**
 * Универсальная обёртка над fetch.
 * Потом сюда легко добавить токены, refresh, обработку ошибок и т.д.
 */
export async function http(input, init) {
  const url = new URL(String(input), API_BASE_URL);

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }

  return await res.json();
}
