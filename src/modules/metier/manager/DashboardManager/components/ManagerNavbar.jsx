import { useState } from "react";

import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
} from "lucide-react";

export default function ManagerNavbar() {
  const [managerMenuOpen, setManagerMenuOpen] =
    useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const handleKeycloakLogout = () => {
    const keycloakUrl =
      "http://localhost:8081";

    const realm =
      "gestion_etudiant";

    const clientId =
      "gestion-etudiant-frontend";

    const postLogoutRedirectUri =
      "http://localhost:5173";

    const idToken =
      localStorage.getItem("idToken") ||
      localStorage.getItem("id_token") ||
      sessionStorage.getItem("idToken") ||
      sessionStorage.getItem("id_token");

    const logoutParams =
      new URLSearchParams();

    logoutParams.set(
      "client_id",
      clientId
    );

    logoutParams.set(
      "post_logout_redirect_uri",
      postLogoutRedirectUri
    );

    if (idToken) {
      logoutParams.set(
        "id_token_hint",
        idToken
      );
    }

    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("id_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("auth");

    sessionStorage.clear();

    window.location.href =
      `${keycloakUrl}/realms/${realm}` +
      `/protocol/openid-connect/logout?` +
      logoutParams.toString();
  };

  return (
    <header
      className="relative z-40 flex w-full flex-col gap-5 rounded-[1.7rem] border border-white/15 px-6 py-5 text-white shadow-lg lg:flex-row lg:items-center lg:justify-between"
      style={{
        background:
          "linear-gradient(135deg, #ea580c 0%, #c2410c 48%, #431407 100%)",
        boxShadow:
          "0 15px 30px rgba(234, 88, 12, 0.22)",
      }}
    >
      {/* TITLE */}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-orange-200">
          Hey, Manager 👋
        </p>

        <h1 className="mt-1 truncate text-2xl font-black text-white">
          Welcome to your Manager Dashboard
        </h1>

        <p className="mt-1 text-sm font-semibold text-orange-100">
          Dashboard
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* SEARCH */}
        <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-orange-100 sm:w-72"
          />

          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* NOTIFICATION */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setNotificationOpen(
                  (previous) => !previous
                )
              }
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-[999] w-80 overflow-hidden rounded-[1.2rem] border border-slate-200 bg-white text-slate-900 shadow-2xl">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h3 className="text-sm font-black">
                    Notifications
                  </h3>

                  <p className="text-xs font-semibold text-slate-500">
                    Aucune nouvelle notification
                  </p>
                </div>

                <div className="p-4 text-center text-sm text-slate-500">
                  Aucune notification
                </div>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setManagerMenuOpen(
                  (previous) => !previous
                )
              }
              className="flex h-11 min-w-[190px] items-center justify-between gap-3 rounded-full bg-white/10 px-4 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">
                  M
                </div>

                <div className="hidden min-w-0 text-left sm:block">
                  <p className="truncate text-sm font-black text-white">
                    Manager
                  </p>

                  <p className="truncate text-xs font-semibold text-orange-100">
                    Manager
                  </p>
                </div>
              </div>

              <ChevronDown
                className={`h-4 w-4 shrink-0 text-orange-100 transition ${
                  managerMenuOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {managerMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-[999] w-64 overflow-hidden rounded-[1.2rem] border border-slate-200 bg-white text-slate-900 shadow-2xl">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">
                      M
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black">
                        Manager
                      </p>

                      <p className="truncate text-xs font-semibold text-slate-500">
                        Manager account
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
    </header>
  );
}