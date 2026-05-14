import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export const useAuth = () => {
  const { user, roles, keycloak } = useContext(AuthContext);

  const hasRole = (role) => roles.includes(role);

  return {
    user,
    roles,
    hasRole,
    keycloak,
  };
};