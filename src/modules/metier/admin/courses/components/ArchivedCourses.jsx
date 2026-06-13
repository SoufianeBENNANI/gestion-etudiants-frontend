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

import { getArchivedCourses, restoreCourse } from "../services/courseService";

const translations = {
  EN: {
    management: "Academics Management",
    title: "Archived Courses",
    subtitle: "View and restore archived course records.",

    listTitle: "Archived Courses List",
    showing: "Showing",
    archivedCourses: "archived courses",

    searchPlaceholder: "Search archive...",
    refresh: "Refresh",

    courseName: "Course Name",
    description: "Description",
    credits: "Credits",
    action: "Action",

    loadingCourses: "Loading archived courses...",
    noCourses: "No archived courses found.",

    noName: "No name",
    noDescription: "No description",
    notDefined: "Not defined",

    restore: "Restore",
    restoreError: "Error while restoring the course",
  },

  FR: {
    management: "Gestion académique",
    title: "Cours archivés",
    subtitle: "Voir et restaurer les cours archivés.",

    listTitle: "Liste des cours archivés",
    showing: "Affichage de",
    archivedCourses: "cours archivés",

    searchPlaceholder: "Rechercher dans l’archive...",
    refresh: "Actualiser",

    courseName: "Nom du cours",
    description: "Description",
    credits: "Crédits",
    action: "Action",

    loadingCourses: "Chargement des cours archivés...",
    noCourses: "Aucun cours archivé trouvé.",

    noName: "Sans nom",
    noDescription: "Sans description",
    notDefined: "Non défini",

    restore: "Restaurer",
    restoreError: "Erreur lors de la restauration du cours",
  },

  AR: {
    management: "الإدارة الأكاديمية",
    title: "الدورات المؤرشفة",
    subtitle: "عرض واستعادة سجلات الدورات المؤرشفة.",

    listTitle: "قائمة الدورات المؤرشفة",
    showing: "عرض",
    archivedCourses: "دورات مؤرشفة",

    searchPlaceholder: "البحث في الأرشيف...",
    refresh: "تحديث",

    courseName: "اسم الدورة",
    description: "الوصف",
    credits: "الأرصدة",
    action: "الإجراء",

    loadingCourses: "جاري تحميل الدورات المؤرشفة...",
    noCourses: "لا توجد دورات مؤرشفة.",

    noName: "بدون اسم",
    noDescription: "بدون وصف",
    notDefined: "غير محدد",

    restore: "استعادة",
    restoreError: "حدث خطأ أثناء استعادة الدورة",
  },
};

export default function ArchivedCourses({ open, onClose, onRestored }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [archivedCourses, setArchivedCourses] = useState([]);
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

  const loadArchivedCourses = async () => {
    try {
      setLoading(true);

      const data = await getArchivedCourses();
      setArchivedCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading archived courses:", error);
      setArchivedCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setSearchTerm("");
      loadArchivedCourses();
    }
  }, [open]);

  const filteredCourses = useMemo(() => {
    return archivedCourses.filter((course) => {
      const courseName = String(course.nom || course.name || "");
      const description = String(course.description || "");
      const credits = String(course.credits ?? "");

      return `${courseName} ${description} ${credits}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [archivedCourses, searchTerm]);

  const handleRestore = async (course) => {
    try {
      setRestoringId(course.id);

      const restoredCourse = await restoreCourse(course.id);

      setArchivedCourses((prev) =>
        prev.filter((item) => item.id !== course.id)
      );

      if (onRestored) {
        onRestored(restoredCourse || course);
      }
    } catch (error) {
      console.error("Error restoring course:", error);
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
        className="w-full max-w-5xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

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

        {/* LIST HEADER */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Layers3 size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                {t.listTitle}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {t.showing} {filteredCourses.length} {t.archivedCourses}
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
              onClick={loadArchivedCourses}
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
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white text-center text-xs uppercase tracking-wide text-slate-500">
                <th className="w-[25%] px-5 py-4 font-black">
                  {t.courseName}
                </th>
                <th className="w-[35%] px-5 py-4 font-black">
                  {t.description}
                </th>
                <th className="w-[15%] px-5 py-4 font-black">
                  {t.credits}
                </th>
                <th className="w-[25%] px-5 py-4 font-black">
                  {t.action}
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                      <Loader2 size={18} className="animate-spin" />
                      {t.loadingCourses}
                    </div>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-10 text-center text-sm font-bold text-slate-600"
                  >
                    {t.noCourses}
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <span className="font-black text-slate-900">
                        {course.nom || course.name || t.noName}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="line-clamp-1">
                        {course.description || t.noDescription}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
                        {course.credits ?? t.notDefined}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleRestore(course)}
                        disabled={restoringId === course.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {restoringId === course.id ? (
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