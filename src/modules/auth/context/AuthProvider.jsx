import { createContext, useEffect, useState } from "react";
import keycloak from "../keycloak/keycloak";

export const AuthContext = createContext(null);

const normalizeRole = (role) =>
  String(role || "").replace("ROLE_", "").trim().toUpperCase();

const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("idToken");
  localStorage.removeItem("refreshToken");
};

const saveTokens = () => {
  if (keycloak.token) {
    localStorage.setItem("token", keycloak.token);
    localStorage.setItem("accessToken", keycloak.token);
  }

  if (keycloak.idToken) localStorage.setItem("idToken", keycloak.idToken);
  if (keycloak.refreshToken) localStorage.setItem("refreshToken", keycloak.refreshToken);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (!keycloak?.authenticated) {
        clearTokens();
        setUser(null);
        setRoles([]);
        setLoading(false);
        return;
      }

      saveTokens();

      const parsed = keycloak.tokenParsed;

      const realmRoles = parsed?.realm_access?.roles || [];
      const clientRoles = parsed?.resource_access?.spring_boot_app?.roles || [];

      const allRoles = Array.from(
        new Set([...realmRoles, ...clientRoles].map(normalizeRole))
      );

      console.log("TOKEN:", parsed);
      console.log("ROLES:", allRoles);

      setUser(parsed);
      setRoles(allRoles);
    } catch (error) {
      console.error("Auth loading error:", error);
      clearTokens();
      setUser(null);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const hasRole = (role) => roles.includes(normalizeRole(role));

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        loading,
        keycloak,
        isAuthenticated: Boolean(keycloak?.authenticated),
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}