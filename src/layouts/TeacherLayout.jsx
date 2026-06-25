import { useState } from "react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "../modules/metier/teacher/DashboardTeacher/components/TeacherSidebar";
import TeacherNavbar from "../modules/metier/teacher/DashboardTeacher/components/TeacherNavbar";

function TeacherLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-violet-50/40">
      <TeacherSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex min-h-screen flex-1 flex-col">
        <TeacherNavbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;