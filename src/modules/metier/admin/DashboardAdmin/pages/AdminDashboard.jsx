import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Loader2,
  LogOut,
  Mail,
  MoreVertical,
  Search,
  School,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getDashboardData } from "../services/dashboardService";
import { connectKafkaNotifications } from "../services/notificationService";

const translations = {
  EN: {
    greeting: "Hey, Admin 👋",
    welcome: "Welcome to your Dashboard",
    search: "Search",
    admin: "Admin",
    administrator: "Administrator",
    administratorAccount: "Administrator account",
    logout: "Logout",

    dashboard: "Dashboard",

    loadingDashboard: "Loading dashboard...",
    loadError: "Unable to load dashboard data.",

    students: "Students",
    teachers: "Teachers",
    courses: "Courses",
    classes: "Classes",

    totalStudents: "Total students",
    totalTeachers: "Total teachers",
    totalCourses: "Total courses",
    totalClasses: "Total classes",

    last30Days: "Last 30 days",

    monthlyOverview: "Monthly Overview",
    attendance: "Attendance",
    noAttendanceData: "No attendance data.",

    present: "Present",
    absent: "Absent",
    other: "Other",

    studentsList: "Students List",
    recentStudents: "Recent students list",
    student: "Student",
    class: "Class",
    email: "Email",
    status: "Status",
    active: "Active",
    noStudents: "No students found.",

    showing: "Showing",
    to: "to",
    of: "of",
    page: "Page",

    gmailKafka: "Gmail Kafka",
    recentNotifications: "Recent notifications",
    gmailNotificationService: "Gmail notification service",
    gmailNotificationMessage: "Kafka/WebSocket ready to receive emails.",
    studentsLoaded: "Students loaded",
    studentsLoadedMessage: "students loaded from API.",
    kafkaStatus: "Kafka Status",
    kafkaMessage: "Connect with WebSocket after backend configuration.",

    archivedStudents: "Archived Students",
    predictions: "Predictions",
  },

  FR: {
    greeting: "Salut, Admin 👋",
    welcome: "Bienvenue dans votre tableau de bord",
    search: "Rechercher",
    admin: "Admin",
    administrator: "Administrateur",
    administratorAccount: "Compte administrateur",
    logout: "Déconnexion",

    dashboard: "Tableau de bord",
    whatsNew: "Nouveautés",

    loadingDashboard: "Chargement du dashboard...",
    loadError: "Impossible de charger les données du dashboard.",

    students: "Étudiants",
    teachers: "Professeurs",
    courses: "Cours",
    classes: "Classes",

    totalStudents: "Total étudiants",
    totalTeachers: "Total professeurs",
    totalCourses: "Total cours",
    totalClasses: "Total classes",

    last30Days: "30 derniers jours",

    monthlyOverview: "Vue mensuelle",
    attendance: "Présence",
    noAttendanceData: "Aucune donnée d'attendance.",

    present: "Présent",
    absent: "Absent",
    other: "Autre",

    studentsList: "Liste des étudiants",
    recentStudents: "Liste des étudiants récents",
    student: "Étudiant",
    class: "Classe",
    email: "Email",
    status: "Statut",
    active: "Actif",
    noStudents: "Aucun étudiant trouvé.",

    showing: "Affichage",
    to: "à",
    of: "sur",
    page: "Page",

    gmailKafka: "Gmail Kafka",
    recentNotifications: "Notifications récentes",
    gmailNotificationService: "Service de notification Gmail",
    gmailNotificationMessage: "Kafka/WebSocket prêt pour recevoir les emails.",
    studentsLoaded: "Étudiants chargés",
    studentsLoadedMessage: "étudiants chargés depuis l'API.",
    kafkaStatus: "Statut Kafka",
    kafkaMessage: "Connecter avec WebSocket après configuration backend.",

    archivedStudents: "Étudiants archivés",
    predictions: "Prédictions",
  },

  AR: {
    greeting: "مرحبا، المدير 👋",
    welcome: "مرحبا بك في لوحة التحكم",
    search: "بحث",
    admin: "المدير",
    administrator: "مسؤول النظام",
    administratorAccount: "حساب المسؤول",
    logout: "تسجيل الخروج",

    dashboard: "لوحة التحكم",
    whatsNew: "ما الجديد",

    loadingDashboard: "جاري تحميل لوحة التحكم...",
    loadError: "تعذر تحميل بيانات لوحة التحكم.",

    students: "الطلاب",
    teachers: "الأساتذة",
    courses: "الدورات",
    classes: "الأقسام",

    totalStudents: "إجمالي الطلاب",
    totalTeachers: "إجمالي الأساتذة",
    totalCourses: "إجمالي الدورات",
    totalClasses: "إجمالي الأقسام",

    last30Days: "آخر 30 يومًا",

    monthlyOverview: "نظرة شهرية",
    attendance: "الحضور",
    noAttendanceData: "لا توجد بيانات حضور.",

    present: "حاضر",
    absent: "غائب",
    other: "آخر",

    studentsList: "قائمة الطلاب",
    recentStudents: "قائمة الطلاب الحديثة",
    student: "الطالب",
    class: "القسم",
    email: "البريد الإلكتروني",
    status: "الحالة",
    active: "نشط",
    noStudents: "لا يوجد طلاب.",

    showing: "عرض",
    to: "إلى",
    of: "من",
    page: "الصفحة",

    gmailKafka: "Gmail Kafka",
    recentNotifications: "الإشعارات الحديثة",
    gmailNotificationService: "خدمة إشعارات Gmail",
    gmailNotificationMessage: "Kafka/WebSocket جاهز لاستقبال الرسائل.",
    studentsLoaded: "تم تحميل الطلاب",
    studentsLoadedMessage: "طلاب تم تحميلهم من API.",
    kafkaStatus: "حالة Kafka",
    kafkaMessage: "الاتصال عبر WebSocket بعد إعداد backend.",

    archivedStudents: "الطلاب المؤرشفون",
    predictions: "التوقعات",
  },
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const STUDENTS_PER_PAGE = 5;

const getDateValue = (item) => {
  const dateValue =
    item?.createdAt ||
    item?.created_at ||
    item?.dateCreation ||
    item?.creationDate ||
    item?.date ||
    item?.attendanceDate ||
    item?.paymentDate ||
    item?.createdDate;

  if (!dateValue) return null;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return null;

  return date;
};

const buildMonthlyData = ({
  students = [],
  teachers = [],
  courses = [],
  payements = [],
  attendances = [],
  predictions = [],
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const result = months.map((month) => ({
    name: month,
    students: 0,
    teachers: 0,
    courses: 0,
    payements: 0,
    attendances: 0,
    predictions: 0,
  }));

  const addItemsToMonth = (items, key) => {
    let hasValidDate = false;

    items.forEach((item) => {
      const date = getDateValue(item);

      if (!date) return;
      if (date.getFullYear() !== currentYear) return;

      result[date.getMonth()][key] += 1;
      hasValidDate = true;
    });

    if (items.length > 0 && !hasValidDate) {
      result[currentMonth][key] = items.length;
    }
  };

  addItemsToMonth(students, "students");
  addItemsToMonth(teachers, "teachers");
  addItemsToMonth(courses, "courses");
  addItemsToMonth(payements, "payements");
  addItemsToMonth(attendances, "attendances");
  addItemsToMonth(predictions, "predictions");

  return result;
};

export default function AdminDashboard() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [loading, setLoading] = useState(true);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [gmailConnected] = useState(
    localStorage.getItem("gmail-connected") === "true"
  );

  const [dashboardData, setDashboardData] = useState({
    students: [],
    archivedStudents: [],
    teachers: [],
    courses: [],
    classes: [],
    departements: [],
    grades: [],
    payements: [],
    attendances: [],
    predictions: [],
    models: [],
  });

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const MAX_VISIBLE_NOTIFICATIONS = 3;
  const GMAIL_URL = "https://mail.google.com/mail/u/0/#inbox";

  const isGmailNotification = (notification) => {
    return String(notification?.entity || "").toUpperCase() === "GMAIL";
  };

  const isOldGmailSuccessMessage = (notification) => {
    const message = String(notification?.message || "").toLowerCase();

    return (
      isGmailNotification(notification) &&
      (message.includes("email sent successfully") ||
        message.includes("email envoyé avec succès"))
    );
  };

  const getNotificationId = (notification, index = 0) => {
    return (
      notification?.id ||
      `${notification?.entity || "KAFKA"}-${notification?.action || "EVENT"}-${
        notification?.message || ""
      }-${notification?.createdAt || index}`
    );
  };

  const cleanNotifications = notifications.filter(
    (notification) => !isOldGmailSuccessMessage(notification)
  );

  const unreadCount = cleanNotifications.filter((item) => !item.read).length;

  const displayedNotifications = showAllNotifications
    ? cleanNotifications
    : cleanNotifications.slice(0, MAX_VISIBLE_NOTIFICATIONS);

  const hiddenNotificationsCount = Math.max(
    cleanNotifications.length - MAX_VISIBLE_NOTIFICATIONS,
    0
  );

  const handleNotificationClick = (notification) => {
    const clickedId = notification.notificationId;

    setNotifications((prev) =>
      prev.map((item) =>
        item.notificationId === clickedId ? { ...item, read: true } : item
      )
    );

    if (isGmailNotification(notification)) {
      window.open(
        notification.redirectUrl || GMAIL_URL,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--border-color)",
    color: "var(--text-color)",
  };

  const sectionStyle = {
    backgroundColor: "var(--section-bg)",
    borderColor: "var(--border-color)",
  };

  const inputStyle = {
    backgroundColor: "var(--input-bg)",
    color: "var(--text-color)",
    borderColor: "var(--border-color)",
  };

  const textStyle = {
    color: "var(--text-color)",
  };

  const mutedTextStyle = {
    color: "var(--muted-text)",
  };

  useEffect(() => {
    const isAllowedNotification = (notification) => {
      const entity = String(notification?.entity || "").toUpperCase();
      const action = String(notification?.action || "").toUpperCase();

      if (isOldGmailSuccessMessage(notification)) {
        return false;
      }

      if (entity === "GMAIL" && !gmailConnected && action !== "SENT") {
        return false;
      }

      const rules = {
        STUDENT: ["CREATED", "UPDATED", "DELETED", "RESTORED"],
        TEACHER: ["CREATED", "UPDATED", "DELETED", "RESTORED"],
        CLASSES: ["CREATED", "UPDATED", "DELETED", "RESTORED"],
        COURSES: ["CREATED", "UPDATED", "DELETED", "RESTORED"],

        PAYEMENT: ["CREATED", "UPDATED", "DELETED", "RESTORED", "GENERATED"],
        PAYMENT: ["CREATED", "UPDATED", "DELETED", "RESTORED", "GENERATED"],
        ATTENDANCE: ["CREATED", "UPDATED", "DELETED", "RESTORED"],
        GRADE: ["CREATED", "UPDATED", "DELETED", "RESTORED"],

        GMAIL: ["SENT", "READ", "RECEIVED"],
      };

      return rules[entity]?.includes(action);
    };

    const disconnect = connectKafkaNotifications((notification) => {
      console.log("Notification dashboard:", notification);

      if (!isAllowedNotification(notification)) {
        console.log("Notification ignorée:", notification);
        return;
      }

      setNotifications((prev) => {
        const newNotification = {
          ...notification,
          notificationId: getNotificationId(notification, Date.now()),
          receivedAt: notification?.createdAt || new Date().toISOString(),
          read: false,
        };

        return [
          newNotification,
          ...prev.filter((item) => !isOldGmailSuccessMessage(item)),
        ];
      });

      loadDashboard();
    });

    return () => disconnect();
  }, [gmailConnected]);

  const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError(t.loadError);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadDashboard();
    }, []);

    useEffect(() => {
      setCurrentPage(1);
    }, [search]);

    useEffect(() => {
      if (error) {
        setError(t.loadError);
      }
    }, [language]);

    const handleKeycloakLogout = () => {
      const keycloakUrl = "http://localhost:8081";
      const realm = "gestion_etudiant";
      const clientId = "gestion-etudiant-frontend";
      const postLogoutRedirectUri = "http://localhost:5173";

      const idToken =
        localStorage.getItem("idToken") ||
        localStorage.getItem("id_token") ||
        sessionStorage.getItem("idToken") ||
        sessionStorage.getItem("id_token");

      const logoutParams = new URLSearchParams();

      logoutParams.set("client_id", clientId);
      logoutParams.set("post_logout_redirect_uri", postLogoutRedirectUri);

      if (idToken) {
        logoutParams.set("id_token_hint", idToken);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("idToken");
      localStorage.removeItem("id_token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("auth");

      sessionStorage.clear();

      window.location.href = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout?${logoutParams.toString()}`;
    };

    const {
      students,
      archivedStudents,
      teachers,
      courses,
      classes,
      payements,
      attendances,
      predictions,
    } = dashboardData;

    const stats = [
      {
        title: t.students,
        value: students.length,
        subtitle: t.totalStudents,
        icon: GraduationCap,
        iconBg: "bg-blue-500",
        percentBg: "bg-blue-50",
        percentText: "text-blue-600",
        percent: "73%",
        trend: "22%",
      },
      {
        title: t.teachers,
        value: teachers.length,
        subtitle: t.totalTeachers,
        icon: Users,
        iconBg: "bg-emerald-500",
        percentBg: "bg-emerald-50",
        percentText: "text-emerald-600",
        percent: "82%",
        trend: "0.9%",
      },
      {
        title: t.courses,
        value: courses.length,
        subtitle: t.totalCourses,
        icon: BookOpen,
        iconBg: "bg-orange-500",
        percentBg: "bg-orange-50",
        percentText: "text-orange-600",
        percent: "100%",
        trend: "17%",
      },
      {
        title: t.classes,
        value: classes.length,
        subtitle: t.totalClasses,
        icon: School,
        iconBg: "bg-violet-500",
        percentBg: "bg-violet-50",
        percentText: "text-violet-600",
        percent: "76%",
        trend: "17%",
      },
    ];

    const overviewChartData = useMemo(() => {
      return buildMonthlyData({
        students,
        teachers,
        courses,
        payements,
        attendances,
        predictions,
      });
    }, [students, teachers, courses, payements, attendances, predictions]);

    const attendanceChartData = useMemo(() => {
      const present = attendances.filter((item) => {
        const status = String(item.status || item.statut || item.etat || "")
          .trim()
          .toLowerCase();

        return status.includes("present") || status.includes("présent");
      }).length;

      const absent = attendances.filter((item) => {
        const status = String(item.status || item.statut || item.etat || "")
          .trim()
          .toLowerCase();

        return status.includes("absent");
      }).length;

      const other = Math.max(attendances.length - present - absent, 0);

      return [
        { name: t.present, value: present },
        { name: t.absent, value: absent },
        { name: t.other, value: other },
        { name: t.students, value: students.length },
        { name: t.courses, value: courses.length },
        { name: t.teachers, value: teachers.length },
      ].filter((item) => item.value > 0);
    }, [attendances, students.length, courses.length, teachers.length, language]);

    const filteredStudents = students.filter((student) => {
      const keyword = search.trim().toLowerCase();

      if (!keyword) return true;

      const fullName = `${student.nom || ""} ${student.prenom || ""}`.toLowerCase();

      const email = String(student.email || "").toLowerCase();

      const classe = String(
        student.classe?.nom ||
        student.classeName ||
        student.className ||
        student.niveau ||
        ""
      ).toLowerCase();

      return (
        fullName.includes(keyword) ||
        email.includes(keyword) ||
        classe.includes(keyword)
      );
    });

    const totalPages = Math.max(
      1,
      Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE)
    );

    const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE;
    const endIndex = startIndex + STUDENTS_PER_PAGE;

    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const pieColors = [
      "#38bdf8",
      "#f59e0b",
      "#14b8a6",
      "#ef4444",
      "#0ea5e9",
      "#22c55e",
    ];

    if (loading) {
      return (
        <div
          className="flex min-h-[70vh] items-center justify-center transition-colors duration-300"
          style={{
            backgroundColor: "var(--app-bg)",
            color: "var(--text-color)",
          }}
          dir={language === "AR" ? "rtl" : "ltr"}
        >
          <div
            className="flex items-center gap-3 rounded-2xl border px-6 py-4 shadow-sm"
            style={cardStyle}
          >
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />

            <span className="font-semibold" style={textStyle}>
              {t.loadingDashboard}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div
        className="min-h-screen space-y-5 px-2 py-1 transition-colors duration-300"
        style={{
          backgroundColor: "var(--app-bg)",
          color: "var(--text-color)",
        }}
        dir={language === "AR" ? "rtl" : "ltr"}
      >
        {/* HEADER */}
        <div
          className="relative z-40 rounded-[1.7rem] border px-6 py-5 text-white shadow-sm"
          style={{
            borderColor: "var(--border-color)",
            background: "linear-gradient(135deg, var(--secondary-color), #020617)",
          }}
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-blue-200">
                {t.greeting}
              </p>

              <h1 className="mt-1 truncate text-2xl font-black text-white">
                {t.welcome}
              </h1>

              <p className="mt-1 text-sm font-semibold text-slate-300">
                {t.dashboard}
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.search}
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-300 sm:w-72"
                />

                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationOpen((prev) => !prev)}
                    className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
                  >
                    <Bell className="h-5 w-5" />

                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white ring-2 ring-[#020617]">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationOpen && (
                    <div
                      className={`absolute top-[calc(100%+0.75rem)] z-[999] w-96 overflow-hidden rounded-[1.4rem] border shadow-2xl ${language === "AR" ? "left-0" : "right-0"
                        }`}
                      style={cardStyle}
                    >
                      <div
                        className="flex items-center justify-between border-b px-5 py-4"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        <div>
                          <h3 className="text-sm font-black" style={textStyle}>
                            Notifications
                          </h3>
                          <p className="text-xs font-semibold" style={mutedTextStyle}>
                            {unreadCount} non lu(s)</p>
                        </div>

                        {cleanNotifications.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setNotifications([]);
                              setShowAllNotifications(false);
                            }}
                            className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600 hover:bg-red-100"
                          >
                            Clear All
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto p-3">
                        {displayedNotifications.length > 0 ? (
                          <>
                            {displayedNotifications.map((notification, index) => (
                              <button
                                key={notification.notificationId || index}
                                type="button"
                                onClick={() => handleNotificationClick(notification)}
                                className={`mb-3 flex w-full gap-3 rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                                  notification.read ? "opacity-60" : "opacity-100"
                                }`}
                                style={sectionStyle}
                              >
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${
                                    notification.read ? "bg-slate-400" : "bg-blue-600"
                                  }`}
                                >
                                  {isGmailNotification(notification) ? (
                                    <Mail className="h-4 w-4" />
                                  ) : (
                                    <Bell className="h-4 w-4" />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`line-clamp-2 text-sm leading-6 ${
                                      notification.read ? "font-semibold" : "font-black"
                                    }`}
                                    style={textStyle}
                                  >
                                    {notification.message || "Nouvelle notification reçue"}
                                  </p>

                                  <div className="mt-2 flex items-center justify-between gap-3">
                                    {notification.createdAt && (
                                      <p className="text-[10px] font-bold" style={mutedTextStyle}>
                                        {new Date(notification.createdAt).toLocaleString()}
                                      </p>
                                    )}

                                    {notification.read ? (
                                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">
                                        Lu
                                      </span>
                                    ) : (
                                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-600">
                                        Nouveau
                                      </span>
                                    )}
                                  </div>

                                  {isGmailNotification(notification) && (
                                    <p className="mt-2 text-xs font-black text-blue-600">
                                      Ouvrir Gmail →
                                    </p>
                                  )}
                                </div>
                              </button>
                            ))}

                            {hiddenNotificationsCount > 0 && !showAllNotifications && (
                              <button
                                type="button"
                                onClick={() => setShowAllNotifications(true)}
                                className="mt-1 w-full rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-600 transition hover:bg-blue-100"
                              >
                                Afficher plus ({hiddenNotificationsCount})
                              </button>
                            )}

                            {showAllNotifications &&
                              cleanNotifications.length > MAX_VISIBLE_NOTIFICATIONS && (
                                <button
                                  type="button"
                                  onClick={() => setShowAllNotifications(false)}
                                  className="mt-1 w-full rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-200"
                                >
                                  Afficher moins
                                </button>
                              )}
                          </>
                        ) : (
                          <div className="rounded-2xl border p-4 text-center" style={sectionStyle}>
                            <p className="text-sm font-black" style={textStyle}>
                              Aucune notification
                            </p>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAdminMenuOpen((prev) => !prev)}
                    className="flex h-12 min-w-[190px] items-center justify-between gap-3 rounded-full bg-white/10 px-3 text-white ring-1 ring-white/15 transition hover:bg-white/15"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                        A
                      </div>

                      <div className="hidden min-w-0 text-left sm:block">
                        <p className="truncate text-sm font-black text-white">
                          {t.admin}
                        </p>

                        <p className="truncate text-[11px] font-semibold text-slate-300">
                          {t.administrator}
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-300 transition ${adminMenuOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {adminMenuOpen && (
                    <div
                      className={`absolute top-[calc(100%+0.75rem)] z-[999] w-64 overflow-hidden rounded-[1.2rem] border shadow-2xl ${language === "AR" ? "left-0" : "right-0"
                        }`}
                      style={cardStyle}
                    >
                      <div
                        className="border-b px-5 py-4"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                            A
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black" style={textStyle}>
                              {t.admin}
                            </p>

                            <p className="truncate text-xs font-semibold" style={mutedTextStyle}>
                              {t.administratorAccount}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleKeycloakLogout}
                        className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-black text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        {t.logout}
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[1.4rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                style={cardStyle}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${item.iconBg} text-white`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black" style={textStyle}>
                        {item.value}
                      </h3>

                      <p className="text-xs font-semibold" style={mutedTextStyle}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${item.percentBg}`}
                  >
                    <span className={`text-[11px] font-black ${item.percentText}`}>
                      {item.percent}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 text-xs font-semibold">
                  <span style={mutedTextStyle}>{t.last30Days}</span>

                  <span className="font-black text-emerald-500">
                    {item.trend}
                  </span>

                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div
            className="rounded-[1.4rem] border p-6 shadow-sm xl:col-span-2"
            style={cardStyle}
          >
            <div className="mb-5">
              <h2 className="text-xl font-black" style={textStyle}>
                {t.monthlyOverview}
              </h2>

              <div className="mt-3 flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-xs font-black" style={mutedTextStyle}>
                    {t.students}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-orange-400" />
                  <span className="text-xs font-black" style={mutedTextStyle}>
                    {t.teachers}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overviewChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "var(--muted-text)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "var(--muted-text)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#3b82f6"
                    fill="#dbeafe"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="teachers"
                    stroke="#fb923c"
                    fill="#ffedd5"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className="rounded-[1.4rem] border p-6 shadow-sm"
            style={cardStyle}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black" style={textStyle}>
                {t.attendance}
              </h2>

              <button type="button">
                <MoreVertical className="h-5 w-5" style={mutedTextStyle} />
              </button>
            </div>

            <div className="h-72">
              {attendanceChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attendanceChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div
                  className="flex h-full items-center justify-center text-sm font-semibold"
                  style={mutedTextStyle}
                >
                  {t.noAttendanceData}
                </div>
              )}
            </div>

            <div
              className="grid grid-cols-2 gap-2 text-xs font-semibold"
              style={mutedTextStyle}
            >
              {attendanceChartData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: pieColors[index % pieColors.length],
                    }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABLE + NOTIFICATIONS */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div
            className="rounded-[1.4rem] border p-5 shadow-sm xl:col-span-2"
            style={cardStyle}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black" style={textStyle}>
                  {t.studentsList}
                </h2>

                <p className="text-sm font-semibold" style={mutedTextStyle}>
                  {t.recentStudents}
                </p>
              </div>

              <span
                className="rounded-full px-4 py-2 text-xs font-black"
                style={inputStyle}
              >
                {filteredStudents.length} {t.students}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr
                    className="border-b text-left text-xs font-black uppercase tracking-wide"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--muted-text)",
                    }}
                  >
                    <th className="py-4">{t.student}</th>
                    <th className="py-4">{t.class}</th>
                    <th className="py-4">{t.email}</th>
                    <th className="py-4">{t.status}</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student, index) => {
                      const fullName =
                        `${student.nom || ""} ${student.prenom || ""}`.trim() ||
                        student.name ||
                        "Unknown Student";

                      const classe =
                        student.classe?.nom ||
                        student.classeName ||
                        student.className ||
                        student.niveau ||
                        "-";

                      return (
                        <tr
                          key={student.id || `${fullName}-${index}`}
                          className="border-b text-sm last:border-none hover:bg-slate-50/40"
                          style={{ borderColor: "var(--border-color)" }}
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-black text-blue-600">
                                {fullName.charAt(0).toUpperCase()}
                              </div>

                              <p
                                className="max-w-[180px] truncate font-black"
                                style={textStyle}
                                title={fullName}
                              >
                                {fullName}
                              </p>
                            </div>
                          </td>

                          <td className="py-4 font-semibold" style={mutedTextStyle}>
                            {classe}
                          </td>

                          <td className="py-4 font-semibold" style={mutedTextStyle}>
                            {student.email || "-"}
                          </td>

                          <td className="py-4">
                            <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                              {t.active}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-10 text-center text-sm font-semibold"
                        style={mutedTextStyle}
                      >
                        {t.noStudents}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div
              className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p className="text-xs font-bold" style={mutedTextStyle}>
                {t.showing}{" "}
                <span className="font-black" style={textStyle}>
                  {filteredStudents.length === 0 ? 0 : startIndex + 1}
                </span>{" "}
                {t.to}{" "}
                <span className="font-black" style={textStyle}>
                  {Math.min(endIndex, filteredStudents.length)}
                </span>{" "}
                {t.of}{" "}
                <span className="font-black" style={textStyle}>
                  {filteredStudents.length}
                </span>{" "}
                {t.students}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-40"
                  style={inputStyle}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span
                  className="rounded-xl px-4 py-2 text-xs font-black"
                  style={inputStyle}
                >
                  {t.page} {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-40"
                  style={inputStyle}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div
            className="rounded-[1.4rem] border p-5 shadow-sm"
            style={cardStyle}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black" style={textStyle}>
                  Kafka Notifications
                </h2>

                <p className="text-sm font-semibold" style={mutedTextStyle}>
                  {t.recentNotifications}
                </p>
              </div>

              <div className="relative rounded-full bg-red-50 p-3">
                <Mail className="h-5 w-5 text-red-600" />

                {cleanNotifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                    {cleanNotifications.length}
                  </span>
                )}
              </div>
            </div>

            <div className="max-h-80 space-y-3 overflow-y-auto">
              {cleanNotifications.length > 0 ? (
                cleanNotifications.map((notification, index) => (
                  <button
                    key={notification.notificationId || index}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${notification.read ? "opacity-60" : "opacity-100"}`}
                    style={sectionStyle}
                  >

                    <p
                      className="line-clamp-2 text-sm font-bold leading-6"
                      style={textStyle}
                    >
                      {notification.message || "Nouvelle notification reçue"}
                    </p>

                    {isGmailNotification(notification) && (
                      <p className="mt-2 text-xs font-black text-blue-600">
                        Ouvrir Gmail →
                      </p>
                    )}
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border p-4" style={sectionStyle}>
                  <p className="text-sm font-black" style={textStyle}>
                    Aucune notification
                  </p>

                  <p className="mt-1 text-xs font-semibold" style={mutedTextStyle}>
                    Les événements Kafka seront affichés ici.
                  </p>
                </div>
              )}
            </div>

            <div
              className="mt-5 rounded-2xl p-4 text-white"
              style={{
                background: "linear-gradient(135deg, var(--secondary-color), #020617)",
              }}
            >
              <p className="text-sm font-black">{t.kafkaStatus}</p>

              <p className="mt-1 text-xs font-semibold text-slate-300">
                SSE connecté avec Kafka via backend.
              </p>
            </div>
          </div>
        </div>

        {/* MINI SUMMARY */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-[1.4rem] border p-5 shadow-sm" style={cardStyle}>
            <p className="text-sm font-semibold" style={mutedTextStyle}>
              {t.archivedStudents}
            </p>

            <h3 className="mt-2 text-2xl font-black" style={textStyle}>
              {archivedStudents.length}
            </h3>
          </div>

          <div className="rounded-[1.4rem] border p-5 shadow-sm" style={cardStyle}>
            <p className="text-sm font-semibold" style={mutedTextStyle}>
              {t.predictions}
            </p>

            <h3 className="mt-2 text-2xl font-black" style={textStyle}>
              {predictions.length}
            </h3>
          </div>

          <div className="rounded-[1.4rem] border p-5 shadow-sm" style={cardStyle}>
            <p className="text-sm font-semibold" style={mutedTextStyle}>
              {t.attendance}
            </p>

            <h3 className="mt-2 text-2xl font-black" style={textStyle}>
              {attendances.length}
            </h3>
          </div>
        </div>
      </div>
    );
  }