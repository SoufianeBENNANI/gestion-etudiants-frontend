import { useEffect, useState } from "react";
import {
  Archive,
  GraduationCap,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import { getArchivedGrades, restoreGrade } from "../services/gradeService";

const translations = {
  EN: {
    management: "Academics Management",
    title: "Archived Grades",
    subtitle: "View and restore archived grade records.",

    listTitle: "Archived Grades List",
    showing: "Showing",
    archivedGrades: "archived grades",

    searchPlaceholder: "Search archive...",
    refresh: "Refresh",

    student: "Student",
    course: "Course",
    semester: "Semester",
    note: "Note",
    action: "Action",

    loadingGrades: "Loading archived grades...",
    noGrades: "No archived grades found.",

    restore: "Restore",
    restoreError: "Error while restoring the grade",

    notAvailable: "N/A",
  },

  FR: {
    management: "Gestion académique",
    title: "Notes archivées",
    subtitle: "Voir et restaurer les notes archivées.",

    listTitle: "Liste des notes archivées",
    showing: "Affichage de",
    archivedGrades: "notes archivées",

    searchPlaceholder: "Rechercher dans l’archive...",
    refresh: "Actualiser",

    student: "Étudiant",
    course: "Cours",
    semester: "Semestre",
    note: "Note",
    action: "Action",

    loadingGrades: "Chargement des notes archivées...",
    noGrades: "Aucune note archivée trouvée.",

    restore: "Restaurer",
    restoreError: "Erreur lors de la restauration de la note",

    notAvailable: "N/A",
  },

  AR: {
    management: "الإدارة الأكاديمية",
    title: "النقط المؤرشفة",
    subtitle: "عرض واستعادة سجلات النقط المؤرشفة.",

    listTitle: "قائمة النقط المؤرشفة",
    showing: "عرض",
    archivedGrades: "نقط مؤرشفة",

    searchPlaceholder: "البحث في الأرشيف...",
    refresh: "تحديث",

    student: "الطالب",
    course: "المادة",
    semester: "الفصل",
    note: "النقطة",
    action: "الإجراء",

    loadingGrades: "جاري تحميل النقط المؤرشفة...",
    noGrades: "لا توجد نقط مؤرشفة.",

    restore: "استعادة",
    restoreError: "حدث خطأ أثناء استعادة النقطة",

    notAvailable: "N/A",
  },
};

export default function ArchivedGrades({ open, onClose, onRestored }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [grades, setGrades] = useState([]);
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

  const loadArchivedGrades = async () => {
    try {
      setLoading(true);

      const data = await getArchivedGrades();
      setGrades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading archived grades:", error);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadArchivedGrades();
    }
  }, [open]);

  const getStudentName = (grade) => {
    return (
      grade.studentName ||
      `${grade.student?.prenom || ""} ${grade.student?.nom || ""}`.trim() ||
      t.notAvailable
    );
  };

  const getCourseName = (grade) => {
    return (
      grade.courseName ||
      grade.courses?.nom ||
      grade.course?.nom ||
      grade.courses?.name ||
      grade.course?.name ||
      t.notAvailable
    );
  };

  const filteredGrades = grades.filter((grade) => {
    const note = String(grade.note ?? "");
    const semestre = String(grade.semestre || "");
    const studentName = getStudentName(grade);
    const courseName = getCourseName(grade);

    return `${note} ${semestre} ${studentName} ${courseName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const handleRestore = async (grade) => {
    try {
      setRestoringId(grade.id);

      const restoredGrade = await restoreGrade(grade.id);

      setGrades((prev) => prev.filter((item) => item.id !== grade.id));

      if (onRestored) {
        onRestored(restoredGrade || grade);
      }
    } catch (error) {
      console.error("Error restoring grade:", error);
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
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/15">
                <Archive size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-cyan-200">
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <GraduationCap size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                {t.listTitle}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {t.showing} {filteredGrades.length} {t.archivedGrades}
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
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 sm:w-72"
              />
            </div>

            <button
              type="button"
              onClick={loadArchivedGrades}
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
          <table className="w-full min-w-[950px] table-fixed border-collapse">
            <thead>
              <tr className="bg-white text-center text-xs uppercase tracking-wide text-slate-500">
                <th className="w-1/5 px-5 py-3 font-black">{t.student}</th>
                <th className="w-1/5 px-5 py-3 font-black">{t.course}</th>
                <th className="w-1/5 px-5 py-3 font-black">{t.semester}</th>
                <th className="w-1/5 px-5 py-3 font-black">{t.note}</th>
                <th className="w-1/5 px-5 py-3 font-black">{t.action}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                      <Loader2 size={18} className="animate-spin" />
                      {t.loadingGrades}
                    </div>
                  </td>
                </tr>
              ) : filteredGrades.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                  >
                    {t.noGrades}
                  </td>
                </tr>
              ) : (
                filteredGrades.map((grade) => {
                  const note = grade.note ?? t.notAvailable;
                  const semestre = grade.semestre || t.notAvailable;
                  const studentName = getStudentName(grade);
                  const courseName = getCourseName(grade);

                  return (
                    <tr
                      key={grade.id}
                      className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-3">
                        <span className="font-black text-slate-900">
                          {studentName}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="font-bold text-slate-700">
                          {courseName}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-600">
                          {semestre}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
                          {note}/20
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => handleRestore(grade)}
                          disabled={restoringId === grade.id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {restoringId === grade.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <RotateCcw size={14} />
                          )}
                          {t.restore}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}