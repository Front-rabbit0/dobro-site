import { useMemo, useState } from "react";
import { Card } from "@/shared/ui/Card/Card";
import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { createProjectDto } from "@/entities/project/model/createProjectDto";
import { MultiSelect } from "@/shared/ui/MultiSelect/MultiSelect";


const DIRECTIONS = [
  "Экология",
  "Медицина",
  "Образование",
  "IT и цифровые проекты",
  "Социальные проекты",
  "Медиа и коммуникации",
  "Культура и события",
  "Урбанистика",
  "Наука и исследования",
  "Спорт",
  "Право и помощь",
];

const DIRECTION_OPTIONS = DIRECTIONS.map((d) => ({ value: d, label: d }));

export function CreateProjectForm({ onCreate, onCancel }) {
  const [p, setP] = useState(() => createProjectDto());

  const errors = useMemo(() => {
    const e = {};
    if (!p.title.trim()) e.title = "Введите название";
    if (!p.description.trim()) e.description = "Введите описание";
    if (!p.city.trim()) e.city = "Введите город";
    return e;
  }, [p.title, p.description, p.city]);

  const canSubmit = Object.keys(errors).length === 0;

  function setField(name, value) {
    setP((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <Card>
      <Card.Body>
        <div style={{ display: "grid", gap: 14 }}>
          <strong style={{ fontSize: 16 }}>Создание проекта</strong>

          {/* Верхние основные поля */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            <Input
              label="Название проекта"
              value={p.title}
              onChange={(e) => setField("title", e.target.value)}
              error={errors.title}
            />

            <Input
              label="Город"
              value={p.city}
              onChange={(e) => setField("city", e.target.value)}
              error={errors.city}
            />

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                Статус
              </span>
              <select
                value={p.status}
                onChange={(e) => setField("status", e.target.value)}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "11px 12px",
                  background: "var(--surface)",
                }}
              >
                <option value="active">Активный</option>
                <option value="in_progress">В процессе</option>
                <option value="finished">Завершён</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                Дата начала
              </span>
              <input
                type="date"
                value={p.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "11px 12px",
                  background: "var(--surface)",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                Дата окончания
              </span>
              <input
                type="date"
                value={p.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "11px 12px",
                  background: "var(--surface)",
                }}
              />
            </label>

            {/* Направления как мультивыбор */}
              <MultiSelect
                label="Направления (можно несколько)"
                placeholder="Выберите направления"
                options={DIRECTION_OPTIONS}
                value={p.directions}
                onChange={(next) => setField("directions", next)}
              />
          </div>

          {/* Описание */}
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
              Описание
            </span>
            <textarea
              rows={4}
              value={p.description}
              onChange={(e) => setField("description", e.target.value)}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "11px 12px",
                background: "var(--surface)",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
            {errors.description ? (
              <div style={{ color: "var(--danger)", fontSize: 12 }}>
                {errors.description}
              </div>
            ) : null}
          </label>

          {/* Цели */}
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
              Цели
            </span>
            <textarea
              rows={3}
              value={p.goals}
              onChange={(e) => setField("goals", e.target.value)}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "11px 12px",
                background: "var(--surface)",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </label>

          {/* Задачи */}
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
              Задачи для студентов
            </span>
            <textarea
              rows={3}
              value={p.tasks}
              onChange={(e) => setField("tasks", e.target.value)}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "11px 12px",
                background: "var(--surface)",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </label>

          {/* Нижние поля */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            <Input
              label="Требуемые навыки (текстом)"
              value={p.requiredSkills}
              onChange={(e) => setField("requiredSkills", e.target.value)}
              placeholder="Напр. React, дизайн, аналитика..."
            />

            <Input
              label="Куратор"
              value={p.curatorName}
              onChange={(e) => setField("curatorName", e.target.value)}
              placeholder="ФИО куратора"
            />

            <Input
              label="Контакты"
              value={p.contacts}
              onChange={(e) => setField("contacts", e.target.value)}
              placeholder="Email / телефон / ссылка"
            />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Отмена
            </Button>
            <Button
              onClick={() => {
                if (!canSubmit) return;
                onCreate?.(p);
                setP(createProjectDto());
              }}
              disabled={!canSubmit}
            >
              Создать проект
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
