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
      iconClass: "bg-blue-600 text-white",
      badge: t.records,
      badgeClass: "bg-blue-50 text-blue-600",
    },
    {
      title: t.presentStudents,
      value: presentStudents,
      icon: CheckCircle,
      iconClass: "bg-emerald-600 text-white",
      badge: t.present,
      badgeClass: "bg-emerald-50 text-emerald-700",
    },
    {
      title: t.absentStudents,
      value: absentStudents,
      icon: XCircle,
      iconClass: "bg-red-600 text-white",
      badge: t.absent,
      badgeClass: "bg-red-50 text-red-700",
    },
    {
      title: t.lateStudents,
      value: lateStudents,
      icon: Clock,
      iconClass: "bg-amber-500 text-white",
      badge: t.late,
      badgeClass: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div
      className="min-h-screen space-y-6 transition-colors duration-300"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      {/* HEADER */}
      <div
        className="relative overflow-hidden rounded-[1.7rem] border px-6 py-6 text-white shadow-sm"
        style={{
          borderColor: "var(--border-color)",
          background:
            "linear-gradient(135deg, var(--secondary-color), #020617)",
        }}
      >
        <div
          className="absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--primary-color)", opacity: 0.2 }}
        />
        <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <Bell size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-blue-200">
                {t.management}
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                {t.title}
              </h1>

              <p className="mt-2 text-xs text-slate-300">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:items-end">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => loadData()}
                disabled={loading || autoRefreshing}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <Archive size={17} />
                {t.archive}
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {lastUpdated
                ? `${t.lastUpdated} ${lastUpdated.toLocaleTimeString()}`
                : t.waitingData}
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={cardStyle}
            >
              <div className="mb-5 flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconClass}`}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-black ${card.badgeClass}`}
                >
                  {card.badge}
                </span>
              </div>

              <p className="text-sm font-black" style={textStyle}>
                {card.title}
              </p>

              <h2 className="mt-3 text-2xl font-black" style={textStyle}>
                {loading ? "..." : card.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div
          className="rounded-2xl border p-5 shadow-sm xl:col-span-2"
          style={cardStyle}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <Calendar size={22} />
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
          className="rounded-2xl border p-5 text-white shadow-sm"
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

          <p className="mt-3 text-sm leading-6 text-slate-300">
            {t.liveSyncDescription}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div
        className="overflow-hidden rounded-2xl border shadow-sm transition-colors duration-300"
        style={cardStyle}
      >
        <div
          className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <Calendar size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.attendanceRecords}
              </h2>

              <p className="mt-0.5 text-xs" style={mutedTextStyle}>
                {t.showing} {startRecord} {t.to} {endRecord} {t.of}{" "}
                {filteredAttendances.length}{" "}
                {filteredAttendances.length > 1
                  ? t.attendanceRecordsPlural
                  : t.attendanceRecord}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={mutedTextStyle}
              />

              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-2xl border py-2.5 pl-10 pr-4 text-sm font-semibold outline-none transition sm:w-72"
                style={inputStyle}
              />
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

        {loading ? (
          <div
            className="flex items-center justify-center gap-2 p-10 text-sm font-bold"
            style={mutedTextStyle}
          >
            <Loader2 size={18} className="animate-spin" />
            {t.loadingAttendance}
          </div>
        ) : filteredAttendances.length === 0 ? (
          <div
            className="p-10 text-center text-sm font-bold"
            style={mutedTextStyle}
          >
            {t.noAttendance}
          </div>
        ) : (
          <>
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr
                  className="text-center text-[11px] uppercase tracking-wide"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--muted-text)",
                  }}
                >
                  <th className="w-[28%] px-3 py-3 font-black">
                    {t.student}
                  </th>
                  <th className="w-[30%] px-3 py-3 font-black">
                    {t.email}
                  </th>
                  <th className="w-[16%] px-3 py-3 font-black">{t.date}</th>
                  <th className="w-[14%] px-3 py-3 font-black">
                    {t.status}
                  </th>
                  <th className="w-[12%] px-3 py-3 font-black">{t.id}</th>
                </tr>
              </thead>

              <tbody>
                {paginatedAttendances.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t text-center text-sm transition"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <td className="px-3 py-3">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                        <div
                          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-white sm:flex"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          <Users size={17} />
                        </div>

                        <span className="truncate font-black" style={textStyle}>
                          {getStudentName(item)}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span className="block truncate" style={mutedTextStyle}>
                        {getStudentEmail(item)}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className="block truncate font-semibold"
                        style={mutedTextStyle}
                      >
                        {formatDateOnly(item.date)}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {normalizeStatus(item.status) || "-"}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className="font-black" style={textStyle}>
                        {getStudentId(item) || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div
              className="flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
              style={sectionStyle}
            >
              <p className="text-xs font-semibold" style={mutedTextStyle}>
                {t.page}{" "}
                <span className="font-black" style={textStyle}>
                  {currentPage}
                </span>{" "}
                {t.of}{" "}
                <span className="font-black" style={textStyle}>
                  {totalPages}
                </span>
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={inputStyle}
                >
                  <ChevronLeft size={16} />
                  {t.previous}
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
                      color:
                        currentPage === page
                          ? "#ffffff"
                          : "var(--text-color)",
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={inputStyle}
                >
                  {t.next}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
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