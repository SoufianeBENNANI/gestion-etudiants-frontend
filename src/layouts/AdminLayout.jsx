import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* CONTENT */}
      <main
        className={`min-h-screen bg-slate-100 px-8 py-6 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-72"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}