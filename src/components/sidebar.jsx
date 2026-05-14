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
  Plus,
  BarChart3,
  Brain
} from "lucide-react";

import logo from "../assets/LogoSchool.png";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { pathname } = useLocation();

  const [studentsPopup, setStudentsPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const [openMenus, setOpenMenus] = useState({
    academics: true,
    evaluation: false,
    finance: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus({
      ...openMenus,
      [menu]: !openMenus[menu]
    });
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

  const openStudentsMenu = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setPopupPosition({
      top: rect.top,
      left: rect.right + 14
    });

    setStudentsPopup(true);
  };

  return (
    <>
      <div
        className={`h-screen bg-[#081028] text-white transition-all duration-300 flex flex-col
        ${collapsed ? "w-20" : "w-72"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5">
          {!collapsed && (
            <img
              src={logo}
              alt="logo"
              className="w-44 object-contain"
            />
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
          <Link to="/" className={itemClass("/")}>
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
              <div className="ml-6 mt-3 space-y-3 pl-4">
                {/* STUDENTS FLOATING BUTTON */}
                <button
                  onClick={openStudentsMenu}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-white hover:bg-white/10 hover:text-cyan-300 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Users size={18} />
                    <span>Students</span>
                  </div>

                  <ChevronRight size={16} />
                </button>

                <Link to="/classes" className={itemClass("/classes")}>
                  <Layers size={18} />
                  Classes
                </Link>

                <Link to="/courses" className={itemClass("/courses")}>
                  <BookOpen size={18} />
                  Courses
                </Link>

                <Link to="/teachers" className={itemClass("/teachers")}>
                  <GraduationCap size={18} />
                  Teachers
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
                <Link to="/grades" className={itemClass("/grades")}>
                  <ClipboardList size={18} />
                  Grades
                </Link>

                <Link to="/attendance" className={itemClass("/attendance")}>
                  <Bell size={18} />
                  Attendance
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
                <Link to="/payments" className={itemClass("/payments")}>
                  <DollarSign size={18} />
                  Payments
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3">
          <Link to="/settings" className={itemClass("/settings")}>
            <Settings size={20} />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>
      </div>

      {/* FLOATING STUDENTS MENU */}
      {studentsPopup && !collapsed && (
        <div
          className="fixed z-[9999]"
          style={{
            top: popupPosition.top,
            left: popupPosition.left
          }}
          onMouseLeave={() => setStudentsPopup(false)}
        >
          <div className="w-72 rounded-3xl bg-[#0B1739]/95 backdrop-blur-2xl border border-cyan-500/20 p-4 shadow-2xl shadow-cyan-500/30 space-y-2">
            <Link to="/students" className={itemClass("/students")}>
              <LayoutDashboard size={17} />
              Overview
            </Link>

            <Link to="/students/all" className={itemClass("/students/all")}>
              <Users size={17} />
              All Students
            </Link>

            <Link to="/students/add" className={itemClass("/students/add")}>
              <Plus size={17} />
              Add Student
            </Link>

            <Link
              to="/students/performance"
              className={itemClass("/students/performance")}
            >
              <BarChart3 size={17} />
              Performance
            </Link>

            <Link
              to="/students/attendance"
              className={itemClass("/students/attendance")}
            >
              <Bell size={17} />
              Attendance
            </Link>

            <Link
              to="/students/predictions"
              className={itemClass("/students/predictions")}
            >
              <Brain size={17} />
              AI Predictions
            </Link>
          </div>
        </div>
      )}
    </>
  );
}