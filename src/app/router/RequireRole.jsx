import { Navigate } from "react-router-dom";
import { useAuth } from "@/entities/auth/model/useAuth";

export function RequireRole({ allow = [], children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allow.includes(role)) return <Navigate to="/cabinet" replace />;

  return children;
}
