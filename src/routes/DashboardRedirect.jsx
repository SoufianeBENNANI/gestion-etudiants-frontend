import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";

function DashboardRedirect() {
  const { roles } = useAuth();

  if (roles.includes("ADMIN")) return <Navigate to="/admin" replace />;
  if (roles.includes("MANAGER")) return <Navigate to="/manager" replace />;
  if (roles.includes("TEACHER")) return <Navigate to="/teacher" replace />;
  if (roles.includes("STUDENT")) return <Navigate to="/student" replace />;

  return <Navigate to="/unauthorized" />;
}

export default DashboardRedirect;