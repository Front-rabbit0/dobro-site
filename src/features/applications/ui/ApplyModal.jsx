import { useMemo, useState } from "react";
import { Modal } from "@/shared/ui/Modal/Modal";
import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { Card } from "@/shared/ui/Card/Card";

export function ApplyModal({ open, projectTitle, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const errors = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = "Введите имя";
    if (!email.trim()) e.email = "Введите email";
    if (email && !email.includes("@")) e.email = "Похоже, email введён неверно";
    return e;
  }, [name, email]);

  const canSubmit = Object.keys(errors).length === 0;

  return (
    <Modal
      open={open}
      title="Отклик на проект"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button
            onClick={() => {
              if (!canSubmit) return;
              onSubmit({ name: name.trim(), email: email.trim(), message: message.trim() });
              onClose?.();
              // очищаем форму после отправки (чтобы повторно не было старых данных)
              setName("");
              setEmail("");
              setMessage("");
            }}
            disabled={!canSubmit}
          >
            Отправить заявку
          </Button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 12 }}>
        <p>
          Вы отправляете заявку на проект: <strong>{projectTitle}</strong>
        </p>

        <Card>
          <Card.Body>
            <div style={{ display: "grid", gap: 12 }}>
              <Input label="ФИО" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
              <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                  Сообщение (необязательно)
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Коротко расскажите, почему хотите участвовать"
                  rows={4}
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
            </div>
          </Card.Body>
        </Card>

        <p style={{ fontSize: 12, color: "var(--muted)" }}>
          В MVP данные сохраняются локально. Позже это уйдёт на сервер и появятся уведомления.
        </p>
      </div>
    </Modal>
  );
}
