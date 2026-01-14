import { useMemo, useState } from "react";
import { useProfile } from "@/entities/user/model/useProfile";
import { Card } from "@/shared/ui/Card/Card";
import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { Badge } from "@/shared/ui/Badge/Badge";

function roleLabel(role) {
  if (role === "curator") return "Куратор";
  if (role === "org") return "Организация";
  return "Студент";
}

export function Profile() {
  const { profile, setField, setSkillsFromText, update, reset } = useProfile();

  // для textarea со скиллами удобно держать текстом
  const [skillsText, setSkillsText] = useState(profile.skills.join(", "));

  const errors = useMemo(() => {
    const e = {};
    if (profile.email && !profile.email.includes("@")) e.email = "Похоже, email введён неверно";
    return e;
  }, [profile.email]);

  async function onPickPhoto(file) {
    if (!file) return;

    // ограничим размер, чтобы localStorage не умер
    if (file.size > 2 * 1024 * 1024) {
      alert("Файл слишком большой. Выбери фото до 2MB.");
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    update({ photoDataUrl: dataUrl });
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card>
        <Card.Body>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div style={{ display: "grid", gap: 10 }}>
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 18,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                }}
              >
                {profile.photoDataUrl ? (
                  <img
                    src={profile.photoDataUrl}
                    alt="Фото профиля"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  "Фото"
                )}
              </div>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                  Загрузить фото
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickPhoto(e.target.files?.[0])}
                />
              </label>

              {profile.photoDataUrl ? (
                <Button variant="secondary" onClick={() => update({ photoDataUrl: "" })}>
                  Удалить фото
                </Button>
              ) : null}
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <strong style={{ fontSize: 16 }}>Профиль</strong>
                <Badge variant="primary">{roleLabel(profile.role)}</Badge>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 12,
                }}
              >
                <Input
                  label="ФИО"
                  placeholder="Иванов Иван Иванович"
                  value={profile.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                />

                <Input
                  label="Email"
                  placeholder="name@example.com"
                  value={profile.email}
                  onChange={(e) => setField("email", e.target.value)}
                  error={errors.email}
                />

                <Input
                  label="Телефон"
                  placeholder="+7 ..."
                  value={profile.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />

                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                    Роль
                  </span>
                  <select
                    value={profile.role}
                    onChange={(e) => setField("role", e.target.value)}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: "11px 12px",
                      background: "var(--surface)",
                    }}
                  >
                    <option value="student">Студент</option>
                    <option value="curator">Куратор</option>
                    <option value="org">Организация</option>
                  </select>
                </label>
              </div>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                  О себе
                </span>
                <textarea
                  rows={5}
                  value={profile.about}
                  onChange={(e) => setField("about", e.target.value)}
                  placeholder="Коротко расскажите о себе, опыте и интересах"
                  style={{
                    width: "100%",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "11px 12px",
                    background: "var(--surface)",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                  Компетенции (через запятую)
                </span>
                <Input
                  placeholder="React, Figma, SMM, Аналитика..."
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                />

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Button
                    variant="secondary"
                    onClick={() => setSkillsFromText(skillsText)}
                  >
                    Сохранить компетенции
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSkillsText("");
                      update({ skills: [] });
                    }}
                  >
                    Очистить
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      reset();
                      setSkillsText("");
                    }}
                  >
                    Сброс профиля
                  </Button>
                </div>

                {profile.skills.length ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {profile.skills.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 12 }}>Пока нет компетенций</p>
                )}
              </label>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
