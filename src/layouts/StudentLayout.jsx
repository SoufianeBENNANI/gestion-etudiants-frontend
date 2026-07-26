import { useState } from "react";
import {
  Outlet,
  useLocation,
} from "react-router-dom";

import StudentSidebar from "../modules/metier/student/StudentDashboard/components/StudentSidebar";
import StudentNavbar from "../modules/metier/student/StudentDashboard/components/StudentNavbar";

export default function StudentLayout() {
  const [collapsed, setCollapsed] =
    useState(false);

  const { pathname } =
    useLocation();

  /*
   * Navbar affiché seulement
   * sur le Dashboard principal.
   */
  const showNavbar =
    pathname === "/student" ||
    pathname === "/student/";

  return (
    <div
      className="
        flex
        min-h-screen
        transition-colors
        duration-300
      "
      style={{
        backgroundColor:
          "var(--app-bg)",
      }}
    >
      {/* SIDEBAR */}

      <StudentSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        <div className="p-4 lg:p-6">
          {/* NAVBAR uniquement Dashboard */}

          {showNavbar && (
            <StudentNavbar />
          )}

          {/* PAGE */}

          <main
            className={
              showNavbar
                ? "mt-5"
                : ""
            }
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}