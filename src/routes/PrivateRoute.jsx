import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";

function PrivateRoute({ children, role }) {
  const { hasRole, roles, loading, isAuthenticated } = useAuth();

  console.log("CHECK ROLE:", role, roles);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!hasRole(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default PrivateRoute;