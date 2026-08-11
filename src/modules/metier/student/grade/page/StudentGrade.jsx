import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Loader2,
  Search,
} from "lucide-react";
import { getMyGrades } from "../services/studentgradeService";

const headerGradient =
  "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #134e4a 100%)";

const translations = {
  EN: {
    management: "Student / Grades",
    title: "My Grades",
    subtitle: "View your academic grades.",
    search: "Search grade...",
    list: "Grades List",
    total: "Total Grades",
    student: "Student",
    course: "Course",
    note: "Note",
    semester: "Semester",
    showing: "Showing",
    to: "to",
    of: "of",
    rows: "Rows:",
    page: "Page",
    loading: "Loading grades...",
    noData: "No Grade.",
    error: "Unable to load grades.",
  },
  FR: {
    management: "Étudiant / Notes",
    title: "Mes notes",
    subtitle: "Consulter vos notes académiques.",
    search: "Rechercher une note...",
    list: "Liste des notes",
    total: "Total notes",
    student: "Étudiant",
    course: "Cours",
    note: "Note",
    semester: "Semestre",
    showing: "Affichage",
    to: "à",
    of: "sur",
    rows: "Lignes :",
    page: "Page",
    loading: "Chargement des notes...",
    noData: "Aucune note.",
    error: "Impossible de charger les notes.",
  },
  AR: {
    management: "الطالب / النقاط",
    title: "نقاطي",
    subtitle: "عرض النتائج الدراسية.",
    search: "البحث عن نقطة...",
    list: "قائمة النقاط",
    total: "إجمالي النقاط",
    student: "الطالب",
    course: "المادة",
    note: "النقطة",
    semester: "الفصل",
    showing: "عرض",
    to: "إلى",
    of: "من",
    rows: "الأسطر:",
    page: "صفحة",
    loading: "جاري تحميل النقاط...",
    noData: "لا توجد نقاط.",
    error: "تعذر تحميل النقاط.",
  },
};

const normalizeGrades = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data?.content)) return data.data.content;
  return [];
};

const getStudentName = (grade) =>
  `${grade?.studentPrenom || ""} ${grade?.studentNom || ""}`.trim() ||
  grade?.studentName ||
  grade?.studentFullName ||
  `${grade?.student?.prenom || ""} ${grade?.student?.nom || ""}`.trim() ||
  "-";

const getCourseName = (grade) =>
  grade?.courseName ||
  grade?.coursNom ||
  grade?.course?.name ||
  grade?.course?.nom ||
  grade?.matiereNom ||
  grade?.matiere ||
  grade?.subjectName ||
  grade?.subject?.name ||
  grade?.subject?.nom ||
  "-";

const getNoteValue = (grade) =>
  grade?.note ?? grade?.grade ?? grade?.value ?? "-";

const getSemester = (grade) =>
  grade?.semester ||
  grade?.semestre ||
  grade?.semesterName ||
  grade?.semestreNom ||
  "-";

