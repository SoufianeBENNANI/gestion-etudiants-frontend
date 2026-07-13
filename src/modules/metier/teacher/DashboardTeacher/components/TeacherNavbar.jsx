import { useState } from "react";
import { Search, LogOut, ChevronDown } from "lucide-react";

export default function TeacherNavbar() {
  const [teacherMenuOpen, setTeacherMenuOpen] = useState(false);

  const handleKeycloakLogout = () => {
    const keycloakUrl = "http://localhost:8081";
    const realm = "gestion_etudiant";
    const clientId = "gestion-etudiant-frontend";
    const postLogoutRedirectUri = "http://localhost:5173";

    const idToken =
      localStorage.getItem("idToken") ||
      localStorage.getItem("id_token") ||
      sessionStorage.getItem("idToken") ||
      sessionStorage.getItem("id_token");

    const logoutParams = new URLSearchParams();
    logoutParams.set("client_id", clientId);
    logoutParams.set("post_logout_redirect_uri", postLogoutRedirectUri);

    if (idToken) logoutParams.set("id_token_hint", idToken);

    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("id_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("auth");
    sessionStorage.clear();

    window.location.href = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout?${logoutParams.toString()}`;
  };
}