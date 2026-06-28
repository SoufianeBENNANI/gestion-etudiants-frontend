import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  BookOpen,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
} from "lucide-react";

import { getAllCourses, getCourseById } from "../services/courseService";
import CourseDetails from "../components/CourseDetails";

const translations = {
  EN: {
    breadcrumb: "Teacher / Courses",
    title: "Courses List",
    subtitle: "View and search courses.",
    searchPlaceholder: "Search course...",
    refresh: "Refresh",
    totalCourses: "Total Courses",
    coursesList: "Courses List",
    showing: "Showing",
    to: "to",
    of: "of",
    courses: "courses",
    rows: "Rows:",
    course: "Course",
    description: "Description",
    credits: "Credits",
    actions: "Actions",
    loading: "Loading courses...",
    empty: "No courses found.",
    page: "Page",
    detailsError: "Unable to load course details.",
    loadError: "Unable to load courses.",
    noName: "No name",
    noDescription: "No description",
    notDefined: "Not defined",
    view: "View",
  },

  FR: {
    breadcrumb: "Teacher / Cours",
    title: "Liste des cours",
    subtitle: "Voir et rechercher les cours.",
    searchPlaceholder: "Rechercher un cours...",
    refresh: "Actualiser",
    totalCourses: "Total cours",
    coursesList: "Liste des cours",
    showing: "Affichage",
    to: "à",
    of: "sur",
    courses: "cours",
    rows: "Lignes :",
    course: "Cours",
    description: "Description",
    credits: "Crédits",
    actions: "Actions",
    loading: "Chargement des cours...",
    empty: "Aucun cours trouvé.",
    page: "Page",
    detailsError: "Impossible de charger les détails du cours.",
    loadError: "Impossible de charger les cours.",
    noName: "Sans nom",
    noDescription: "Sans description",
    notDefined: "Non défini",
    view: "Voir",
  },

  AR: {
    breadcrumb: "المعلم / الدورات",
    title: "قائمة الدورات",
    subtitle: "عرض والبحث عن الدورات.",
    searchPlaceholder: "البحث عن دورة...",
    refresh: "تحديث",
    totalCourses: "إجمالي الدورات",
    coursesList: "قائمة الدورات",
    showing: "عرض",
    to: "إلى",
    of: "من",
    courses: "دورات",
    rows: "الأسطر:",
    course: "الدورة",
    description: "الوصف",
    credits: "الأرصدة",
    actions: "الإجراءات",
    loading: "جاري تحميل الدورات...",
    empty: "لا توجد دورات.",
    page: "الصفحة",
    detailsError: "تعذر تحميل تفاصيل الدورة.",
    loadError: "تعذر تحميل الدورات.",
    noName: "بدون اسم",
    noDescription: "بدون وصف",
    notDefined: "غير محدد",
    view: "عرض",
  },
};

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
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
    loadCourses();
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

  const normalizeCourses = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };

  const getCredits = (course) => {
    return (
      course.credits ??
      course.credit ??
      course.courseCredits ??
      course.creditNumber ??
      t.notDefined
    );
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllCourses();
      setCourses(normalizeCourses(data));
      setCurrentPage(1);
    } catch (error) {
      console.error("Erreur chargement cours:", error);
      setCourses([]);
      setError(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = async (course) => {
    if (!course?.id) return;

    try {
      setDetailsLoading(true);

      const data = await getCourseById(course.id);
      setSelectedCourse(data);
    } catch (error) {
      console.error("Erreur détails cours:", error);
      alert(t.detailsError);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const name = String(course.nom || course.name || "");
      const description = String(course.description || "");
      const credits = String(getCredits(course));

      return `${name} ${description} ${credits}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [courses, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourses.length / itemsPerPage)
  );

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCourses, currentPage, itemsPerPage]);

  const startCourse =
    filteredCourses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endCourse = Math.min(
    currentPage * itemsPerPage,
    filteredCourses.length
  );

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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
          <p className="text-xs font-semibold text-violet-200">
            {t.breadcrumb}
          </p>

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
              onChange={handleSearchChange}
              placeholder={t.searchPlaceholder}
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
            onClick={loadCourses}
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
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-2xl font-black" style={textStyle}>
              {filteredCourses.length}
            </h3>

            <p className="text-xs font-semibold" style={mutedTextStyle}>
              {t.totalCourses}
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
              <BookOpen size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.coursesList}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startCourse} {t.to} {endCourse} {t.of}{" "}
                {filteredCourses.length} {t.courses}
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
          <table className="w-full min-w-[900px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[34%] px-5 py-4 font-black">{t.course}</th>
                <th className="w-[38%] px-5 py-4 font-black">
                  {t.description}
                </th>
                <th className="w-[13%] px-5 py-4 font-black">{t.credits}</th>
                <th className="w-[15%] px-5 py-4 font-black">{t.actions}</th>
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
              ) : paginatedCourses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center font-bold">
                    {t.empty}
                  </td>
                </tr>
              ) : (
                paginatedCourses.map((course) => {
                  const courseName = course.name || course.nom || t.noName;
                  const credits = getCredits(course);

                  return (
                    <tr
                      key={course.id}
                      className="border-b text-center text-sm transition last:border-none hover:bg-violet-500/5"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 font-black text-violet-700">
                            {String(courseName).charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 text-center">
                            <p className="truncate font-black" style={textStyle}>
                              {courseName}
                            </p>

                            <p
                              className="mt-0.5 text-xs font-semibold"
                              style={mutedTextStyle}
                            >
                              {t.course}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="block truncate text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {course.description || t.noDescription}
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
                          {credits}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleViewCourse(course)}
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
            {t.showing} {startCourse} {t.to} {endCourse} {t.of}{" "}
            {filteredCourses.length} {t.courses}
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

      <CourseDetails
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </div>
  );
}