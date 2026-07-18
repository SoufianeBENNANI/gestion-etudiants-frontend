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
  GraduationCap,
  Building2,
  Brain,
} from "lucide-react";

const logo = "/images/LogoSchool.png";

const translations = {
  EN: {
    dashboard: "Dashboard",
    academics: "Academics",
    courses: "Courses",
    classes: "Classes",
    students: "Students",
    attendance: "Attendance",
    departments: "Departments",
    teachers: "Teachers",
    evaluation: "Evaluation",
    grades: "Grades",
    predictions: "Predictions IA",
    settings: "Settings",
  },
  FR: {
    dashboard: "Tableau de bord",
    academics: "Académique",
    courses: "Cours",
    classes: "Classes",
    students: "Étudiants",
    attendance: "Présence",
    departments: "Départements",
    teachers: "Professeurs",
    evaluation: "Évaluation",
    grades: "Notes",
    predictions: "Prédictions IA",
    settings: "Paramètres",
  },
  AR: {
    dashboard: "لوحة التحكم",
    academics: "الأكاديمي",
    courses: "الدورات",
    classes: "الأقسام",
    students: "الطلاب",
    attendance: "الحضور",
    departments: "الشعب",
    teachers: "الأساتذة",
    evaluation: "التقييم",
    grades: "النقط",
    predictions: "توقعات الذكاء الاصطناعي",
    settings: "الإعدادات",
  },
};

export default function TeacherSidebar({ collapsed, setCollapsed }) {
  const { pathname } = useLocation();

  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [openMenus, setOpenMenus] = useState({
    academics: false,
    evaluation: false,
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

  useEffect(() => {
    if (
      pathname.includes("/teacher/courses") ||
      pathname.includes("/teacher/classes") ||
      pathname.includes("/teacher/students") ||
      pathname.includes("/teacher/attendance") ||
      pathname.includes("/teacher/departments") ||
      pathname.includes("/teacher/teachers")
    ) {
      setOpenMenus({
        academics: true,
        evaluation: false,
      });
      return;
    }

    if (
      pathname.includes("/teacher/grades") ||
      pathname.includes("/teacher/predictions")
    ) {
      setOpenMenus({
        academics: false,
        evaluation: true,
      });
      return;
    }

    setOpenMenus({
      academics: false,
      evaluation: false,
    });
  }, [pathname]);

  const toggleMenu = (menu) => {
    if (collapsed) {
      setCollapsed(false);

      setOpenMenus({
        academics: menu === "academics",
        evaluation: menu === "evaluation",
      });

      return;
    }

    setOpenMenus((previous) => {
      const isAlreadyOpen = previous[menu];

      return {
        academics: menu === "academics" ? !isAlreadyOpen : false,
        evaluation: menu === "evaluation" ? !isAlreadyOpen : false,
      };
    });
  };

  const toggleSidebar = () => {
    setCollapsed((previous) => !previous);
  };

  const activeStyle =
    "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30";

  const itemClass = (path) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
      pathname === path
        ? activeStyle
        : "text-white hover:bg-white/10 hover:text-violet-300"
    } ${collapsed ? "justify-center" : ""}`;

  const buttonClass = (isOpen) =>
    `flex w-full items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
      isOpen
        ? activeStyle
        : "text-white hover:bg-white/10 hover:text-violet-300"
    }`;

  const subItemClass = (path) =>
    `flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition-all duration-300 ${
      pathname === path
        ? "bg-white/10 font-semibold text-white"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside
      dir={language === "AR" ? "rtl" : "ltr"}
      className={`sticky top-0 z-20 flex h-screen shrink-0 flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
      style={{
        background: "linear-gradient(180deg, #312e81, #4c1d95)",
        color: "white",
      }}
    >
      <div
        className={`flex items-center p-5 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <img
            src={logo}
            alt="logo"
            className="w-44 object-contain"
          />
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-xl p-2 transition hover:bg-white/10"
          aria-label={collapsed ? "Agrandir le menu" : "Réduire le menu"}
          title={collapsed ? "Agrandir le menu" : "Réduire le menu"}
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-3">
        <Link
          to="/teacher"
          className={itemClass("/teacher")}
          title={collapsed ? t.dashboard : undefined}
        >
          <LayoutDashboard size={20} />
          {!collapsed && <span>{t.dashboard}</span>}
        </Link>

        <div>
          <button
            type="button"
            onClick={() => toggleMenu("academics")}
            className={buttonClass(openMenus.academics)}
            title={collapsed ? t.academics : undefined}
          >
            <div className={`flex items-center gap-3 ${collapsed ? "w-full justify-center" : ""}`}>
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
            <div className="mt-3 space-y-2 border-white/10 px-4 ltr:ml-6 ltr:border-l rtl:mr-6 rtl:border-r">
              <Link to="/teacher/courses" className={subItemClass("/teacher/courses")}>
                <BookOpen size={18} />
                <span>{t.courses}</span>
              </Link>

              <Link to="/teacher/classes" className={subItemClass("/teacher/classes")}>
                <GraduationCap size={18} />
                <span>{t.classes}</span>
              </Link>

              <Link to="/teacher/students" className={subItemClass("/teacher/students")}>
                <Users size={18} />
                <span>{t.students}</span>
              </Link>

              <Link to="/teacher/attendance" className={subItemClass("/teacher/attendance")}>
                <ClipboardCheck size={18} />
                <span>{t.attendance}</span>
              </Link>

              <Link to="/teacher/departments" className={subItemClass("/teacher/departments")}>
                <Building2 size={18} />
                <span>{t.departments}</span>
              </Link>

              <Link to="/teacher/teachers" className={subItemClass("/teacher/teachers")}>
                <Users size={18} />
                <span>{t.teachers}</span>
              </Link>
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => toggleMenu("evaluation")}
            className={buttonClass(openMenus.evaluation)}
            title={collapsed ? t.evaluation : undefined}
          >
            <div className={`flex items-center gap-3 ${collapsed ? "w-full justify-center" : ""}`}>
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
            <div className="mt-3 space-y-2 border-white/10 px-4 ltr:ml-6 ltr:border-l rtl:mr-6 rtl:border-r">
              <Link to="/teacher/grades" className={subItemClass("/teacher/grades")}>
                <ClipboardList size={18} />
                <span>{t.grades}</span>
              </Link>

              <Link to="/teacher/predictions" className={subItemClass("/teacher/predictions")}>
                <Brain size={18} />
                <span>{t.predictions}</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <Link
          to="/teacher/settings"
          className={itemClass("/teacher/settings")}
          title={collapsed ? t.settings : undefined}
        >
          <Settings size={20} />
          {!collapsed && <span>{t.settings}</span>}
        </Link>
      </div>
    </aside>
  );
}