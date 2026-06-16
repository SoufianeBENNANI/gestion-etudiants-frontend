import { useEffect, useMemo, useState } from "react";
import ArchivedAttendance from "./ArchivedAttendance";
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCcw,
  Search,
  Users,
  XCircle,
  Activity,
  Archive,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

import { getAllStudents } from "../services/studentService";
import { getAllAttendances } from "../services/attendanceService";

const translations = {
  EN: {
    management: "Students Management",
    title: "Student Attendance",
    subtitle: "View attendance records directly from the database.",

    refresh: "Refresh",
    archive: "Archive",
    lastUpdated: "Last updated:",
    waitingData: "Waiting for data...",

    totalStudents: "Total Students",
    presentStudents: "Present Students",
    absentStudents: "Absent Students",
    lateStudents: "Late Students",

    records: "Records",
    present: "Present",
    absent: "Absent",
    late: "Late",

    attendanceSummary: "Attendance Summary",
    attendanceSummaryDescription:
      "Dynamic overview calculated from students and attendance records.",
    totalRecords: "Total Records",
    attendanceRate: "Attendance Rate",
    lastSync: "Last Sync",

    liveSync: "Live Sync",
    liveSyncDescription:
      "This page refreshes automatically every 10 seconds. When a teacher adds attendance, the admin dashboard updates without reloading the page.",

    attendanceRecords: "Attendance Records",
    showing: "Showing",
    to: "to",
    of: "of",
    attendanceRecord: "attendance record",
    attendanceRecordsPlural: "attendance records",

    searchPlaceholder: "Search attendance...",
    rows: "Rows:",
    student: "Student",
    email: "Email",
    date: "Date",
    status: "Status",
    id: "ID",

    loadingAttendance: "Loading attendance...",
    noAttendance: "No attendance records found.",
    loadError: "Error while loading attendance data",

    page: "Page",
    previous: "Previous",
    next: "Next",
  },

  FR: {
    management: "Gestion des étudiants",
    title: "Présence des étudiants",
    subtitle:
      "Consulter les enregistrements de présence directement depuis la base de données.",

    refresh: "Actualiser",
    archive: "Archive",
    lastUpdated: "Dernière mise à jour :",
    waitingData: "En attente des données...",

    totalStudents: "Total étudiants",
    presentStudents: "Étudiants présents",
    absentStudents: "Étudiants absents",
    lateStudents: "Étudiants en retard",

    records: "Dossiers",
    present: "Présent",
    absent: "Absent",
    late: "Retard",

    attendanceSummary: "Résumé des présences",
    attendanceSummaryDescription:
      "Aperçu dynamique calculé à partir des étudiants et des enregistrements de présence.",
    totalRecords: "Total des enregistrements",
    attendanceRate: "Taux de présence",
    lastSync: "Dernière synchronisation",

    liveSync: "Synchronisation en direct",
    liveSyncDescription:
      "Cette page s’actualise automatiquement toutes les 10 secondes. Lorsqu’un professeur ajoute une présence, le tableau de bord admin se met à jour sans recharger la page.",

    attendanceRecords: "Enregistrements de présence",
    showing: "Affichage",
    to: "à",
    of: "sur",
    attendanceRecord: "enregistrement de présence",
    attendanceRecordsPlural: "enregistrements de présence",

    searchPlaceholder: "Rechercher une présence...",
    rows: "Lignes :",
    student: "Étudiant",
    email: "Email",
    date: "Date",
    status: "Statut",
    id: "ID",

    loadingAttendance: "Chargement des présences...",
    noAttendance: "Aucun enregistrement de présence trouvé.",
    loadError: "Erreur lors du chargement des données de présence",

    page: "Page",
    previous: "Précédent",
    next: "Suivant",
  },

  AR: {
    management: "إدارة الطلاب",
    title: "حضور الطلاب",
    subtitle: "عرض سجلات الحضور مباشرة من قاعدة البيانات.",

    refresh: "تحديث",
    archive: "الأرشيف",
    lastUpdated: "آخر تحديث:",
    waitingData: "في انتظار البيانات...",

    totalStudents: "إجمالي الطلاب",
    presentStudents: "الطلاب الحاضرون",
    absentStudents: "الطلاب الغائبون",
    lateStudents: "الطلاب المتأخرون",

    records: "السجلات",
    present: "حاضر",
    absent: "غائب",
    late: "متأخر",

    attendanceSummary: "ملخص الحضور",
    attendanceSummaryDescription:
      "نظرة ديناميكية محسوبة من الطلاب وسجلات الحضور.",
    totalRecords: "إجمالي السجلات",
    attendanceRate: "نسبة الحضور",
    lastSync: "آخر مزامنة",

    liveSync: "مزامنة مباشرة",
    liveSyncDescription:
      "يتم تحديث هذه الصفحة تلقائيًا كل 10 ثوانٍ. عندما يضيف الأستاذ الحضور، يتم تحديث لوحة تحكم الإدارة بدون إعادة تحميل الصفحة.",

    attendanceRecords: "سجلات الحضور",
    showing: "عرض",
    to: "إلى",
    of: "من",
    attendanceRecord: "سجل حضور",
    attendanceRecordsPlural: "سجلات حضور",

    searchPlaceholder: "البحث في الحضور...",
    rows: "الأسطر:",
    student: "الطالب",
    email: "البريد الإلكتروني",
    date: "التاريخ",
    status: "الحالة",
    id: "المعرف",

    loadingAttendance: "جاري تحميل الحضور...",
    noAttendance: "لا توجد سجلات حضور.",
    loadError: "حدث خطأ أثناء تحميل بيانات الحضور",

    page: "الصفحة",
    previous: "السابق",
    next: "التالي",
  },
};

