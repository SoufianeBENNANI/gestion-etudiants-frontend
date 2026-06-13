import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export const useAuth = () => {
  const { user, roles, keycloak, loading } = useContext(AuthContext);

  const normalizeRole = (role) => {
    if (!role) return "";

    return role
      .toString()
      .replace("ROLE_", "")
      .trim()
      .toUpperCase();
  };

  const hasRole = (role) => {
    const requiredRole = normalizeRole(role);

    return roles
      .map(normalizeRole)
      .includes(requiredRole);
  };

  return {
    user,
    roles,
    hasRole,
    keycloak,
    loading,
    isAuthenticated: !!keycloak?.authenticated,
  };
};