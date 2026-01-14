import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { OpportunitiesFilters } from "@/features/opportunities/filters/OpportunitiesFilters";
import { OpportunitiesList } from "@/widgets/opportunities/OpportunitiesList";
import { opportunitiesMock } from "@/entities/opportunity/model/mock";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useApplications } from "@/features/applications/model/useApplications";

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getBoolParam(sp, key) {
  return sp.get(key) === "1";
}

export function OpportunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const apps = useApplications();

  // Источник правды из URL (чтобы при обновлении страницы всё сохранялось)
  const urlFilters = {
    q: searchParams.get("q") ?? "",
    city: searchParams.get("city") ?? "",
    activeOnly: getBoolParam(searchParams, "active"),
    myOnly: searchParams.get("my") === "1",
    sort: searchParams.get("sort") ?? "relevance", // relevance | title
  };

  // Локальная форма (чтобы печатать комфортно)
  const [form, setForm] = useState(urlFilters);

  // Если URL поменялся — синхронизируем форму
  useEffect(() => {
    setForm(urlFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Debounce только для текстовых полей
  const dq = useDebouncedValue(form.q, 300);
  const dcity = useDebouncedValue(form.city, 300);

  // Авто-применение при дебаунсе + при переключении чекбокса/сортировки
  useEffect(() => {
    const next = new URLSearchParams();

    const q = String(dq ?? "").trim();
    const city = String(dcity ?? "").trim();

    if (q) next.set("q", q);
    if (city) next.set("city", city);
    if (form.activeOnly) next.set("active", "1");
    if (form.myOnly) next.set("my", "1");
    if (form.sort && form.sort !== "relevance") next.set("sort", form.sort);

    setSearchParams(next, { replace: true });
  }, [
    dq,
    dcity,
    form.activeOnly,
    form.myOnly,
    form.sort,
    setSearchParams,
  ]);

  const filteredItems = useMemo(() => {
    const q = normalize(urlFilters.q);
    const city = normalize(urlFilters.city);

    let items = opportunitiesMock.filter((item) => {
      const title = normalize(item.title);
      const description = normalize(item.description);
      const itemCity = normalize(item.city);

      const matchesQ = !q || title.includes(q) || description.includes(q);
      const matchesCity = !city || itemCity.includes(city);
      const matchesActive = !urlFilters.activeOnly || item.isActive;

      const hasMyApp = apps.getByProjectId(item.id) != null;
      const matchesMy = !urlFilters.myOnly || hasMyApp;

      return matchesQ && matchesCity && matchesActive && matchesMy;
    });

    if (urlFilters.sort === "title") {
      items = [...items].sort((a, b) => a.title.localeCompare(b.title, "ru"));
    }

    return items;
  }, [
    urlFilters.q,
    urlFilters.city,
    urlFilters.activeOnly,
    urlFilters.myOnly,
    urlFilters.sort,
    apps.apps, // чтобы пересчиталось, когда появится/исчезнет заявка
  ]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function applyNow() {
    const next = new URLSearchParams();

    const q = String(form.q ?? "").trim();
    const city = String(form.city ?? "").trim();

    if (q) next.set("q", q);
    if (city) next.set("city", city);
    if (form.activeOnly) next.set("active", "1");
    if (form.myOnly) next.set("my", "1");
    if (form.sort && form.sort !== "relevance") next.set("sort", form.sort);

    setSearchParams(next);
  }

  function resetFilters() {
    setForm({ q: "", city: "", activeOnly: false, myOnly: false, sort: "relevance" });
    setSearchParams(new URLSearchParams());
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <h1>Волонтёрские возможности</h1>

      <OpportunitiesFilters
        values={form}
        onChange={updateField}
        onApply={applyNow}
        onReset={resetFilters}
      />

      <OpportunitiesList
        items={filteredItems}
        getApplicationById={apps.getByProjectId}
        onCancelApplication={apps.cancel}
      />
    </div>
  );
}
