import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";

function Unauthorized() {
  const { loading, hasRole } = useAuth();

  if (loading) return <h2>Chargement...</h2>;

  if (hasRole("ADMIN")) return <Navigate to="/admin" replace />;
  if (hasRole("MANAGER")) return <Navigate to="/manager" replace />;
  if (hasRole("TEACHER")) return <Navigate to="/teacher" replace />;
  if (hasRole("STUDENT")) return <Navigate to="/student" replace />;

  return <h1>Accès refusé</h1>;
}

export default Unauthorized;