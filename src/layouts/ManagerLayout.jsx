import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import ManagerSidebar from "../modules/metier/manager/DashboardManager/components/ManagerSidebar";
import ManagerNavbar from "../modules/metier/manager/DashboardManager/components/ManagerNavbar";

export default function ManagerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  const showNavbar =
    pathname === "/manager" ||
    pathname === "/manager/";

  useEffect(() => {
    const applyTheme = () => {
      const savedTheme =
        localStorage.getItem("themeMode") ||
        localStorage.getItem("app-theme") ||
        "Light";

      const normalizedTheme = savedTheme.toLowerCase();

      document.documentElement.setAttribute(
        "data-theme",
        normalizedTheme
      );

      document.body.style.backgroundColor = "var(--app-bg)";
      document.body.style.color = "var(--text-color)";
    };

    applyTheme();

    window.addEventListener(
      "app-theme-change",
      applyTheme
    );

    window.addEventListener(
      "storage",
      applyTheme
    );

    return () => {
      window.removeEventListener(
        "app-theme-change",
        applyTheme
      );

      window.removeEventListener(
        "storage",
        applyTheme
      );
    };
  }, []);

  const handlePageDoubleClick = (event) => {
    const interactiveElement = event.target.closest(`
      a,
      button,
      input,
      textarea,
      select,
      option,
      label,
      [role="button"]
    `);

    if (interactiveElement) {
      return;
    }

    setCollapsed((previous) => !previous);
  };

  return (
    <div
      className="flex min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
      dir="ltr"
    >
      <ManagerSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main
        onDoubleClick={handlePageDoubleClick}
        className="min-w-0 flex-1 overflow-y-auto p-6 transition-colors duration-200"
        style={{
          backgroundColor: "var(--app-bg)",
          color: "var(--text-color)",
        }}
      >
        {showNavbar && (
          <div className="mb-6">
            <ManagerNavbar />
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
}