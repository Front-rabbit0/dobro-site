import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { OpportunitiesFilters } from "@/features/opportunities/filters/OpportunitiesFilters";
import { OpportunitiesList } from "@/widgets/opportunities/OpportunitiesList";
import { opportunitiesMock } from "@/entities/opportunity/model/mock";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useApplications } from "@/features/applications/model/useApplications";
import { useProjects } from "@/entities/project/model/useProjects";
import { useAuth } from "@/entities/auth/model/useAuth";

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getBoolParam(sp, key) {
  return sp.get(key) === "1";
}

function mapProjectToOpportunity(p) {
  return {
    id: `p_${p.id}`, // чтобы не пересекалось с моками
    title: p.title,
    description: p.description,
    city: p.city,
    isActive: p.status === "active" || p.status === "in_progress",
    status: p.status,
    directions: p.directions ?? [],
    source: "user",
  };
}

export function OpportunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const apps = useApplications();
  const projects = useProjects();
  const auth = useAuth();

  // ✅ ВАЖНО: userId существует только когда авторизован
  const userId =
    auth.isAuthenticated && auth?.me?.email?.trim?.()
      ? auth.me.email.trim().toLowerCase()
      : "";

  // Источник правды из URL
  const urlFilters = {
    q: searchParams.get("q") ?? "",
    city: searchParams.get("city") ?? "",
    activeOnly: getBoolParam(searchParams, "active"),
    myOnly: getBoolParam(searchParams, "my"),
    sort: searchParams.get("sort") ?? "relevance", // relevance | title
  };

  // Локальная форма
  const [form, setForm] = useState(urlFilters);

  // Синхронизация формы при back/forward
  useEffect(() => {
    setForm(urlFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // debounce для текстовых полей
  const dq = useDebouncedValue(form.q, 300);
  const dcity = useDebouncedValue(form.city, 300);

  // Записываем фильтры в URL
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
  }, [dq, dcity, form.activeOnly, form.myOnly, form.sort, setSearchParams]);

  const filteredItems = useMemo(() => {
    const q = normalize(urlFilters.q);
    const city = normalize(urlFilters.city);

    // ✅ объединяем: созданные проекты + моки
    const allItems = [
      ...projects.projects.map(mapProjectToOpportunity),
      ...opportunitiesMock,
    ];

    let items = allItems.filter((item) => {
      const title = normalize(item.title);
      const description = normalize(item.description);
      const itemCity = normalize(item.city);

      const matchesQ = !q || title.includes(q) || description.includes(q);
      const matchesCity = !city || itemCity.includes(city);
      const matchesActive = !urlFilters.activeOnly || item.isActive;

      // ✅ ВАЖНО: "мои" заявки считаем только если авторизован
      const hasMyApp = userId ? apps.getMyByProjectId(item.id, userId) != null : false;
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
    apps.apps, // чтобы пересчитывалось при изменении заявок
    projects.projects, // чтобы пересчитывалось при создании проектов
    userId,
  ]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function applyNow() {
    // мгновенно пробрасываем form в URL (без debounce)
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
        // ✅ ВАЖНО: если не авторизован — возвращаем null, чтобы карточки не показывали "заявка отправлена"
        getMyApplication={(projectId) => (userId ? apps.getMyByProjectId(projectId, userId) : null)}
        onCancelApplication={(appId) => apps.cancelById(appId)}
      />
    </div>
  );
}
