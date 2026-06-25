import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Calendar,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import {
  getArchivedAttendances,
  restoreAttendance,
} from "../services/attendanceService";

const translations = {
  EN: {
    management: "Students Management",
    title: "Archived Attendance",
    subtitle: "View and restore archived attendance records.",

    listTitle: "Archived Attendance List",
    showing: "Showing",
    archivedAttendanceRecords: "archived attendance records",

    searchPlaceholder: "Search archive...",
    refresh: "Refresh",
    restore: "Restore",

    student: "Student",
    email: "Email",
    date: "Date",
    status: "Status",
    studentId: "Student ID",
    action: "Action",

    loading: "Loading archived attendance...",
    empty: "No archived attendance found.",

    restoreError: "Error while restoring attendance",
  },

  FR: {
    management: "Gestion des étudiants",
    title: "Présences archivées",
    subtitle: "Voir et restaurer les enregistrements de présence archivés.",

    listTitle: "Liste des présences archivées",
    showing: "Affichage de",
    archivedAttendanceRecords: "enregistrements de présence archivés",

    searchPlaceholder: "Rechercher dans l’archive...",
    refresh: "Actualiser",
    restore: "Restaurer",

    student: "Étudiant",
    email: "Email",
    date: "Date",
    status: "Statut",
    studentId: "ID étudiant",
    action: "Action",

    loading: "Chargement des présences archivées...",
    empty: "Aucune présence archivée trouvée.",

    confirmRestore: "Restaurer cet enregistrement de présence ?",
    restoreError: "Erreur lors de la restauration de la présence",
  },

  AR: {
    management: "إدارة الطلاب",
    title: "الحضور المؤرشف",
    subtitle: "عرض واستعادة سجلات الحضور المؤرشفة.",

    listTitle: "قائمة الحضور المؤرشف",
    showing: "عرض",
    archivedAttendanceRecords: "سجلات حضور مؤرشفة",

    searchPlaceholder: "البحث في الأرشيف...",
    refresh: "تحديث",
    restore: "استعادة",

    student: "الطالب",
    email: "البريد الإلكتروني",
    date: "التاريخ",
    status: "الحالة",
    studentId: "معرف الطالب",
    action: "الإجراء",

    loading: "جاري تحميل الحضور المؤرشف...",
    empty: "لا توجد سجلات حضور مؤرشفة.",

    confirmRestore: "هل تريد استعادة سجل الحضور هذا؟",
    restoreError: "حدث خطأ أثناء استعادة الحضور",
  },
};

export default function ArchivedAttendance({ open, onClose, onRestored }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [attendances, setAttendances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

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

  const loadArchivedAttendances = async () => {
    try {
      setLoading(true);

      const data = await getArchivedAttendances();
      setAttendances(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading archived attendance:", error);
      setAttendances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadArchivedAttendances();
    }
  }, [open]);

  const formatDateOnly = (value) => {
    if (!value) return "-";
    return String(value).substring(0, 10);
  };

  const normalizeStatus = (status) => {
    return String(status || "").trim().toUpperCase();
  };

  const getStudentName = (item) => {
    return (
      `${item.studentNom || ""} ${item.studentPrenom || ""}`.trim() ||
      item.studentName ||
      "-"
    );
  };

  const getStudentEmail = (item) => {
    return item.studentEmail || item.email || "-";
  };

  const getStudentId = (item) => {
    return item.studentId || item.student?.id || item.idStudent || "-";
  };

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

  const handleRestore = async (attendance) => {
    if (!window.confirm(t.confirmRestore)) return;

    try {
      setRestoringId(attendance.id);

      const restoredAttendance = await restoreAttendance(attendance.id);

      setAttendances((prev) =>
        prev.filter((item) => item.id !== attendance.id)
      );

      if (onRestored) {
        onRestored(restoredAttendance || attendance);
      }
    } catch (error) {
      console.error("Error restoring attendance:", error);
      alert(t.restoreError);
    } finally {
      setRestoringId(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-6xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <Archive size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-blue-200">
                  {t.management}
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  {t.title}
                </h2>

                <p className="mt-2 text-xs text-slate-300">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Calendar size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                {t.listTitle}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {t.showing} {filteredAttendances.length}{" "}
                {t.archivedAttendanceRecords}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 sm:w-72"
              />
            </div>

            <button
              type="button"
              onClick={loadArchivedAttendances}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <RefreshCcw size={17} />
              )}
              {t.refresh}
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="max-h-[430px] overflow-y-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-white text-left text-sm text-slate-600">
                <th className="px-6 py-4 font-black">{t.student}</th>
                <th className="px-6 py-4 font-black">{t.email}</th>
                <th className="px-6 py-4 font-black">{t.date}</th>
                <th className="px-6 py-4 font-black">{t.status}</th>
                <th className="px-6 py-4 font-black">{t.studentId}</th>
                <th className="px-6 py-4 text-right font-black">
                  {t.action}
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 font-bold text-slate-600">
                      <Loader2 size={20} className="animate-spin" />
                      {t.loading}
                    </div>
                  </td>
                </tr>
              ) : filteredAttendances.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center font-bold text-slate-600"
                  >
                    {t.empty}
                  </td>
                </tr>
              ) : (
                filteredAttendances.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-black text-slate-900">
                      {getStudentName(item)}
                    </td>

                    <td className="px-6 py-4">{getStudentEmail(item)}</td>

                    <td className="px-6 py-4">{formatDateOnly(item.date)}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {normalizeStatus(item.status) || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">{getStudentId(item)}</td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRestore(item)}
                        disabled={restoringId === item.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {restoringId === item.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <RotateCcw size={16} />
                        )}
                        {t.restore}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}