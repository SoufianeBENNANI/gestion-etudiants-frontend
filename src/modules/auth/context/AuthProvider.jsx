import { createContext, useState, useEffect } from "react";
import keycloak from "../keycloak/keycloak";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const saveKeycloakTokens = () => {
    if (keycloak?.token) {
      localStorage.setItem("token", keycloak.token);
      localStorage.setItem("accessToken", keycloak.token);
    }

    if (keycloak?.idToken) {
      localStorage.setItem("idToken", keycloak.idToken);
    }

    if (keycloak?.refreshToken) {
      localStorage.setItem("refreshToken", keycloak.refreshToken);
    }
  };

  useEffect(() => {
    const loadAuth = () => {
      try {
        if (!keycloak?.authenticated) {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("idToken");
          localStorage.removeItem("refreshToken");

          setUser(null);
          setRoles([]);
          setLoading(false);
          return;
        }

        saveKeycloakTokens();

        const parsed = keycloak.tokenParsed;

        console.log("TOKEN:", parsed);

        if (!parsed) {
          setUser(null);
          setRoles([]);
          setLoading(false);
          return;
        }

        setUser(parsed);

        const realmRoles = parsed?.realm_access?.roles || [];

        const clientRoles = Object.values(parsed?.resource_access || {}).flatMap(
          (client) => client?.roles || []
        );

        const allRoles = Array.from(new Set([...realmRoles, ...clientRoles]));

        console.log("ALL ROLES:", allRoles);

        setRoles(allRoles);
        setLoading(false);
      } catch (error) {
        console.error("Auth loading error:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("idToken");
        localStorage.removeItem("refreshToken");

        setUser(null);
        setRoles([]);
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        keycloak,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}