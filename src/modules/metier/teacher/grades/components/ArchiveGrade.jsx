import { useEffect, useMemo, useState } from "react";
import {
  X,
  RotateCcw,
  Archive,
  Loader2,
  Search,
  RefreshCcw,
  Layers3,
} from "lucide-react";

import { getArchivedGrades, restoreGrade } from "../services/gradeService";

const headerGradient =
  "linear-gradient(180deg, #3b2c8f 0%, #4c1d95 45%, #581c87 100%)";

const translations = {
  EN: {
    management: "Grades Management",
    title: "Archived Grades",
    subtitle: "Restore archived student grades.",
    listTitle: "Archived Grades List",
    showing: "Showing",
    archived: "archived grades",
    search: "Search archive...",
    refresh: "Refresh",
    loading: "Loading archived grades...",
    empty: "No archived grades found.",
    student: "Student",
    course: "Course",
    note: "Note",
    semestre: "Semester",
    action: "Action",
    restore: "Restore",
    close: "Close",
  },
  FR: {
    management: "Gestion des notes",
    title: "Notes archivées",
    subtitle: "Restaurer les notes archivées des étudiants.",
    listTitle: "Liste des notes archivées",
    showing: "Affichage de",
    archived: "notes archivées",
    search: "Rechercher archive...",
    refresh: "Actualiser",
    loading: "Chargement des notes archivées...",
    empty: "Aucune note archivée trouvée.",
    student: "Étudiant",
    course: "Cours",
    note: "Note",
    semestre: "Semestre",
    action: "Action",
    restore: "Restaurer",
    close: "Fermer",
  },
  AR: {
    management: "إدارة النقط",
    title: "النقط المؤرشفة",
    subtitle: "استرجاع النقط المؤرشفة للطلاب.",
    listTitle: "قائمة النقط المؤرشفة",
    showing: "عرض",
    archived: "نقط مؤرشفة",
    search: "البحث في الأرشيف...",
    refresh: "تحديث",
    loading: "جاري تحميل النقط المؤرشفة...",
    empty: "لا توجد نقط مؤرشفة.",
    student: "الطالب",
    course: "المادة",
    note: "النقطة",
    semestre: "السداسي",
    action: "الإجراء",
    restore: "استرجاع",
    close: "إغلاق",
  },
};

export default function ArchiveGrade({ open, onClose, onRestored }) {
  const [archivedGrades, setArchivedGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail || localStorage.getItem("app-language") || "EN");
    };

    window.addEventListener("app-language-change", handleLanguageChange);
    return () =>
      window.removeEventListener("app-language-change", handleLanguageChange);
  }, []);

  const loadArchivedGrades = async () => {
    try {
      setLoading(true);
      const data = await getArchivedGrades();
      setArchivedGrades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load archived grades error:", error);
      setArchivedGrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadArchivedGrades();
  }, [open]);

  const filteredGrades = useMemo(() => {
    const value = searchTerm.toLowerCase().trim();

    if (!value) return archivedGrades;

    return archivedGrades.filter((grade) => {
      return (
        String(grade.id || "").includes(value) ||
        String(grade.studentName || "").toLowerCase().includes(value) ||
        String(grade.courseName || "").toLowerCase().includes(value) ||
        String(grade.note || "").toLowerCase().includes(value) ||
        String(grade.semestre || "").toLowerCase().includes(value)
      );
    });
  }, [archivedGrades, searchTerm]);

  const handleRestore = async (grade) => {
    if (!grade?.id) return;

    try {
      setRestoringId(grade.id);
      const restoredGrade = await restoreGrade(grade.id);

      setArchivedGrades((prev) =>
        prev.filter((item) => item.id !== grade.id)
      );

      if (onRestored) await onRestored(restoredGrade || grade);
    } catch (error) {
      console.error("Restore grade error:", error);
      alert("Error while restoring grade");
    } finally {
      setRestoringId(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-6xl overflow-hidden rounded-[2rem] shadow-2xl transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden rounded-t-[2rem] px-7 py-7 text-white"
          style={{ background: headerGradient }}
        >
          <div
            className={`relative flex items-center justify-between gap-5 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-center gap-4 ${
                isArabic ? "flex-row-reverse text-right" : "text-left"
              }`}
            >
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
                <p className="mt-2 text-xs text-slate-300">{t.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              title={t.close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          className={`flex flex-col gap-4 border-b px-6 py-5 md:flex-row md:items-center md:justify-between ${
            isArabic ? "md:flex-row-reverse" : ""
          }`}
          style={{
            backgroundColor: "var(--section-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <div
            className={`flex items-center gap-3 ${
              isArabic ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
              style={{ background: headerGradient }}
            >
              <Layers3 size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black">{t.listTitle}</h3>
              <p className="mt-1 text-xs" style={{ color: "var(--muted-text)" }}>
                {t.showing} {filteredGrades.length} {t.archived}
              </p>
            </div>
          </div>

          <div
            className={`flex flex-col gap-2 sm:flex-row sm:items-center ${
              isArabic ? "sm:flex-row-reverse" : ""
            }`}
          >
            <div className="relative">
              <Search
                size={17}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                  isArabic ? "right-4" : "left-4"
                }`}
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.search}
                className={`w-full rounded-2xl border py-2.5 text-sm font-semibold outline-none transition placeholder:text-slate-400 sm:w-72 ${
                  isArabic ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                }`}
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-color)",
                  borderColor: "var(--border-color)",
                }}
              />
            </div>

            <button
              type="button"
              onClick={loadArchivedGrades}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: headerGradient }}
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

        <div className="max-h-[430px] overflow-y-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr
                className={`text-sm ${isArabic ? "text-right" : "text-left"}`}
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="px-6 py-4 font-black">{t.student}</th>
                <th className="px-6 py-4 font-black">{t.course}</th>
                <th className="px-6 py-4 font-black">{t.note}</th>
                <th className="px-6 py-4 font-black">{t.semestre}</th>
                <th
                  className={`px-6 py-4 font-black ${
                    isArabic ? "text-left" : "text-right"
                  }`}
                >
                  {t.action}
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <div
                      className="flex items-center justify-center gap-2 font-bold"
                      style={{ color: "var(--muted-text)" }}
                    >
                      <Loader2 size={20} className="animate-spin" />
                      {t.loading}
                    </div>
                  </td>
                </tr>
              ) : filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <span
                      className="font-bold"
                      style={{ color: "var(--muted-text)" }}
                    >
                      {t.empty}
                    </span>
                  </td>
                </tr>
              ) : (
                filteredGrades.map((grade) => (
                  <tr
                    key={grade.id}
                    className={`border-t text-sm transition ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <td className="px-6 py-4 font-black">
                      {grade.studentName || `ID ${grade.studentId || "-"}`}
                    </td>

                    <td className="px-6 py-4">
                      {grade.courseName || `ID ${grade.courseId || "-"}`}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className="inline-flex rounded-full px-3 py-1 text-xs font-black"
                        style={{
                          backgroundColor: "var(--section-bg)",
                          color: "var(--primary-color)",
                        }}
                      >
                        {grade.note ?? "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">{grade.semestre || "-"}</td>

                    <td
                      className={`px-6 py-4 ${
                        isArabic ? "text-left" : "text-right"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleRestore(grade)}
                        disabled={restoringId === grade.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ background: headerGradient }}
                      >
                        {restoringId === grade.id ? (
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