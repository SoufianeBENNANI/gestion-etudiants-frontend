import { useEffect, useState } from "react";
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

const logo = "/images/LogoSchool.png";

const translations = {
  EN: {
    dashboard: "Dashboard",

    academics: "Academics",
    students: "Students",
    overview: "Overview",
    allStudents: "All Students",
    performance: "Performance",
    attendance: "Attendance",
    aiPredictions: "AI Predictions",

    classes: "Classes",
    courses: "Courses",
    departments: "Departments",
    teachers: "Teachers",

    ai: "AI",
    models: "Models",
    logs: "Logs",

    evaluation: "Evaluation",
    grades: "Grades",

    finance: "Finance",
    payments: "Payments",

    settings: "Settings",
  },

  FR: {
    dashboard: "Tableau de bord",

    academics: "Académique",
    students: "Étudiants",
    overview: "Vue d’ensemble",
    allStudents: "Tous les étudiants",
    performance: "Performance",
    attendance: "Présence",
    aiPredictions: "Prédictions IA",

    classes: "Classes",
    courses: "Cours",
    departments: "Départements",
    teachers: "Professeurs",

    ai: "IA",
    models: "Modèles",
    logs: "Journaux",

    evaluation: "Évaluation",
    grades: "Notes",

    finance: "Finance",
    payments: "Paiements",

    settings: "Paramètres",
  },

  AR: {
    dashboard: "لوحة التحكم",

    academics: "الأكاديمي",
    students: "الطلاب",
    overview: "نظرة عامة",
    allStudents: "كل الطلاب",
    performance: "الأداء",
    attendance: "الحضور",
    aiPredictions: "توقعات الذكاء الاصطناعي",

    classes: "الأقسام",
    courses: "الدورات",
    departments: "الشعب",
    teachers: "الأساتذة",

    ai: "الذكاء الاصطناعي",
    models: "النماذج",
    logs: "السجلات",

    evaluation: "التقييم",
    grades: "النقاط",

    finance: "المالية",
    payments: "المدفوعات",

    settings: "الإعدادات",
  },
};

export default function Sidebar({ collapsed, setCollapsed }) {
  const { pathname } = useLocation();

  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [openMenus, setOpenMenus] = useState({
    academics: false,
    students: false,
    evaluation: false,
    finance: false,
    ai: false,
  });

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const nextLanguage =
        event.detail || localStorage.getItem("app-language") || "EN";

      setLanguage(nextLanguage);
    };

    window.addEventListener("app-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener("app-language-change", handleLanguageChange);
    };
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => {
      const isAlreadyOpen = prev[menu];

      if (menu === "students") {
        return {
          academics: true,
          students: !isAlreadyOpen,
          evaluation: false,
          finance: false,
          ai: false,
        };
      }

      return {
        academics: menu === "academics" ? !isAlreadyOpen : false,
        students: false,
        evaluation: menu === "evaluation" ? !isAlreadyOpen : false,
        finance: menu === "finance" ? !isAlreadyOpen : false,
        ai: menu === "ai" ? !isAlreadyOpen : false,
      };
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

  const studentsButtonClass = (isOpen) =>
    `w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300
    ${
      isOpen
        ? "bg-white/10 text-white font-semibold"
        : "text-white hover:bg-white/10 hover:text-cyan-300"
    }`;

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
      className={`flex h-screen flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
      style={{
        backgroundColor: "var(--sidebar-bg)",
        color: "var(--sidebar-text)",
      }}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      {/* HEADER */}
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

      {/* MENU */}
      <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-3">
        {/* DASHBOARD */}
        <Link to="/admin" className={itemClass("/admin")}>
          <LayoutDashboard size={20} />
          {!collapsed && <span>{t.dashboard}</span>}
        </Link>

        {/* ACADEMICS */}
        <div>
          <button
            type="button"
            onClick={() => toggleMenu("academics")}
            className={buttonClass(openMenus.academics)}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={20} />
              {!collapsed && <span>{t.academics}</span>}
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
                type="button"
                onClick={() => toggleMenu("students")}
                className={studentsButtonClass(openMenus.students)}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <span>{t.students}</span>
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
                    <span>{t.overview}</span>
                  </Link>

                  <Link
                    to="/admin/students/all"
                    className={studentSubItemClass("/admin/students/all")}
                  >
                    <Users size={17} />
                    <span>{t.allStudents}</span>
                  </Link>

                  <Link
                    to="/admin/students/performance"
                    className={studentSubItemClass(
                      "/admin/students/performance"
                    )}
                  >
                    <BarChart3 size={17} />
                    <span>{t.performance}</span>
                  </Link>

                  <Link
                    to="/admin/students/attendance"
                    className={studentSubItemClass(
                      "/admin/students/attendance"
                    )}
                  >
                    <Bell size={17} />
                    <span>{t.attendance}</span>
                  </Link>

                  <Link
                    to="/admin/students/predictions"
                    className={studentSubItemClass(
                      "/admin/students/predictions"
                    )}
                  >
                    <Brain size={17} />
                    <span>{t.aiPredictions}</span>
                  </Link>
                </div>
              )}

              <Link to="/admin/classes" className={itemClass("/admin/classes")}>
                <Layers size={18} />
                {!collapsed && <span>{t.classes}</span>}
              </Link>

              <Link to="/admin/courses" className={itemClass("/admin/courses")}>
                <BookOpen size={18} />
                {!collapsed && <span>{t.courses}</span>}
              </Link>

              <Link
                to="/admin/departments"
                className={itemClass("/admin/departments")}
              >
                <Building2 size={18} />
                {!collapsed && <span>{t.departments}</span>}
              </Link>

              <Link
                to="/admin/teachers"
                className={itemClass("/admin/teachers")}
              >
                <GraduationCap size={18} />
                {!collapsed && <span>{t.teachers}</span>}
              </Link>
            </div>
          )}
        </div>

        {/* AI */}
        <div>
          <button
            type="button"
            onClick={() => toggleMenu("ai")}
            className={buttonClass(openMenus.ai)}
          >
            <div className="flex items-center gap-3">
              <Brain size={20} />
              {!collapsed && <span>{t.ai}</span>}
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
                to="/admin/AImodels"
                className={aiSubItemClass("/admin/AImodels")}
              >
                <Cpu size={17} />
                <span>{t.models}</span>
              </Link>

              <Link
                to="/admin/AIlogs"
                className={aiSubItemClass("/admin/AIlogs")}
              >
                <ScrollText size={17} />
                <span>{t.logs}</span>
              </Link>
            </div>
          )}
        </div>

        {/* EVALUATION */}
        <div>
          <button
            type="button"
            onClick={() => toggleMenu("evaluation")}
            className={buttonClass(openMenus.evaluation)}
          >
            <div className="flex items-center gap-3">
              <ClipboardList size={20} />
              {!collapsed && <span>{t.evaluation}</span>}
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
                {!collapsed && <span>{t.grades}</span>}
              </Link>
            </div>
          )}
        </div>

        {/* FINANCE */}
        <div>
          <button
            type="button"
            onClick={() => toggleMenu("finance")}
            className={buttonClass(openMenus.finance)}
          >
            <div className="flex items-center gap-3">
              <DollarSign size={20} />
              {!collapsed && <span>{t.finance}</span>}
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
                {!collapsed && <span>{t.payments}</span>}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-3">
        <Link to="/admin/settings" className={itemClass("/admin/settings")}>
          <Settings size={20} />
          {!collapsed && <span>{t.settings}</span>}
        </Link>
      </div>
    </div>
  );
}