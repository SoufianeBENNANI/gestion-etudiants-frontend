import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  DollarSign,
  Settings,
  GraduationCap,
  ClipboardList,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  BarChart3,
  Brain,
  Building2,
  Cpu,
  ScrollText,
} from "lucide-react";

import logo from "../assets/LogoSchool.png";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { pathname } = useLocation();

  const [openMenus, setOpenMenus] = useState({
    academics: true,
    students: true,
    evaluation: false,
    finance: false,
    ai: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const activeStyle =
    "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30";

  const itemClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer
    ${
      pathname === path
        ? activeStyle
        : "text-white hover:bg-white/10 hover:text-cyan-300"
    }`;

  const buttonClass = (isOpen) =>
    `w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300
    ${
      isOpen
        ? activeStyle
        : "text-white hover:bg-white/10 hover:text-cyan-300"
    }`;

  const studentsButtonClass =
    "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-white hover:bg-white/10 hover:text-cyan-300 transition-all duration-300";

  const studentSubItemClass = (path) =>
    `flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all duration-300
    ${
      pathname === path
        ? "bg-white/10 text-white font-semibold"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  const aiSubItemClass = (path) =>
    `flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all duration-300
    ${
      pathname === path
        ? "bg-white/10 text-white font-semibold"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div
      className={`h-screen bg-[#081028] text-white transition-all duration-300 flex flex-col
      ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-5">
        {!collapsed && (
          <img src={logo} alt="logo" className="w-44 object-contain" />
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl hover:bg-white/10 transition"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {/* DASHBOARD */}
        <Link to="/admin" className={itemClass("/admin")}>
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        {/* ACADEMICS */}
        <div>
          <button
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
              {/* STUDENTS MENU */}
              <button
                onClick={() => toggleMenu("students")}
                className={studentsButtonClass}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <span>Students</span>
                </div>

                {openMenus.students ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {/* STUDENTS SUB MENU */}
              {openMenus.students && (
                <div className="ml-5 mt-2 space-y-1">
                  <Link
                    to="/admin/students"
                    className={studentSubItemClass("/admin/students")}
                  >
                    <LayoutDashboard size={17} />
                    <span>Overview</span>
                  </Link>

                  <Link
                    to="/admin/students/all"
                    className={studentSubItemClass("/admin/students/all")}
                  >
                    <Users size={17} />
                    <span>All Students</span>
                  </Link>

                  <Link
                    to="/admin/students/performance"
                    className={studentSubItemClass(
                      "/admin/students/performance"
                    )}
                  >
                    <BarChart3 size={17} />
                    <span>Performance</span>
                  </Link>

                  <Link
                    to="/admin/students/attendance"
                    className={studentSubItemClass(
                      "/admin/students/attendance"
                    )}
                  >
                    <Bell size={17} />
                    <span>Attendance</span>
                  </Link>

                  <Link
                    to="/admin/students/predictions"
                    className={studentSubItemClass(
                      "/admin/students/predictions"
                    )}
                  >
                    <Brain size={17} />
                    <span>AI Predictions</span>
                  </Link>
                </div>
              )}

              <Link to="/admin/classes" className={itemClass("/admin/classes")}>
                <Layers size={18} />
                {!collapsed && <span>Classes</span>}
              </Link>

              <Link to="/admin/courses" className={itemClass("/admin/courses")}>
                <BookOpen size={18} />
                {!collapsed && <span>Courses</span>}
              </Link>

              <Link
                to="/admin/departments"
                className={itemClass("/admin/departments")}
              >
                <Building2 size={18} />
                {!collapsed && <span>Departments</span>}
              </Link>

              <Link
                to="/admin/teachers"
                className={itemClass("/admin/teachers")}
              >
                <GraduationCap size={18} />
                {!collapsed && <span>Teachers</span>}
              </Link>
            </div>
          )}
        </div>

        {/* AI */}
        <div>
          <button
            onClick={() => toggleMenu("ai")}
            className={buttonClass(openMenus.ai)}
          >
            <div className="flex items-center gap-3">
              <Brain size={20} />
              {!collapsed && <span>AI</span>}
            </div>

            {!collapsed &&
              (openMenus.ai ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              ))}
          </button>

          {openMenus.ai && !collapsed && (
            <div className="ml-6 mt-3 space-y-2 border-l border-white/10 pl-4">
              <Link
                to="/admin/ai/models"
                className={aiSubItemClass("/admin/ai/models")}
              >
                <Cpu size={17} />
                <span>Models</span>
              </Link>

              <Link
                to="/admin/ai/logs"
                className={aiSubItemClass("/admin/ai/logs")}
              >
                <ScrollText size={17} />
                <span>Logs</span>
              </Link>
            </div>
          )}
        </div>

        {/* EVALUATION */}
        <div>
          <button
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
            <div className="ml-6 mt-3 space-y-3 pl-4">
              <Link to="/admin/grades" className={itemClass("/admin/grades")}>
                <ClipboardList size={18} />
                {!collapsed && <span>Grades</span>}
              </Link>
            </div>
          )}
        </div>

        {/* FINANCE */}
        <div>
          <button
            onClick={() => toggleMenu("finance")}
            className={buttonClass(openMenus.finance)}
          >
            <div className="flex items-center gap-3">
              <DollarSign size={20} />
              {!collapsed && <span>Finance</span>}
            </div>

            {!collapsed &&
              (openMenus.finance ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              ))}
          </button>

          {openMenus.finance && !collapsed && (
            <div className="ml-6 mt-3 space-y-3 pl-4">
              <Link
                to="/admin/payments"
                className={itemClass("/admin/payments")}
              >
                <DollarSign size={18} />
                {!collapsed && <span>Payments</span>}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-3">
        <Link to="/admin/settings" className={itemClass("/admin/settings")}>
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </div>
  );
}