export default function StudentAttendance() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [students, setStudents] = useState([]);
  const [attendances, setAttendances] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [autoRefreshing, setAutoRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const loadData = async (silent = false) => {
    try {
      if (silent) {
        setAutoRefreshing(true);
      } else {
        setLoading(true);
      }

      const [studentsData, attendancesData] = await Promise.all([
        getAllStudents(),
        getAllAttendances(),
      ]);

      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setAttendances(Array.isArray(attendancesData) ? attendancesData : []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Load attendance error:", error);

      if (!silent) {
        alert(t.loadError);
      }
    } finally {
      setLoading(false);
      setAutoRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    const intervalId = setInterval(() => {
      loadData(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDateOnly = (value) => {
    if (!value) return "-";
    return String(value).substring(0, 10);
  };

  const normalizeStatus = (status) => {
    return String(status || "").trim().toUpperCase();
  };

  const getStudentName = (item) => {
    return `${item.studentNom || ""} ${item.studentPrenom || ""}`.trim() || "-";
  };

  const getStudentEmail = (item) => {
    return item.studentEmail || "-";
  };

  const getStudentId = (item) => {
    return item.studentId || item.student?.id || item.idStudent || null;
  };

  const countAttendanceRecordsByStatus = (status) => {
    return attendances.filter(
      (item) => normalizeStatus(item.status) === status
    ).length;
  };

  const filteredAttendances = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return attendances;

    return attendances.filter((item) => {
      const studentName = getStudentName(item).toLowerCase();
      const email = String(getStudentEmail(item)).toLowerCase();
      const status = String(item.status || "").toLowerCase();
      const date = String(item.date || "").toLowerCase();

      return (
        studentName.includes(value) ||
        email.includes(value) ||
        status.includes(value) ||
        date.includes(value)
      );
    });
  }, [attendances, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAttendances.length / itemsPerPage)
  );

  const paginatedAttendances = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAttendances.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAttendances, currentPage, itemsPerPage]);

  const startRecord =
    filteredAttendances.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endRecord = Math.min(
    currentPage * itemsPerPage,
    filteredAttendances.length
  );

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleChangeItemsPerPage = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const totalStudents = students.length;
  const totalRecords = attendances.length;

  const absentStudents = countAttendanceRecordsByStatus("ABSENT");
  const lateStudents = countAttendanceRecordsByStatus("LATE");

  const presentStudents = Math.max(
    totalStudents - absentStudents - lateStudents,
    0
  );

  const attendanceRate =
    totalStudents === 0
      ? 0
      : Math.round((presentStudents / totalStudents) * 100);

  const getStatusBadge = (status) => {
    const value = normalizeStatus(status);

    if (value === "PRESENT") {
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }

    if (value === "ABSENT") {
      return "bg-red-50 text-red-700 ring-red-200";
    }

    if (value === "LATE") {
      return "bg-amber-50 text-amber-700 ring-amber-200";
    }

    return "bg-slate-100 text-slate-600 ring-slate-200";
  };

  const statCards = [
    {
      title: t.totalStudents,
      value: totalStudents,
      icon: Users,
      iconBg: "bg-orange-500",
      percentBg: "bg-orange-50",
      percentText: "text-orange-600",
      percent: "76%",
      trend: "17%",
    },
    {
      title: t.presentStudents,
      value: presentStudents,
      icon: CheckCircle,
      iconBg: "bg-blue-500",
      percentBg: "bg-blue-50",
      percentText: "text-blue-600",
      percent: "73%",
      trend: "22%",
    },
    {
      title: t.absentStudents,
      value: absentStudents,
      icon: XCircle,
      iconBg: "bg-red-500",
      percentBg: "bg-red-50",
      percentText: "text-red-600",
      percent: "12%",
      trend: "0.9%",
    },
    {
      title: t.lateStudents,
      value: lateStudents,
      icon: Clock,
      iconBg: "bg-amber-500",
      percentBg: "bg-amber-50",
      percentText: "text-amber-600",
      percent: "8%",
      trend: "1.4%",
    },
  ];

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
        className="flex flex-col gap-4 rounded-[1.7rem] border px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between"
        style={{
          borderColor: "var(--border-color)",
          background:
            "linear-gradient(135deg, var(--secondary-color), #020617)",
        }}
      >
        <div>
          <p className="text-xs font-semibold text-blue-200">
            {t.management}
          </p>

          <h1 className="mt-1 text-2xl font-black text-white">{t.title}</h1>

          <p className="mt-1 text-sm font-semibold text-slate-300">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => loadData()}
              disabled={loading || autoRefreshing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 shadow-sm transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading || autoRefreshing ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <RefreshCcw size={17} />
              )}
              {t.refresh}
            </button>

            <button
              type="button"
              onClick={() => setOpenArchiveDialog(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 shadow-sm transition hover:bg-white/15"
            >
              <Archive size={17} />
              {t.archive}
            </button>
          </div>

          <p className="text-xs font-semibold text-slate-300">
            {lastUpdated
              ? `${t.lastUpdated} ${lastUpdated.toLocaleTimeString()}`
              : t.waitingData}
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-[1.4rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              style={cardStyle}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${card.iconBg} text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black" style={textStyle}>
                      {loading ? "..." : card.value}
                    </h3>

                    <p className="text-xs font-semibold" style={mutedTextStyle}>
                      {card.title}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${card.percentBg}`}
                >
                  <span className={`text-[11px] font-black ${card.percentText}`}>
                    {card.percent}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 text-xs font-semibold">
                <span style={mutedTextStyle}>Last 30 days</span>

                <span className="font-black text-emerald-500">
                  {card.trend}
                </span>

                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div
          className="rounded-[1.4rem] border p-5 shadow-sm xl:col-span-2"
          style={cardStyle}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
              <Calendar size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.attendanceSummary}
              </h2>

              <p className="text-xs font-semibold" style={mutedTextStyle}>
                {t.attendanceSummaryDescription}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl p-4" style={sectionStyle}>
              <p className="text-xs font-bold" style={mutedTextStyle}>
                {t.totalRecords}
              </p>

              <p className="mt-2 text-2xl font-black" style={textStyle}>
                {loading ? "..." : totalRecords}
              </p>
            </div>

            <div className="rounded-2xl p-4" style={sectionStyle}>
              <p className="text-xs font-bold" style={mutedTextStyle}>
                {t.attendanceRate}
              </p>

              <p className="mt-2 text-2xl font-black" style={textStyle}>
                {loading ? "..." : `${attendanceRate}%`}
              </p>
            </div>

            <div className="rounded-2xl p-4" style={sectionStyle}>
              <p className="text-xs font-bold" style={mutedTextStyle}>
                {t.lastSync}
              </p>

              <p className="mt-2 text-2xl font-black" style={textStyle}>
                {lastUpdated ? lastUpdated.toLocaleTimeString() : "-"}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-[1.4rem] border p-5 text-white shadow-sm"
          style={{
            borderColor: "var(--border-color)",
            background:
              "linear-gradient(135deg, var(--secondary-color), #020617)",
          }}
        >
          <div className="flex items-center gap-3">
            <Activity size={22} className="text-blue-300" />

            <h2 className="text-lg font-black">{t.liveSync}</h2>
          </div>

          <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">
            {t.liveSyncDescription}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div
        className="overflow-hidden rounded-[1.4rem] border shadow-sm transition-colors duration-300"
        style={cardStyle}
      >
        <div
          className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
              <Calendar size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.attendanceRecords}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startRecord} {t.to} {endRecord} {t.of}{" "}
                {filteredAttendances.length}{" "}
                {filteredAttendances.length > 1
                  ? t.attendanceRecordsPlural
                  : t.attendanceRecord}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="flex h-11 items-center gap-2 rounded-full border px-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent text-sm font-semibold outline-none sm:w-64"
                style={{
                  color: "var(--text-color)",
                }}
              />

              <Search className="h-4 w-4" style={mutedTextStyle} />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black" style={mutedTextStyle}>
                {t.rows}
              </span>

              <select
                value={itemsPerPage}
                onChange={handleChangeItemsPerPage}
                className="rounded-xl border px-3 py-2 text-xs font-bold outline-none transition"
                style={inputStyle}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[28%] px-5 py-4 font-black">{t.student}</th>
                <th className="w-[30%] px-5 py-4 font-black">{t.email}</th>
                <th className="w-[16%] px-5 py-4 font-black">{t.date}</th>
                <th className="w-[14%] px-5 py-4 font-black">{t.status}</th>
                <th className="w-[12%] px-5 py-4 font-black">{t.id}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center">
                    <div
                      className="flex items-center justify-center gap-2 text-sm font-bold"
                      style={mutedTextStyle}
                    >
                      <Loader2 size={18} className="animate-spin" />
                      {t.loadingAttendance}
                    </div>
                  </td>
                </tr>
              ) : filteredAttendances.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.noAttendance}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedAttendances.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b text-center text-sm transition last:border-none hover:bg-slate-50/40"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                          {String(getStudentName(item)).charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 text-center">
                          <p className="truncate font-black" style={textStyle}>
                            {getStudentName(item)}
                          </p>

                          <p
                            className="mt-0.5 text-xs font-semibold"
                            style={mutedTextStyle}
                          >
                            {t.student}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="block truncate text-sm font-semibold"
                        style={mutedTextStyle}
                      >
                        {getStudentEmail(item)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="block truncate text-sm font-semibold"
                        style={mutedTextStyle}
                      >
                        {formatDateOnly(item.date)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ring-1 ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {normalizeStatus(item.status) || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-black" style={textStyle}>
                        {getStudentId(item) || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div
          className="flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <p className="text-xs font-semibold" style={mutedTextStyle}>
            {t.showing}{" "}
            <span className="font-black" style={textStyle}>
              {startRecord}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endRecord}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {filteredAttendances.length}
            </span>{" "}
            {filteredAttendances.length > 1
              ? t.attendanceRecordsPlural
              : t.attendanceRecord}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-black transition"
                style={{
                  backgroundColor:
                    currentPage === page
                      ? "var(--secondary-color)"
                      : "var(--input-bg)",
                  borderColor: "var(--border-color)",
                  color: currentPage === page ? "#ffffff" : "var(--text-color)",
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronRight size={16} />
            </button>

            <span
              className="rounded-xl px-4 py-2 text-xs font-black"
              style={inputStyle}
            >
              {t.page} {currentPage} / {totalPages}
            </span>
          </div>
        </div>
      </div>

      <ArchivedAttendance
        open={openArchiveDialog}
        onClose={() => setOpenArchiveDialog(false)}
        onRestored={(restoredAttendance) => {
          setAttendances((prev) => [restoredAttendance, ...prev]);
          loadData(true);
        }}
      />
    </div>
  );
}