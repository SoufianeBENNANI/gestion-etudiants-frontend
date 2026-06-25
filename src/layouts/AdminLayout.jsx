import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../modules/metier/admin/DashboardAdmin/components/sidebar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const applyTheme = () => {
      const savedTheme =
        localStorage.getItem("themeMode") ||
        localStorage.getItem("app-theme") ||
        "Light";

      const normalizedTheme = savedTheme.toLowerCase();

      document.documentElement.setAttribute("data-theme", normalizedTheme);
      document.body.style.backgroundColor = "var(--app-bg)";
      document.body.style.color = "var(--text-color)";
    };

    applyTheme();

    window.addEventListener("app-theme-change", applyTheme);
    window.addEventListener("storage", applyTheme);

    return () => {
      window.removeEventListener("app-theme-change", applyTheme);
      window.removeEventListener("storage", applyTheme);
    };
  }, []);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
    >
      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>

      {/* CONTENT */}
      <main
        onDoubleClick={() => setCollapsed((prev) => !prev)}
        className={`min-h-screen px-8 py-6 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-72"
        }`}
        style={{
          backgroundColor: "var(--app-bg)",
          color: "var(--text-color)",
          cursor: "default",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}