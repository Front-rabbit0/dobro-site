import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "@/shared/ui/Container/Container";
import { Card } from "@/shared/ui/Card/Card";
import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { useAuth } from "@/entities/auth/model/useAuth";

export function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setError("");

    const res = register({ email, password, role });
    if (!res.ok) {
      setError(res.error || "Ошибка регистрации");
      return;
    }

    nav("/cabinet", { replace: true });
  }

  return (
    <Container style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ padding: "24px 0", display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Регистрация</h2>

        <Card>
          <Card.Body>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
              <Input
                label="Email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Пароль"
                type="password"
                placeholder="Минимум 4 символа"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>Роль</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
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

              {error ? (
                <div style={{ color: "var(--danger)", fontSize: 13, fontWeight: 700 }}>
                  {error}
                </div>
              ) : null}

              <Button type="submit" fullWidth>
                Создать аккаунт
              </Button>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <Link to="/login">Уже есть аккаунт? Войти</Link>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
