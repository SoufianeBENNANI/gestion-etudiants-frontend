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
    }

    if (
      pathname.includes("/teacher/grades") ||
      pathname.includes("/teacher/predictions")
    ) {
      setOpenMenus({
        academics: false,
        evaluation: true,
      });
    }
  }, [pathname]);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => {
      const isAlreadyOpen = prev[menu];

      return {
        academics: menu === "academics" ? !isAlreadyOpen : false,
        evaluation: menu === "evaluation" ? !isAlreadyOpen : false,
      };
    });
  };

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
          {!collapsed && <span>{t.dashboard}</span>}
        </Link>

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
        <Link to="/teacher/settings" className={itemClass("/teacher/settings")}>
          <Settings size={20} />
          {!collapsed && <span>{t.settings}</span>}
        </Link>
      </div>
    </aside>
  );
}