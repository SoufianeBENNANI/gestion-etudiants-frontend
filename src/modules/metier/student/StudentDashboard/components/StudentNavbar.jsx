import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
} from "lucide-react";

const headerGradient =
  "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #134e4a 100%)";

const translations = {
  EN: {
    hello: "Hey, Student 👋",
    welcome: "Welcome to your Student Dashboard",
    dashboard: "Dashboard",
    search: "Search",
    notifications: "Notifications",
    noNotifications: "No new notifications",
    account: "Student account",
    logout: "Logout",
  },

  FR: {
    hello: "Bonjour, Étudiant 👋",
    welcome: "Bienvenue dans votre espace étudiant",
    dashboard: "Tableau de bord",
    search: "Rechercher",
    notifications: "Notifications",
    noNotifications: "Aucune nouvelle notification",
    account: "Compte étudiant",
    logout: "Déconnexion",
  },

  AR: {
    hello: "مرحباً أيها الطالب 👋",
    welcome: "مرحباً بك في لوحة تحكم الطالب",
    dashboard: "لوحة التحكم",
    search: "بحث",
    notifications: "الإشعارات",
    noNotifications: "لا توجد إشعارات جديدة",
    account: "حساب الطالب",
    logout: "تسجيل الخروج",
  },
};

export default function StudentNavbar() {
  const [
    studentMenuOpen,
    setStudentMenuOpen,
  ] = useState(false);

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [language, setLanguage] =
    useState(
      localStorage.getItem(
        "app-language"
      ) || "EN"
    );

  const t =
    translations[language] ||
    translations.EN;

  const isArabic =
    language === "AR";

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

  const handleKeycloakLogout = () => {
    const keycloakUrl =
      "http://localhost:8081";

    const realm =
      "gestion_etudiant";

    const clientId =
      "gestion-etudiant-frontend";

    const postLogoutRedirectUri =
      "http://localhost:5173";

    const idToken =
      localStorage.getItem("idToken") ||
      localStorage.getItem("id_token") ||
      sessionStorage.getItem("idToken") ||
      sessionStorage.getItem("id_token");

    const logoutParams =
      new URLSearchParams();

    logoutParams.set(
      "client_id",
      clientId
    );

    logoutParams.set(
      "post_logout_redirect_uri",
      postLogoutRedirectUri
    );

    if (idToken) {
      logoutParams.set(
        "id_token_hint",
        idToken
      );
    }

    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("id_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("auth");

    sessionStorage.clear();

    window.location.href =
      `${keycloakUrl}/realms/${realm}` +
      `/protocol/openid-connect/logout?` +
      logoutParams.toString();
  };

  return (
    <header
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
      className="
        relative
        z-40
        flex
        w-full
        flex-col
        gap-5
        overflow-visible
        rounded-[1.7rem]
        border
        border-white/15
        px-6
        py-5
        text-white
        shadow-lg

        lg:flex-row
        lg:items-center
        lg:justify-between
      "
      style={{
        background:
          headerGradient,

        boxShadow:
          "0 15px 30px rgba(13, 148, 136, 0.20)",
      }}
    >
      {/* DECORATION */}

      <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/5" />

      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-44 w-44 rounded-full bg-white/5" />

      {/* TITLE */}

      <div className="relative z-10 min-w-0">
        <p className="text-xs font-semibold text-teal-100">
          {t.hello}
        </p>

        <h1 className="mt-1 truncate text-2xl font-black text-white">
          {t.welcome}
        </h1>

        <p className="mt-1 text-sm font-semibold text-teal-100/80">
          {t.dashboard}
        </p>
      </div>

      {/* ACTIONS */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          gap-3

          lg:flex-row
          lg:items-center
        "
      >
        {/* SEARCH */}

        <div
          className="
            flex
            h-11
            items-center
            gap-2
            rounded-full
            border
            border-white/15
            bg-white/10
            px-4
            backdrop-blur-xl
          "
        >
          <input
            type="text"
            placeholder={t.search}
            className="
              w-full
              bg-transparent
              text-sm
              font-semibold
              text-white
              outline-none
              placeholder:text-teal-100/70

              sm:w-72
            "
          />

          <button
            type="button"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-transparent
              text-teal-100
              transition

              hover:bg-white/10
            "
            aria-label={t.search}
          >
            <Search size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* NOTIFICATION */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setNotificationOpen(
                  (previous) =>
                    !previous
                )
              }
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                ring-1
                ring-white/15
                transition

                hover:bg-white/15
              "
              aria-label={t.notifications}
            >
              <Bell size={20} />
            </button>

            {notificationOpen && (
              <div
                className={`
                  absolute
                  top-[calc(100%+0.75rem)]
                  z-[999]
                  w-80
                  overflow-hidden
                  rounded-[1.2rem]
                  border
                  border-slate-200
                  bg-white
                  text-slate-900
                  shadow-2xl

                  ${
                    isArabic
                      ? "left-0"
                      : "right-0"
                  }
                `}
              >
                <div className="border-b border-slate-200 px-5 py-4">
                  <h3 className="text-sm font-black">
                    {t.notifications}
                  </h3>

                  <p className="text-xs font-semibold text-slate-500">
                    {t.noNotifications}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setStudentMenuOpen(
                  (previous) =>
                    !previous
                )
              }
              className="
                flex
                h-11
                min-w-[190px]
                items-center
                justify-between
                gap-3
                rounded-full
                bg-white/10
                px-4
                text-white
                ring-1
                ring-white/15
                transition

                hover:bg-white/15
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-teal-500
                    text-sm
                    font-black
                    text-white
                    shadow-sm
                  "
                >
                  S
                </div>

                <div
                  className={`
                    hidden
                    min-w-0

                    sm:block

                    ${
                      isArabic
                        ? "text-right"
                        : "text-left"
                    }
                  `}
                >
                  <p className="truncate text-sm font-black text-white">
                    Student
                  </p>

                  <p className="truncate text-xs font-semibold text-teal-100">
                    Student
                  </p>
                </div>
              </div>

              <ChevronDown
                size={16}
                className={`
                  shrink-0
                  text-teal-100
                  transition

                  ${
                    studentMenuOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {studentMenuOpen && (
              <div
                className={`
                  absolute
                  top-[calc(100%+0.75rem)]
                  z-[999]
                  w-64
                  overflow-hidden
                  rounded-[1.2rem]
                  border
                  border-slate-200
                  bg-white
                  text-slate-900
                  shadow-2xl

                  ${
                    isArabic
                      ? "left-0"
                      : "right-0"
                  }
                `}
              >
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-teal-500
                        font-black
                        text-white
                      "
                    >
                      S
                    </div>

                    <div>
                      <p className="text-sm font-black">
                        Student
                      </p>

                      <p className="text-xs font-semibold text-slate-500">
                        {t.account}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleKeycloakLogout
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-5
                    py-4
                    text-left
                    text-sm
                    font-black
                    text-red-600
                    transition

                    hover:bg-red-50
                  "
                >
                  <LogOut size={16} />

                  {t.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}