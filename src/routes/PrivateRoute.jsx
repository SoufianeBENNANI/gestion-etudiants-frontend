import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";

function PrivateRoute({ children, role }) {
  const { loading, isAuthenticated, hasRole, roles } = useAuth();

  console.log("ROLE DEMANDÉ:", role);
  console.log("ROLES USER:", roles);

  if (loading) return <h2>Chargement...</h2>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (!hasRole(role)) return <Navigate to="/" replace />;

  return children;
}

export default PrivateRoute;