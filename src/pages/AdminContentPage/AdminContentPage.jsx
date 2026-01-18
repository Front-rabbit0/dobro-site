import { useEffect, useState } from "react";
import { Card } from "@/shared/ui/Card/Card";
import { Button } from "@/shared/ui/Button/Button";
import { Badge } from "@/shared/ui/Badge/Badge";
import { AdminNav } from "@/widgets/admin/AdminNav/AdminNav";
import { useContent } from "@/entities/content/model/useContent";

const PAGES = [
  { key: "about", label: "О проекте" },
  { key: "mission", label: "Миссия и цели" },
  { key: "contacts", label: "Контакты" },
];

export function AdminContentPage() {
  const { content, setPage } = useContent();
  const [current, setCurrent] = useState("about");
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(content?.[current] ?? "");
  }, [content, current]);

  function onSave() {
    setPage(current, value);
    alert("Сохранено");
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <AdminNav />

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Админ: контент</h2>
        <Badge variant="primary">MVP</Badge>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {PAGES.map((p) => (
          <Button
            key={p.key}
            variant={current === p.key ? "primary" : "secondary"}
            size="sm"
            onClick={() => setCurrent(p.key)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <Card>
        <Card.Body>
          <textarea
            rows={10}
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
        </Card.Body>
      </Card>

      <Button onClick={onSave}>Сохранить</Button>

      <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
        Контент сохраняется в localStorage (<b>mvp.content</b>) и используется на главной странице.
      </p>
    </div>
  );
}
