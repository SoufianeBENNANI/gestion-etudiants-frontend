import { createContext, useState, useEffect } from "react";
import keycloak from "../keycloak/keycloak";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keycloak.authenticated) {
      setLoading(false);
      return;
    }

    const parsed = keycloak.tokenParsed;

    console.log("TOKEN:", parsed);

    if (!parsed) {
      setLoading(false);
      return;
    }

    setUser(parsed);

    // IMPORTANT : récupérer TOUS les rôles
    const clientRoles = Object.values(parsed?.resource_access || {})
      .flatMap(c => c.roles || []);

    const realmRoles = parsed?.realm_access?.roles || [];

    const allRoles = [...realmRoles, ...clientRoles];

    console.log("ALL ROLES:", allRoles);

    setRoles(allRoles);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, roles, keycloak, loading }}>
      {children}
    </AuthContext.Provider>
  );
}