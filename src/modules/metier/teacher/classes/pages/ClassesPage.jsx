import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  GraduationCap,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
} from "lucide-react";

import { getAllClasses, getClassById } from "../services/classService";
import ClassDetails from "../components/ClassDetails";

const translations = {
  EN: {
    badge: "Teacher / Classes",
    title: "Classes List",
    subtitle: "View and search classes.",
    search: "Search class...",
    refresh: "Refresh",
    totalClasses: "Total Classes",
    classesList: "Classes List",
    showing: "Showing",
    to: "to",
    of: "of",
    classes: "classes",
    rows: "Rows:",
    className: "Class",
    level: "Level",
    academicYear: "Academic Year",
    actions: "Actions",
    view: "View",
    page: "Page",
    loading: "Loading classes...",
    empty: "No classes found.",
    detailsError: "Unable to load class details.",
    noName: "No name",
    notDefined: "Not defined",
  },

  FR: {
    badge: "Professeur / Classes",
    title: "Liste des classes",
    subtitle: "Voir et rechercher les classes.",
    search: "Rechercher une classe...",
    refresh: "Actualiser",
    totalClasses: "Total classes",
    classesList: "Liste des classes",
    showing: "Affichage",
    to: "à",
    of: "sur",
    classes: "classes",
    rows: "Lignes :",
    className: "Classe",
    level: "Niveau",
    academicYear: "Année scolaire",
    actions: "Actions",
    view: "Voir",
    page: "Page",
    loading: "Chargement des classes...",
    empty: "Aucune classe trouvée.",
    loadError: "Impossible de charger les classes.",
    detailsError: "Impossible de charger les détails de la classe.",
    noName: "Sans nom",
    notDefined: "Non défini",
  },

  AR: {
    badge: "الأستاذ / الأقسام",
    title: "قائمة الأقسام",
    subtitle: "عرض والبحث عن الأقسام.",
    search: "البحث عن قسم...",
    refresh: "تحديث",
    totalClasses: "إجمالي الأقسام",
    classesList: "قائمة الأقسام",
    showing: "عرض",
    to: "إلى",
    of: "من",
    classes: "أقسام",
    rows: "الأسطر:",
    className: "القسم",
    level: "المستوى",
    academicYear: "السنة الدراسية",
    actions: "الإجراءات",
    view: "عرض",
    page: "الصفحة",
    loading: "جاري تحميل الأقسام...",
    empty: "لا توجد أقسام.",
    loadError: "تعذر تحميل الأقسام.",
    detailsError: "تعذر تحميل تفاصيل القسم.",
    noName: "بدون اسم",
    notDefined: "غير محدد",
  },
};

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

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

  const textStyle = { color: "var(--text-color)" };
  const mutedTextStyle = { color: "var(--muted-text)" };

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail || localStorage.getItem("app-language") || "EN");
    };

    window.addEventListener("app-language-change", handleLanguageChange);
    window.addEventListener("storage", handleLanguageChange);

    return () => {
      window.removeEventListener("app-language-change", handleLanguageChange);
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  const normalizeClasses = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };

  const getClassName = (classe) =>
    classe.nom ||
    classe.name ||
    classe.nomClasse ||
    classe.className ||
    t.noName;

  const getLevel = (classe) =>
    classe.niveau || classe.level || classe.filiere || t.notDefined;

  const getAcademicYear = (classe) =>
    classe.annee ||
    classe.academicYear ||
    classe.year ||
    classe.anneeScolaire ||
    t.notDefined;

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllClasses();
      setClasses(normalizeClasses(data));
      setCurrentPage(1);
    } catch (error) {
      console.error("Erreur chargement classes:", error);
      setClasses([]);
      setError(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClass = async (classe) => {
    if (!classe?.id) return;

    try {
      setDetailsLoading(true);
      const data = await getClassById(classe.id);
      setSelectedClass(data);
    } catch (error) {
      console.error("Erreur détails classe:", error);
      alert(t.detailsError);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredClasses = useMemo(() => {
    return classes.filter((classe) => {
      const name = String(getClassName(classe));
      const level = String(getLevel(classe));
      const academicYear = String(getAcademicYear(classe));

      return `${name} ${level} ${academicYear}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [classes, searchTerm, language]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClasses.length / itemsPerPage)
  );

  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClasses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClasses, currentPage, itemsPerPage]);

  const startClass =
    filteredClasses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endClass = Math.min(currentPage * itemsPerPage, filteredClasses.length);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  return (
    <div
      className="min-h-screen space-y-5 px-2 py-1 transition-colors duration-300"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div className="flex flex-col gap-4 rounded-[1.7rem] border border-white/15 bg-gradient-to-br from-[#6d28d9] to-[#020617] px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold text-violet-200">{t.badge}</p>
          <h1 className="mt-1 text-2xl font-black text-white">{t.title}</h1>
          <p className="mt-1 text-sm font-semibold text-slate-300">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t.search}
              className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-300 sm:w-72"
            />

            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={loadClasses}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:opacity-60"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            {t.refresh}
          </button>
        </div>
      </div>

      <div className="rounded-[1.4rem] border p-5 shadow-sm" style={cardStyle}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-2xl font-black" style={textStyle}>
              {filteredClasses.length}
            </h3>

            <p className="text-xs font-semibold" style={mutedTextStyle}>
              {t.totalClasses}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-[1.4rem] border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div
        className="overflow-hidden rounded-[1.4rem] border shadow-sm transition-colors duration-300"
        style={cardStyle}
      >
        <div
          className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white">
              <GraduationCap size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.classesList}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startClass} {t.to} {endClass} {t.of}{" "}
                {filteredClasses.length} {t.classes}
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[34%] px-5 py-4 font-black">
                  {t.className}
                </th>
                <th className="w-[23%] px-5 py-4 font-black">{t.level}</th>
                <th className="w-[23%] px-5 py-4 font-black">
                  {t.academicYear}
                </th>
                <th className="w-[20%] px-5 py-4 font-black">{t.actions}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 font-bold">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t.loading}
                    </div>
                  </td>
                </tr>
              ) : paginatedClasses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center font-bold">
                    {t.empty}
                  </td>
                </tr>
              ) : (
                paginatedClasses.map((classe) => {
                  const className = getClassName(classe);
                  const level = getLevel(classe);
                  const academicYear = getAcademicYear(classe);

                  return (
                    <tr
                      key={classe.id}
                      className="border-b text-center text-sm transition last:border-none hover:bg-violet-500/5"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 font-black text-violet-700">
                            {String(className).charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 text-center">
                            <p className="truncate font-black" style={textStyle}>
                              {className}
                            </p>

                            <p
                              className="mt-0.5 text-xs font-semibold"
                              style={mutedTextStyle}
                            >
                              {t.className}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex rounded-full px-3 py-1.5 text-xs font-black"
                          style={{
                            backgroundColor: "var(--section-bg)",
                            color: "var(--primary-color)",
                          }}
                        >
                          {level}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex rounded-full px-3 py-1.5 text-xs font-black"
                          style={{
                            backgroundColor: "var(--section-bg)",
                            color: "var(--primary-color)",
                          }}
                        >
                          {academicYear}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleViewClass(classe)}
                          disabled={detailsLoading}
                          title={t.view}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div
          className="flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <p className="text-xs font-semibold" style={mutedTextStyle}>
            {t.showing} {startClass} {t.to} {endClass} {t.of}{" "}
            {filteredClasses.length} {t.classes}
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
                  color:
                    currentPage === pageNumber ? "#ffffff" : "var(--text-color)",
                }}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:opacity-50"
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

      <ClassDetails
        classe={selectedClass}
        onClose={() => setSelectedClass(null)}
      />
    </div>
  );
}