export default function StudentGrade() {
  const [grades, setGrades] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN",
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

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
    borderColor: "var(--border-color)",
    color: "var(--text-color)",
  };
  const mutedTextStyle = { color: "var(--muted-text)" };

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(
        event.detail || localStorage.getItem("app-language") || "EN",
      );
    };

    window.addEventListener("app-language-change", handleLanguageChange);
    return () =>
      window.removeEventListener("app-language-change", handleLanguageChange);
  }, []);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getMyGrades();
        setGrades(normalizeGrades(data));
      } catch (requestError) {
        console.error("Erreur chargement notes :", requestError);
        setGrades([]);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
  }, []);

  const filteredGrades = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return grades;

    return grades.filter((grade) =>
      [
        getStudentName(grade),
        getCourseName(grade),
        getNoteValue(grade),
        getSemester(grade),
      ].some((item) => String(item).toLowerCase().includes(value)),
    );
  }, [grades, search]);

  useEffect(() => setCurrentPage(1), [search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGrades.length / rowsPerPage),
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedGrades = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredGrades.slice(start, start + rowsPerPage);
  }, [filteredGrades, currentPage, rowsPerPage]);

  const startItem =
    filteredGrades.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, filteredGrades.length);
  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  return (
    <div
      className="min-h-screen space-y-5 px-2 py-1"
      dir={isArabic ? "rtl" : "ltr"}
      style={{ color: "var(--text-color)" }}
    >
      <section
        className="flex flex-col gap-4 rounded-[1.7rem] border border-white/15 px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between"
        style={{ background: headerGradient }}
      >
        <div>
          <p className="text-xs font-bold text-teal-100">{t.management}</p>
          <h1 className="mt-1 text-2xl font-black">{t.title}</h1>
          <p className="mt-1 text-sm font-semibold text-teal-100/80">
            {t.subtitle}
          </p>
        </div>

        <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.search}
            className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-teal-100/70 sm:w-64"
          />
          <Search size={17} className="text-teal-100" />
        </div>
      </section>

      <section className="rounded-[1.5rem] border p-5 shadow-sm" style={cardStyle}>
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
            style={{ background: headerGradient }}
          >
            <GraduationCap size={21} />
          </div>
          <div>
            <h2 className="text-2xl font-black">{grades.length}</h2>
            <p className="text-xs font-semibold" style={mutedTextStyle}>
              {t.total}
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <section
        className="overflow-hidden rounded-[1.7rem] border shadow-sm"
        style={cardStyle}
      >
        <div
          className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
              style={{ background: headerGradient }}
            >
              <GraduationCap size={19} />
            </div>
            <div>
              <h2 className="text-lg font-black">{t.list}</h2>
              <p className="text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startItem} {t.to} {endItem} {t.of}{" "}
                {filteredGrades.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black" style={mutedTextStyle}>
              {t.rows}
            </span>
            <select
              value={rowsPerPage}
              onChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="rounded-xl border px-3 py-2 text-xs font-bold outline-none"
              style={inputStyle}
            >
              {[5, 10, 15, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-1/4 px-5 py-4">{t.student}</th>
                <th className="w-1/4 px-5 py-4">{t.course}</th>
                <th className="w-1/4 px-5 py-4">{t.note}</th>
                <th className="w-1/4 px-5 py-4">{t.semester}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 font-bold">
                      <Loader2 className="animate-spin" size={19} />
                      {t.loading}
                    </div>
                  </td>
                </tr>
              ) : paginatedGrades.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center font-bold">
                    {t.noData}
                  </td>
                </tr>
              ) : (
                paginatedGrades.map((grade, index) => {
                  const studentName = getStudentName(grade);
                  return (
                    <tr
                      key={grade.id ?? `${getCourseName(grade)}-${index}`}
                      className="border-b text-center text-sm transition last:border-none hover:bg-teal-500/5"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 font-black text-teal-700">
                            {studentName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-black">{studentName}</p>
                            <p className="mt-1 text-xs font-semibold" style={mutedTextStyle}>
                              {t.student}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold" style={mutedTextStyle}>
                        {getCourseName(grade)}
                      </td>
                      <td className="px-5 py-4">
                        <GradeBadge value={getNoteValue(grade)} />
                      </td>
                      <td className="px-5 py-4 font-semibold" style={mutedTextStyle}>
                        {getSemester(grade)}
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
            {t.showing} <strong>{startItem}</strong> {t.to}{" "}
            <strong>{endItem}</strong> {t.of}{" "}
            <strong>{filteredGrades.length}</strong>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border disabled:cursor-not-allowed disabled:opacity-40"
              style={inputStyle}
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-black"
                style={{
                  background:
                    currentPage === pageNumber
                      ? headerGradient
                      : "var(--input-bg)",
                  borderColor:
                    currentPage === pageNumber ? "#0d9488" : "var(--border-color)",
                  color:
                    currentPage === pageNumber ? "#ffffff" : "var(--text-color)",
                }}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl border disabled:cursor-not-allowed disabled:opacity-40"
              style={inputStyle}
            >
              <ChevronRight size={16} />
            </button>

            <span
              className="rounded-xl border px-4 py-2 text-xs font-black"
              style={inputStyle}
            >
              {t.page} {currentPage} / {totalPages}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function GradeBadge({ value }) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return <span className="font-black text-teal-600">{value}</span>;
  }
  return (
    <span className={`font-black ${numeric >= 10 ? "text-blue-600" : "text-red-600"}`}>
      {numeric}
    </span>
  );
}