import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container } from "@/shared/ui/Container/Container";
import { Card } from "@/shared/ui/Card/Card";
import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { useAuth } from "@/entities/auth/model/useAuth";

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const from = useMemo(() => location.state?.from || "/cabinet", [location.state]);

  function onSubmit(e) {
    e.preventDefault();
    setError("");

    const res = login({ email, password });
    if (!res.ok) {
      setError(res.error || "Ошибка входа");
      return;
    }

    nav(from, { replace: true });
  }

  return (
    <Container style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ padding: "24px 0", display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Вход</h2>

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
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error ? (
                <div style={{ color: "var(--danger)", fontSize: 13, fontWeight: 700 }}>
                  {error}
                </div>
              ) : null}

              <Button type="submit" fullWidth>
                Войти
              </Button>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <Link to="/register">Регистрация</Link>
                <Link to="/forgot">Забыли пароль?</Link>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
