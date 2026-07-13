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

import { getDashboardData } from "../services/teacherDashboardService";
import { connectKafkaNotifications } from "../../../admin/DashboardAdmin/services/notificationService";
import TeacherNavbar from "../components/TeacherNavbar";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const translations = {
  EN: {
    greeting: "Hey, Teacher 👋",
    welcome: "Welcome to your Teacher Dashboard",
    dashboard: "Dashboard",
    admin: "Teacher",
    administrator: "Teacher",
    administratorAccount: "Teacher account",
    search: "Search",
    logout: "Logout",
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
    present: "Present",
    absent: "Absent",
    other: "Other",
    noAttendanceData: "No attendance data",
    studentsList: "Students List",
    recentStudents: "Recent students overview",
    student: "Student",
    class: "Class",
    email: "Email",
    status: "Status",
    active: "Active",
    noStudents: "No students found",
    showing: "Showing",
    to: "to",
    of: "of",
    page: "Page",
    archivedStudents: "Archived students",
    predictions: "Predictions",
    gender: "Gender",
    phone: "Phone",
    address: "Address",
    rows: "Rows:",
  },
  FR: {
    greeting: "Salut, Professeur 👋",
    welcome: "Bienvenue dans votre tableau de bord",
    dashboard: "Dashboard",
    admin: "Professeur",
    administrator: "Professeur",
    administratorAccount: "Compte professeur",
    search: "Recherche",
    logout: "Déconnexion",
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
    monthlyOverview: "Aperçu mensuel",
    attendance: "Présence",
    present: "Présent",
    absent: "Absent",
    other: "Autre",
    noAttendanceData: "Aucune donnée de présence",
    studentsList: "Liste des étudiants",
    recentStudents: "Aperçu des étudiants récents",
    student: "Étudiant",
    class: "Classe",
    email: "Email",
    status: "Statut",
    active: "Actif",
    noStudents: "Aucun étudiant trouvé",
    showing: "Affichage",
    to: "à",
    of: "sur",
    page: "Page",
    archivedStudents: "Étudiants archivés",
    predictions: "Prédictions",
    gender: "Genre",
    phone: "Téléphone",
    address: "Adresse",
    rows: "Lignes :",
  },
  AR: {
    greeting: "مرحبا، الأستاذ 👋",
    welcome: "مرحبا بك في لوحة تحكم الأستاذ",
    dashboard: "لوحة التحكم",
    admin: "الأستاذ",
    administrator: "أستاذ",
    administratorAccount: "حساب الأستاذ",
    search: "بحث",
    logout: "تسجيل الخروج",
    loadingDashboard: "جاري تحميل لوحة التحكم...",
    loadError: "تعذر تحميل بيانات لوحة التحكم.",
    students: "الطلاب",
    teachers: "الأساتذة",
    courses: "الدروس",
    classes: "الأقسام",
    totalStudents: "مجموع الطلاب",
    totalTeachers: "مجموع الأساتذة",
    totalCourses: "مجموع الدروس",
    totalClasses: "مجموع الأقسام",
    last30Days: "آخر 30 يوما",
    monthlyOverview: "نظرة شهرية",
    attendance: "الحضور",
    present: "حاضر",
    absent: "غائب",
    other: "آخر",
    noAttendanceData: "لا توجد بيانات حضور",
    studentsList: "قائمة الطلاب",
    recentStudents: "نظرة على الطلاب الجدد",
    student: "الطالب",
    class: "القسم",
    email: "البريد",
    status: "الحالة",
    active: "نشط",
    noStudents: "لا يوجد طلاب",
    showing: "عرض",
    to: "إلى",
    of: "من",
    page: "صفحة",
    archivedStudents: "الطلاب المؤرشفون",
    predictions: "التوقعات",
    gender: "الجنس",
    phone: "الهاتف",
    address: "العنوان",
    rows: "الأسطر:",
  },
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STUDENTS_PER_PAGE = 5;

const safeArray = (data) => (Array.isArray(data) ? data : []);

const getDateValue = (item) => {
  const dateValue =
    item?.createdAt || item?.created_at || item?.dateCreation || item?.creationDate ||
    item?.date || item?.attendanceDate || item?.paymentDate || item?.createdDate;
  if (!dateValue) return null;
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? null : date;
};

const buildMonthlyData = ({ students = [], teachers = [], courses = [], payements = [], attendances = [], predictions = [] }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const result = months.map((month) => ({ name: month, students: 0, teachers: 0, courses: 0, payements: 0, attendances: 0, predictions: 0 }));

  const addItemsToMonth = (items, key) => {
    let hasValidDate = false;
    items.forEach((item) => {
      const date = getDateValue(item);
      if (!date || date.getFullYear() !== currentYear) return;
      result[date.getMonth()][key] += 1;
      hasValidDate = true;
    });
    if (items.length > 0 && !hasValidDate) result[currentMonth][key] = items.length;
  };

  addItemsToMonth(students, "students");
  addItemsToMonth(teachers, "teachers");
  addItemsToMonth(courses, "courses");
  addItemsToMonth(payements, "payements");
  addItemsToMonth(attendances, "attendances");
  addItemsToMonth(predictions, "predictions");
  return result;
};

export default function DashboardTeacher() {
  const [language, setLanguage] = useState(localStorage.getItem("app-language") || "EN");
  const t = translations[language] || translations.EN;

  const [loading, setLoading] = useState(true);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    students: [], archivedStudents: [], teachers: [], courses: [], classes: [],
    departements: [], grades: [], payements: [], attendances: [], predictions: [], models: [],
  });

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

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const textStyle = { color: "var(--text-color)" };
  const mutedTextStyle = { color: "var(--muted-text)" };
  const headerBg = "linear-gradient(135deg, #6d28d9 0%, #312e81 45%, #020617 100%)";

  const MAX_VISIBLE_NOTIFICATIONS = 3;
  const GMAIL_URL = "https://mail.google.com/mail/u/0/#inbox";

  const cleanNotifications = notifications.filter((notification) => {
    const message = String(notification?.message || "").toLowerCase();
    const entity = String(notification?.entity || "").toUpperCase();
    return !(entity === "GMAIL" && (message.includes("email sent successfully") || message.includes("email envoyé avec succès")));
  });

  const unreadCount = cleanNotifications.filter((item) => !item.read).length;
  const displayedNotifications = showAllNotifications ? cleanNotifications : cleanNotifications.slice(0, MAX_VISIBLE_NOTIFICATIONS);
  const hiddenNotificationsCount = Math.max(cleanNotifications.length - MAX_VISIBLE_NOTIFICATIONS, 0);

  const isGmailNotification = (notification) => String(notification?.entity || "").toUpperCase() === "GMAIL";

  const handleNotificationClick = (notification) => {
    setNotifications((prev) =>
      prev.map((item) => item.notificationId === notification.notificationId ? { ...item, read: true } : item)
    );
    if (isGmailNotification(notification)) window.open(notification.redirectUrl || GMAIL_URL, "_blank", "noopener,noreferrer");
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDashboardData();
      setDashboardData({
        students: safeArray(data?.students),
        archivedStudents: safeArray(data?.archivedStudents),
        teachers: safeArray(data?.teachers),
        courses: safeArray(data?.courses),
        classes: safeArray(data?.classes),
        departements: safeArray(data?.departements || data?.departments),
        grades: safeArray(data?.grades),
        payements: safeArray(data?.payements),
        attendances: safeArray(data?.attendances),
        predictions: safeArray(data?.predictions),
        models: safeArray(data?.models),
      });
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  useEffect(() => {
  const notificationStreamUrl =
    "http://localhost:8080/api/notifications/stream";

  const controller = new AbortController();

  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("token");

  if (!token) {
    console.error(
      "Token Keycloak introuvable pour la connexion SSE Teacher."
    );

    return () => controller.abort();
  }

  const addNotification = (data) => {
    const recipientRole = String(
      data?.recipientRole || data?.role || ""
    ).toUpperCase();

    /*
     * Le Teacher reçoit uniquement
     * les notifications qui lui sont destinées.
     */
    if (
      recipientRole &&
      recipientRole !== "TEACHER"
    ) {
      return;
    }

    const notification = {
      ...data,

      notificationId:
        data?.notificationId ||
        [
          data?.entity || "NOTIFICATION",
          data?.action || "RECEIVED",
          data?.entityId || "null",
          data?.createdAt || Date.now(),
        ].join("-"),

      read: false,

      redirectUrl:
        data?.redirectUrl ||
        (
          String(data?.entity || "").toUpperCase() === "GMAIL"
            ? "https://mail.google.com/mail/u/0/#inbox"
            : null
        ),
    };

    setNotifications((previousNotifications) => {
      const alreadyExists =
        previousNotifications.some(
          (item) =>
            item.notificationId ===
            notification.notificationId
        );

      if (alreadyExists) {
        return previousNotifications;
      }

      return [
        notification,
        ...previousNotifications,
      ];
    });
  };

  const connect = async () => {
    try {
      await fetchEventSource(
        notificationStreamUrl,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
            "Cache-Control": "no-cache",
          },

          signal: controller.signal,

          /*
           * Important pour éviter l'arrêt automatique
           * lorsque l'onglet devient inactif.
           */
          openWhenHidden: true,

          async onopen(response) {
            if (!response.ok) {
              throw new Error(
                `Erreur SSE Teacher : ${response.status}`
              );
            }

            const contentType =
              response.headers.get("content-type") || "";

            if (
              !contentType.includes("text/event-stream")
            ) {
              throw new Error(
                `Type SSE invalide : ${contentType}`
              );
            }

            console.log(
              "Teacher SSE connecté avec succès."
            );
          },

          onmessage(event) {
            /*
             * Accepte :
             * event: notification
             * ou message SSE sans nom d'événement.
             */
            if (
              event.event &&
              event.event !== "notification" &&
              event.event !== "message"
            ) {
              return;
            }

            if (!event.data) {
              return;
            }

            try {
              const data = JSON.parse(event.data);

              console.log(
                "Notification SSE Teacher reçue :",
                data
              );

              addNotification(data);
            } catch (error) {
              console.error(
                "Notification SSE Teacher invalide :",
                event.data,
                error
              );
            }
          },

          onclose() {
            if (!controller.signal.aborted) {
              throw new Error(
                "Connexion SSE Teacher fermée par le serveur."
              );
            }
          },

          onerror(error) {
            if (controller.signal.aborted) {
              return;
            }

            console.error(
              "Erreur connexion SSE Teacher :",
              error
            );

            /*
             * Relance automatique de la connexion.
             */
            throw error;
          },
        }
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error(
          "Impossible de connecter le SSE Teacher :",
          error
        );
      }
    }
  };

  connect();

  return () => {
    controller.abort();
  };
}, []);

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const nextLanguage =
        event.detail || localStorage.getItem("app-language") || "EN";
      setLanguage(nextLanguage);
    };

    window.addEventListener("app-language-change", handleLanguageChange);
    window.addEventListener("storage", handleLanguageChange);

    return () => {
      window.removeEventListener("app-language-change", handleLanguageChange);
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  useEffect(() => { setCurrentPage(1); }, [search]);

  const handleKeycloakLogout = () => {
    const keycloakUrl = "http://localhost:8081";
    const realm = "gestion_etudiant";
    const clientId = "gestion-etudiant-frontend";
    const postLogoutRedirectUri = "http://localhost:5173";
    const idToken = localStorage.getItem("idToken") || localStorage.getItem("id_token") || sessionStorage.getItem("idToken") || sessionStorage.getItem("id_token");
    const logoutParams = new URLSearchParams();
    logoutParams.set("client_id", clientId);
    logoutParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
    if (idToken) logoutParams.set("id_token_hint", idToken);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout?${logoutParams.toString()}`;
  };

  const { students, archivedStudents, teachers, courses, classes, payements, attendances, predictions } = dashboardData;

  const stats = [
    { title: t.students, value: students.length, subtitle: t.totalStudents, icon: GraduationCap, iconBg: "bg-blue-500", percentBg: "bg-blue-50", percentText: "text-blue-600", percent: "73%", trend: "22%" },
    { title: t.teachers, value: teachers.length, subtitle: t.totalTeachers, icon: Users, iconBg: "bg-emerald-500", percentBg: "bg-emerald-50", percentText: "text-emerald-600", percent: "82%", trend: "0.9%" },
    { title: t.courses, value: courses.length, subtitle: t.totalCourses, icon: BookOpen, iconBg: "bg-orange-500", percentBg: "bg-orange-50", percentText: "text-orange-600", percent: "100%", trend: "17%" },
    { title: t.classes, value: classes.length, subtitle: t.totalClasses, icon: School, iconBg: "bg-violet-500", percentBg: "bg-violet-50", percentText: "text-violet-600", percent: "76%", trend: "17%" },
  ];

  const overviewChartData = useMemo(() => buildMonthlyData({ students, teachers, courses, payements, attendances, predictions }), [students, teachers, courses, payements, attendances, predictions]);

  const attendanceChartData = useMemo(() => {
    const present = attendances.filter((item) => String(item.status || item.statut || item.etat || "").toLowerCase().includes("present") || String(item.status || item.statut || item.etat || "").toLowerCase().includes("présent")).length;
    const absent = attendances.filter((item) => String(item.status || item.statut || item.etat || "").toLowerCase().includes("absent")).length;
    const other = Math.max(attendances.length - present - absent, 0);
    return [
      { name: t.absent, value: absent },
      { name: t.students, value: students.length },
      { name: t.courses, value: courses.length },
      { name: t.teachers, value: teachers.length },
      { name: t.present, value: present },
      { name: t.other, value: other },
    ].filter((item) => item.value > 0);
  }, [attendances, students.length, courses.length, teachers.length, language]);

  const filteredStudents = students.filter((student) => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;
    const fullName = `${student.nom || ""} ${student.prenom || ""}`.toLowerCase();
    const email = String(student.email || "").toLowerCase();
    const classe = String(student.classe?.nom || student.classeName || student.className || student.niveau || "").toLowerCase();
    return fullName.includes(keyword) || email.includes(keyword) || classe.includes(keyword);
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredStudents.length);

  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));
  const pieColors = ["#38bdf8", "#f59e0b", "#14b8a6", "#ef4444", "#0ea5e9", "#22c55e"];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center transition-colors duration-300" style={{ backgroundColor: "var(--app-bg)", color: "var(--text-color)" }} dir={language === "AR" ? "rtl" : "ltr"}>
        <div className="flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-sm" style={cardStyle}>
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-sm font-semibold" style={textStyle}>{t.loadingDashboard}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-5 px-2 pb-4 pt-0 transition-colors duration-300" style={{ backgroundColor: "var(--app-bg)", color: "var(--text-color)" }} dir={language === "AR" ? "rtl" : "ltr"}>
      <div className="relative z-40 -mt-3 flex w-full flex-col gap-5 rounded-[1.7rem] border border-white/15 bg-gradient-to-br from-[#6d28d9] to-[#020617] px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-blue-200">{t.greeting}</p>
          <h1 className="mt-1 truncate text-2xl font-black text-white">{t.welcome}</h1>
          <p className="mt-1 text-sm font-semibold text-slate-300">{t.dashboard}</p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-300 sm:w-72" />
            <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700">
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button type="button" onClick={() => setNotificationOpen((prev) => !prev)} className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white ring-2 ring-[#020617]">{unreadCount > 99 ? "99+" : unreadCount}</span>}
              </button>

              {notificationOpen && (
                <div className={`absolute top-[calc(100%+0.75rem)] z-[999] w-96 overflow-hidden rounded-[1.4rem] border shadow-2xl ${language === "AR" ? "left-0" : "right-0"}`} style={cardStyle}>
                  <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border-color)" }}>
                    <div><h3 className="text-sm font-black">Notifications</h3><p className="text-xs font-semibold" style={mutedTextStyle}>{unreadCount} non lu(s)</p></div>
                    {cleanNotifications.length > 0 && <button type="button" onClick={() => { setNotifications([]); setShowAllNotifications(false); }} className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600 hover:bg-red-100">Clear All</button>}
                  </div>
                  <div className="max-h-80 overflow-y-auto p-3">
                    {displayedNotifications.length > 0 ? displayedNotifications.map((notification, index) => (
                      <button key={notification.notificationId || index} type="button" onClick={() => handleNotificationClick(notification)} className={`mb-3 flex w-full gap-3 rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${notification.read ? "opacity-60" : "opacity-100"}`} style={sectionStyle}>
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${notification.read ? "bg-slate-400" : "bg-blue-600"}`}>{isGmailNotification(notification) ? <Mail className="h-4 w-4" /> : <Bell className="h-4 w-4" />}</div>
                        <div className="min-w-0 flex-1"><p className={`whitespace-normal break-words text-sm leading-6 ${notification.read ? "font-semibold" : "font-black"}`}>{notification.message || "Nouvelle notification reçue"}</p>{notification.createdAt && <p className="mt-2 text-[10px] font-bold" style={mutedTextStyle}>{new Date(notification.createdAt).toLocaleString()}</p>}</div>
                      </button>
                    )) : <div className="rounded-2xl border p-4 text-center" style={sectionStyle}><p className="text-sm font-black">Aucune notification</p></div>}
                    {hiddenNotificationsCount > 0 && !showAllNotifications && <button type="button" onClick={() => setShowAllNotifications(true)} className="mt-1 w-full rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-600 transition hover:bg-blue-100">Afficher plus ({hiddenNotificationsCount})</button>}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button type="button" onClick={() => setAdminMenuOpen((prev) => !prev)} className="flex h-11 min-w-[190px] items-center justify-between gap-3 rounded-full bg-white/10 px-4 text-white ring-1 ring-white/15 transition hover:bg-white/15">
                <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">T</div><div className="hidden min-w-0 text-left sm:block"><p className="truncate text-sm font-black text-white">{t.admin}</p><p className="truncate text-xs font-semibold text-slate-300">{t.administrator}</p></div></div>
                <ChevronDown className={`h-4 w-4 shrink-0 text-slate-300 transition ${adminMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {adminMenuOpen && (
                <div className={`absolute top-[calc(100%+0.75rem)] z-[999] w-64 overflow-hidden rounded-[1.2rem] border shadow-2xl ${language === "AR" ? "left-0" : "right-0"}`} style={cardStyle}>
                  <div className="border-b px-5 py-4" style={{ borderColor: "var(--border-color)" }}><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">T</div><div className="min-w-0"><p className="truncate text-sm font-black">{t.admin}</p><p className="truncate text-xs font-semibold" style={mutedTextStyle}>{t.administratorAccount}</p></div></div></div>
                  <button type="button" onClick={handleKeycloakLogout} className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-black text-red-600 transition hover:bg-red-50"><LogOut className="h-4 w-4" />{t.logout}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-[1.4rem] border p-5 transition hover:-translate-y-1 hover:shadow-md" style={cardStyle}>
              <div className="flex items-start justify-between"><div className="flex items-center gap-5"><div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.iconBg} text-white`}><Icon className="h-5 w-5" /></div><div><h3 className="text-2xl font-black" style={textStyle}>{item.value}</h3><p className="text-xs font-semibold" style={mutedTextStyle}>{item.subtitle}</p></div></div><div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.percentBg}`}><span className={`text-xs font-black ${item.percentText}`}>{item.percent}</span></div></div>
              <div className="mt-5 flex items-center gap-3 text-xs font-semibold"><span style={mutedTextStyle}>{t.last30Days}</span><span className="font-black text-emerald-500">{item.trend}</span><TrendingUp className="h-3 w-3 text-emerald-500" /></div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-[1.4rem] border p-5 xl:col-span-2" style={cardStyle}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-black" style={textStyle}>
              {t.monthlyOverview}
            </h2>

            <div className="flex flex-wrap gap-4 text-xs font-black" style={mutedTextStyle}>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-violet-500" />
                {t.students}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
                {t.teachers}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                {t.courses}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-orange-500" />
                {t.attendance}
              </span>
            </div>
          </div>

          <div className="h-[300px] min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={260}>
              <AreaChart
                data={overviewChartData}
                margin={{ top: 10, right: 15, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="studentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="teachersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="coursesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.18)" />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "14px",
                    color: "#fff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#a855f7"
                  fill="url(#studentsGradient)"
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 2, fill: "#020617" }}
                  activeDot={{ r: 7 }}
                />

                <Area
                  type="monotone"
                  dataKey="teachers"
                  stroke="#3b82f6"
                  fill="url(#teachersGradient)"
                  strokeWidth={3}
                  dot={{ r: 3, strokeWidth: 2, fill: "#020617" }}
                />

                <Area
                  type="monotone"
                  dataKey="courses"
                  stroke="#22c55e"
                  fill="url(#coursesGradient)"
                  strokeWidth={3}
                  dot={{ r: 3, strokeWidth: 2, fill: "#020617" }}
                />

                <Area
                  type="monotone"
                  dataKey="attendances"
                  stroke="#f59e0b"
                  fill="transparent"
                  strokeWidth={3}
                  dot={{ r: 3, strokeWidth: 2, fill: "#020617" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-[1.4rem] border p-5" style={cardStyle}>
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black" style={textStyle}>{t.attendance}</h2><button type="button"><MoreVertical className="h-5 w-5" style={mutedTextStyle} /></button></div>
          <div className="h-72">{attendanceChartData.length > 0 ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={attendanceChartData} cx="50%" cy="50%" innerRadius={35} outerRadius={90} paddingAngle={5} dataKey="value">{attendanceChartData.map((entry, index) => <Cell key={`cell-${entry.name}`} fill={pieColors[index % pieColors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm font-semibold" style={mutedTextStyle}>{t.noAttendanceData}</div>}</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold" style={mutedTextStyle}>{attendanceChartData.map((item, index) => <div key={item.name} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />{item.name}</div>)}</div>
        </div>
      </div>

      <div
        className="overflow-hidden rounded-[1.4rem] border shadow-sm transition-colors duration-300"
        style={cardStyle}
      >
        <div
          className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white">
              <Users size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black" style={textStyle}>
                {t.studentsList}
              </h2>

              <p className="mt-0.5 text-sm font-semibold" style={mutedTextStyle}>
                {t.showing} {filteredStudents.length === 0 ? 0 : startIndex + 1} {t.to}{" "}
                {endIndex} {t.of} {filteredStudents.length} {t.students}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black" style={mutedTextStyle}>
              {t.rows}
            </span>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-xl border px-3 py-2 text-xs font-bold outline-none"
              style={inputStyle}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[24%] px-5 py-4 font-black">{t.student}</th>
                <th className="w-[24%] px-5 py-4 font-black">{t.email}</th>
                <th className="w-[13%] px-5 py-4 font-black">{t.gender}</th>
                <th className="w-[15%] px-5 py-4 font-black">{t.phone}</th>
                <th className="w-[24%] px-5 py-4 font-black">{t.address}</th>
              </tr>
            </thead>

            <tbody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student, index) => {
                  const fullName =
                    `${student.nom || ""} ${student.prenom || ""}`.trim() ||
                    student.name ||
                    "Unknown Student";

                  return (
                    <tr
                      key={student.id || `${fullName}-${index}`}
                      className="border-b text-center text-sm transition last:border-none hover:bg-violet-500/5"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                            {String(fullName || "-").charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 text-center">
                            <p className="truncate font-black" style={textStyle}>
                              {fullName}
                            </p>

                            <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                              {t.student}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="block truncate text-sm font-semibold" style={mutedTextStyle}>
                          {student.email || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-black text-blue-600">
                          {student.genre || student.gender || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="block truncate text-sm font-semibold" style={mutedTextStyle}>
                          {student.telephone || student.phone || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="block truncate text-sm font-semibold" style={mutedTextStyle}>
                          {student.adresse || student.address || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center font-bold" style={mutedTextStyle}>
                    {t.noStudents}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          className="flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <p className="text-xs font-semibold" style={mutedTextStyle}>
            {t.showing} {filteredStudents.length === 0 ? 0 : startIndex + 1} {t.to}{" "}
            {endIndex} {t.of} {filteredStudents.length} {t.students}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-black transition"
                style={{
                  backgroundColor:
                    currentPage === pageNumber
                      ? "var(--secondary-color)"
                      : "var(--input-bg)",
                  borderColor: "var(--border-color)",
                  color: currentPage === pageNumber ? "#ffffff" : "var(--text-color)",
                }}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronRight size={16} />
            </button>

            <span className="rounded-xl px-4 py-2 text-xs font-black" style={inputStyle}>
              {t.page} {currentPage} / {totalPages}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}