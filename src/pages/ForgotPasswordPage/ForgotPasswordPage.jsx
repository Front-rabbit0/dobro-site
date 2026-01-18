import { useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/shared/ui/Container/Container";
import { Card } from "@/shared/ui/Card/Card";
import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { useAuth } from "@/entities/auth/model/useAuth";

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setError("");

    const res = requestPasswordReset(email);
    if (!res.ok) {
      setError(res.error || "Ошибка");
      return;
    }

    setSent(true);
  }

  return (
    <Container style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ padding: "24px 0", display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Восстановление пароля</h2>

        <Card>
          <Card.Body>
            {sent ? (
              <div style={{ display: "grid", gap: 10 }}>
                <strong>Если аккаунт существует — письмо отправлено.</strong>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Это MVP без бэка: мы просто показываем успешный результат.
                </div>
                <Link to="/login">
                  <Button variant="secondary">Вернуться ко входу</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
                <Input
                  label="Email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {error ? (
                  <div style={{ color: "var(--danger)", fontSize: 13, fontWeight: 700 }}>
                    {error}
                  </div>
                ) : null}

                <Button type="submit" fullWidth>
                  Отправить ссылку
                </Button>

                <Link to="/login">Назад</Link>
              </form>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
