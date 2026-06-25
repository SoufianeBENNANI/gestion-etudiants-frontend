import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardCheck,
  ClipboardList,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
} from "lucide-react";

const logo = "/images/LogoSchool.png";

export default function TeacherSidebar({ collapsed, setCollapsed }) {
  const { pathname } = useLocation();

  const [openMenus, setOpenMenus] = useState({
    academics: true,
    evaluation: false,
  });

  const activeStyle =
    "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30";

  const itemClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer ${
      pathname === path
        ? activeStyle
        : "text-white hover:bg-white/10 hover:text-violet-300"
    }`;

  const buttonClass = (isOpen) =>
    `w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
      isOpen
        ? activeStyle
        : "text-white hover:bg-white/10 hover:text-violet-300"
    }`;

  const subItemClass = (path) =>
    `flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
      pathname === path
        ? "bg-white/10 text-white font-semibold"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      academics: menu === "academics" ? !prev.academics : false,
      evaluation: menu === "evaluation" ? !prev.evaluation : false,
    }));
  };

  return (
    <div
      className={`flex h-screen flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
     style={{
  background: "linear-gradient(180deg, #312e81, #4c1d95)",
  color: "white",
}}
    >
      <div className="flex items-center justify-between p-5">
        {!collapsed && (
          <img src={logo} alt="logo" className="w-44 object-contain" />
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-xl p-2 transition hover:bg-white/10"
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-3">
        <Link to="/teacher" className={itemClass("/teacher")}>
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        <div>
          <button
            type="button"
            onClick={() => toggleMenu("academics")}
            className={buttonClass(openMenus.academics)}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={20} />
              {!collapsed && <span>Academics</span>}
            </div>

            {!collapsed &&
              (openMenus.academics ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              ))}
          </button>

          {openMenus.academics && !collapsed && (
            <div className="ml-6 mt-3 space-y-2 border-l border-white/10 pl-4">
              <Link to="/teacher/courses" className={subItemClass("/teacher/courses")}>
                <BookOpen size={18} />
                <span>My Courses</span>
              </Link>

              <Link to="/teacher/students" className={subItemClass("/teacher/students")}>
                <Users size={18} />
                <span>My Students</span>
              </Link>

              <Link to="/teacher/attendance" className={subItemClass("/teacher/attendance")}>
                <ClipboardCheck size={18} />
                <span>Attendance</span>
              </Link>
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => toggleMenu("evaluation")}
            className={buttonClass(openMenus.evaluation)}
          >
            <div className="flex items-center gap-3">
              <ClipboardList size={20} />
              {!collapsed && <span>Evaluation</span>}
            </div>

            {!collapsed &&
              (openMenus.evaluation ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              ))}
          </button>

          {openMenus.evaluation && !collapsed && (
            <div className="ml-6 mt-3 space-y-2 border-l border-white/10 pl-4">
              <Link to="/teacher/grades" className={subItemClass("/teacher/grades")}>
                <ClipboardList size={18} />
                <span>Grades</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <Link to="/teacher/settings" className={itemClass("/teacher/settings")}>
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </div>
  );
}