import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div>
      <h1 style={{ margin: 0 }}>404</h1>
      <p style={{ marginTop: 12 }}>Страница не найдена.</p>
      <Link to="/">Вернуться на главную</Link>
    </div>
  );
}
