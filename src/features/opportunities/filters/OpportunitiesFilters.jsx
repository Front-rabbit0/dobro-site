import { Card } from "@/shared/ui/Card/Card";
import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";

export function OpportunitiesFilters({ values, onChange, onApply, onReset }) {
  return (
    <Card>
      <Card.Body>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onApply();
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 220px",
            gap: 12,
            alignItems: "end",
          }}
        >
          <Input
            label="Поиск"
            placeholder="По названию или описанию"
            value={values.q}
            onChange={(e) => onChange("q", e.target.value)}
          />

          <Input
            label="Город"
            placeholder="Например: Москва"
            value={values.city}
            onChange={(e) => onChange("city", e.target.value)}
          />

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", userSelect: "none" }}>
              <input
                type="checkbox"
                checked={values.activeOnly}
                onChange={(e) => onChange("activeOnly", e.target.checked)}
              />
              Только активные
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center", userSelect: "none" }}>
              <input
                type="checkbox"
                checked={values.myOnly}
                onChange={(e) => onChange("myOnly", e.target.checked)}
              />
              Мои отклики
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 14, color: "var(--muted)" }}>Сортировка</span>
              <select
                value={values.sort}
                onChange={(e) => onChange("sort", e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  background: "white",
                }}
              >
                <option value="relevance">По релевантности</option>
                <option value="title">По названию</option>
              </select>
            </label>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Button type="submit">Применить</Button>
            <Button type="button" variant="secondary" onClick={onReset}>
              Сбросить
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
}
