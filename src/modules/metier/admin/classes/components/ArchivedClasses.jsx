import { useEffect, useState } from "react";
import {
  Archive,
  Layers3,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import { getArchivedClasses, restoreClasse } from "../services/classeService";

const translations = {
  EN: {
    management: "Academics Management",
    title: "Archived Classes",
    subtitle: "View and restore archived class records.",

    listTitle: "Archived Classes List",
    showing: "Showing",
    archivedClasses: "archived classes",

    searchPlaceholder: "Search archive...",
    refresh: "Refresh",
    restore: "Restore",

    className: "Class Name",
    level: "Level",
    academicYear: "Academic Year",
    action: "Action",

    loadingClasses: "Loading archived classes...",
    noClasses: "No archived classes found.",

    noName: "No name",
    notDefined: "Not defined",

    confirmRestore: "Restore this class?",
    restoreError: "Error while restoring the class",
  },

  FR: {
    management: "Gestion académique",
    title: "Classes archivées",
    subtitle: "Voir et restaurer les classes archivées.",

    listTitle: "Liste des classes archivées",
    showing: "Affichage de",
    archivedClasses: "classes archivées",

    searchPlaceholder: "Rechercher dans l’archive...",
    refresh: "Actualiser",
    restore: "Restaurer",

    className: "Nom de la classe",
    level: "Niveau",
    academicYear: "Année scolaire",
    action: "Action",

    loadingClasses: "Chargement des classes archivées...",
    noClasses: "Aucune classe archivée trouvée.",

    noName: "Sans nom",
    notDefined: "Non défini",

    confirmRestore: "Restaurer cette classe ?",
    restoreError: "Erreur lors de la restauration de la classe",
  },

  AR: {
    management: "الإدارة الأكاديمية",
    title: "الأقسام المؤرشفة",
    subtitle: "عرض واستعادة سجلات الأقسام المؤرشفة.",

    listTitle: "قائمة الأقسام المؤرشفة",
    showing: "عرض",
    archivedClasses: "أقسام مؤرشفة",

    searchPlaceholder: "البحث في الأرشيف...",
    refresh: "تحديث",
    restore: "استعادة",

    className: "اسم القسم",
    level: "المستوى",
    academicYear: "السنة الدراسية",
    action: "الإجراء",

    loadingClasses: "جاري تحميل الأقسام المؤرشفة...",
    noClasses: "لا توجد أقسام مؤرشفة.",

    noName: "بدون اسم",
    notDefined: "غير محدد",

    confirmRestore: "هل تريد استعادة هذا القسم؟",
    restoreError: "حدث خطأ أثناء استعادة القسم",
  },
};

export default function ArchivedClasses({ open, onClose, onRestored }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [classes, setClasses] = useState([]);
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

  const loadArchivedClasses = async () => {
    try {
      setLoading(true);

      const data = await getArchivedClasses();
      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading archived classes:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadArchivedClasses();
    }
  }, [open]);

  const filteredClasses = classes.filter((classe) => {
    const className = String(classe.nom || classe.name || "");
    const level = String(classe.niveau || classe.level || "");
    const year = String(classe.annee || "");

    return `${className} ${level} ${year}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const handleRestore = async (classe) => {
    if (!window.confirm(t.confirmRestore)) return;

    try {
      setRestoringId(classe.id);

      const restoredClasse = await restoreClasse(classe.id);

      setClasses((prev) => prev.filter((item) => item.id !== classe.id));

      if (onRestored) {
        onRestored(restoredClasse || classe);
      }
    } catch (error) {
      console.error("Error restoring class:", error);
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

        {/* TOOLBAR */}
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
                {t.showing} {filteredClasses.length} {t.archivedClasses}
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
              onClick={loadArchivedClasses}
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
          <table className="w-full min-w-[850px] table-fixed border-collapse">
            <thead>
              <tr className="bg-white text-center text-xs uppercase tracking-wide text-slate-500">
                <th className="w-1/4 px-5 py-3 font-black">
                  {t.className}
                </th>
                <th className="w-1/4 px-5 py-3 font-black">
                  {t.level}
                </th>
                <th className="w-1/4 px-5 py-3 font-black">
                  {t.academicYear}
                </th>
                <th className="w-1/4 px-5 py-3 font-black">
                  {t.action}
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                      <Loader2 size={18} className="animate-spin" />
                      {t.loadingClasses}
                    </div>
                  </td>
                </tr>
              ) : filteredClasses.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                  >
                    {t.noClasses}
                  </td>
                </tr>
              ) : (
                filteredClasses.map((classe) => {
                  const className = classe.nom || classe.name || t.noName;
                  const level = classe.niveau || classe.level || t.notDefined;
                  const year = classe.annee || t.notDefined;

                  return (
                    <tr
                      key={classe.id}
                      className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-3">
                        <span className="font-black text-slate-900">
                          {className}
                        </span>
                      </td>

                      <td className="px-5 py-3">{level}</td>

                      <td className="px-5 py-3">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
                          {year}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => handleRestore(classe)}
                          disabled={restoringId === classe.id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {restoringId === classe.id ? (
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