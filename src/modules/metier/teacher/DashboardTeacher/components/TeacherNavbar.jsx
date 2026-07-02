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

  return (
    <div
      className="relative z-40 rounded-[1.7rem] border px-6 py-5 text-white shadow-sm"
      style={{
        borderColor: "var(--border-color)",
        background: "linear-gradient(135deg, #6d28d9, #020617)",
      }}
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold text-violet-200">
            Hey, Teacher 👋
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">
            Welcome to your Dashboard
          </h2>

          <p className="mt-1 text-sm font-semibold text-slate-300">
            Manage courses, students, attendance and grades
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
            <input
              placeholder="Search"
              className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-300 sm:w-72"
            />

            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setTeacherMenuOpen((prev) => !prev)}
              className="flex h-12 min-w-[190px] items-center justify-between gap-3 rounded-full bg-white/10 px-3 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-black text-white">
                  T
                </div>

                <div className="hidden min-w-0 text-left sm:block">
                  <p className="truncate text-sm font-black text-white">
                    Teacher
                  </p>

                  <p className="truncate text-[11px] font-semibold text-slate-300">
                    Teacher account
                  </p>
                </div>
              </div>

              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-300 transition ${
                  teacherMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {teacherMenuOpen && (
              <div
                className="absolute right-0 top-[calc(100%+0.75rem)] z-[999] w-64 overflow-hidden rounded-[1.2rem] border bg-white shadow-2xl"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)",
                }}
              >
                <div
                  className="border-b px-5 py-4"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-sm font-black text-white">
                      T
                    </div>

                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-black"
                        style={{ color: "var(--text-color)" }}
                      >
                        Teacher
                      </p>

                      <p
                        className="truncate text-xs font-semibold"
                        style={{ color: "var(--muted-text)" }}
                      >
                        Teacher account
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleKeycloakLogout}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-black text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}