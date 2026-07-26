import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  LayoutDashboard,
  ClipboardCheck,
  GraduationCap,
  CreditCard,
  BrainCircuit,
  Building2,
  Settings,
  Menu,
} from "lucide-react";

const logo =
  "/images/LogoSchool.png";

const translations = {
  EN: {
    dashboard: "Dashboard",
    attendance: "My Attendance",
    grades: "My Grades",
    payments: "My Payments",
    predictions: "My Predictions",
    departments: "Departments",
    settings: "Settings",
  },

  FR: {
    dashboard: "Tableau de bord",
    attendance: "Mes présences",
    grades: "Mes notes",
    payments: "Mes paiements",
    predictions: "Mes prédictions",
    departments: "Départements",
    settings: "Paramètres",
  },

  AR: {
    dashboard: "لوحة التحكم",
    attendance: "حضوري",
    grades: "نقاطي",
    payments: "مدفوعاتي",
    predictions: "توقعاتي",
    departments: "الأقسام",
    settings: "الإعدادات",
  },
};

export default function StudentSidebar({
  collapsed,
  setCollapsed,
}) {
  const { pathname } =
    useLocation();

  const [language, setLanguage] =
    useState(
      localStorage.getItem(
        "app-language"
      ) || "EN"
    );

  const t =
    translations[language] ||
    translations.EN;

  useEffect(() => {
    const handleLanguageChange = (
      event
    ) => {
      setLanguage(
        event.detail ||
          localStorage.getItem(
            "app-language"
          ) ||
          "EN"
      );
    };

    window.addEventListener(
      "app-language-change",
      handleLanguageChange
    );

    return () => {
      window.removeEventListener(
        "app-language-change",
        handleLanguageChange
      );
    };
  }, []);

  const isPathActive = (path) => {
    if (path === "/student") {
      return pathname === "/student";
    }

    return (
      pathname === path ||
      pathname.startsWith(
        `${path}/`
      )
    );
  };

  /* =========================
     ACTIVE STYLE
  ========================= */

  const activeStyle =
    "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30";

  const itemClass = (path) => `
    flex
    items-center
    gap-3
    rounded-2xl
    px-4
    py-3
    transition-all
    duration-300

    ${
      isPathActive(path)
        ? activeStyle
        : "text-white hover:bg-white/10 hover:text-teal-100"
    }

    ${
      collapsed
        ? "justify-center"
        : ""
    }
  `;

  const menuItems = [
    {
      label: t.dashboard,
      path: "/student",
      icon: LayoutDashboard,
    },

    {
      label: t.attendance,
      path: "/student/attendance",
      icon: ClipboardCheck,
    },

    {
      label: t.grades,
      path: "/student/grades",
      icon: GraduationCap,
    },

    {
      label: t.payments,
      path: "/student/payments",
      icon: CreditCard,
    },

    {
      label: t.predictions,
      path: "/student/predictions",
      icon: BrainCircuit,
    },

    {
      label: t.departments,
      path: "/student/departments",
      icon: Building2,
    },
  ];

  return (
    <aside
      dir={
        language === "AR"
          ? "rtl"
          : "ltr"
      }
      className={`
        sticky
        top-0
        z-20
        flex
        h-screen
        shrink-0
        flex-col
        transition-all
        duration-300

        ${
          collapsed
            ? "w-20"
            : "w-72"
        }
      `}
      style={{
        background:
          "linear-gradient(180deg, #0f766e 0%, #0d9488 50%, #134e4a 100%)",

        color: "white",
      }}
    >
      {/* =====================
          HEADER
      ===================== */}

      <div
        className={`
          flex
          items-center
          p-5

          ${
            collapsed
              ? "justify-center"
              : "justify-between"
          }
        `}
      >
        {!collapsed && (
          <img
            src={logo}
            alt="School logo"
            className="
              w-44
              object-contain
              brightness-0
              invert
            "
          />
        )}

        <button
          type="button"
          onClick={() =>
            setCollapsed(
              (previous) =>
                !previous
            )
          }
          className="
            rounded-xl
            p-2
            text-white
            transition

            hover:bg-white/10
            hover:text-teal-100
          "
          title={
            collapsed
              ? "Agrandir"
              : "Réduire"
          }
        >
          <Menu size={22} />
        </button>
      </div>

      {/* =====================
          MENU
      ===================== */}

      <div
        className="
          custom-scrollbar
          flex-1
          space-y-2
          overflow-y-auto
          p-3
        "
      >
        {menuItems.map(
          ({
            label,
            path,
            icon: Icon,
          }) => (
            <Link
              key={path}
              to={path}
              className={
                itemClass(path)
              }
              title={
                collapsed
                  ? label
                  : undefined
              }
            >
              <Icon
                size={20}
                className="shrink-0"
              />

              {!collapsed && (
                <span>
                  {label}
                </span>
              )}
            </Link>
          )
        )}
      </div>

      {/* =====================
          SETTINGS
      ===================== */}

      <div className="p-3">
        <Link
          to="/student/settings"
          className={
            itemClass(
              "/student/settings"
            )
          }
          title={
            collapsed
              ? t.settings
              : undefined
          }
        >
          <Settings
            size={20}
            className="shrink-0"
          />

          {!collapsed && (
            <span>
              {t.settings}
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
}