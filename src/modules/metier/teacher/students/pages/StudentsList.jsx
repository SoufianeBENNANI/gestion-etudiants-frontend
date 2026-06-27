import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Search,
  Users,
  Loader2,
  FileDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getAllStudents,
  searchStudentsByNom,
  downloadStudentsPdf,
} from "../services/studentService";

const translations = {
  EN: {
    badge: "Teacher / Students",
    title: "Students List",
    subtitle: "View and search students.",
    search: "Search by last name...",
    refresh: "Refresh",
    pdf: "PDF",
    totalStudents: "Total Students",
    studentsList: "Students List",
    showing: "Showing",
    to: "to",
    of: "of",
    students: "students",
    rows: "Rows:",
    student: "Student",
    email: "Email",
    gender: "Gender",
    phone: "Phone",
    address: "Address",
    page: "Page",
    loadingStudents: "Loading students...",
    noStudents: "No students found.",
    loadError: "Unable to load students.",
    searchError: "No student found or search error.",
    pdfError: "Unable to download PDF.",
  },

  FR: {
    badge: "Professeur / Étudiants",
    title: "Liste des étudiants",
    subtitle: "Consultation et recherche des étudiants.",
    search: "Rechercher par nom...",
    refresh: "Actualiser",
    pdf: "PDF",
    totalStudents: "Total étudiants",
    studentsList: "Liste des étudiants",
    showing: "Affichage",
    to: "à",
    of: "sur",
    students: "étudiants",
    rows: "Lignes :",
    student: "Étudiant",
    email: "Email",
    gender: "Genre",
    phone: "Téléphone",
    address: "Adresse",
    page: "Page",
    loadingStudents: "Chargement des étudiants...",
    noStudents: "Aucun étudiant trouvé.",
    loadError: "Impossible de charger les étudiants.",
    searchError: "Aucun étudiant trouvé ou erreur pendant la recherche.",
    pdfError: "Impossible de télécharger le PDF.",
  },

  AR: {
    badge: "الأستاذ / الطلاب",
    title: "قائمة الطلاب",
    subtitle: "عرض والبحث عن الطلاب.",
    search: "البحث بالاسم...",
    refresh: "تحديث",
    pdf: "PDF",
    totalStudents: "إجمالي الطلاب",
    studentsList: "قائمة الطلاب",
    showing: "عرض",
    to: "إلى",
    of: "من",
    students: "طلاب",
    rows: "الأسطر:",
    student: "الطالب",
    email: "البريد الإلكتروني",
    gender: "الجنس",
    phone: "الهاتف",
    address: "العنوان",
    page: "الصفحة",
    loadingStudents: "جاري تحميل الطلاب...",
    noStudents: "لا يوجد طلاب.",
    loadError: "تعذر تحميل الطلاب.",
    searchError: "لم يتم العثور على طالب أو حدث خطأ في البحث.",
    pdfError: "تعذر تحميل ملف PDF.",
  },
};

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [searchNom, setSearchNom] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const t = translations[language] || translations.EN;

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
    loadStudents();
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

  const normalizeStudents = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllStudents();
      setStudents(normalizeStudents(data));
      setCurrentPage(1);
    } catch (error) {
      console.error("Erreur chargement students:", error);
      setStudents([]);
      setError(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const nom = searchNom.trim();

    if (!nom) {
      await loadStudents();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await searchStudentsByNom(nom);
      setStudents(normalizeStudents(data));
      setCurrentPage(1);
    } catch (error) {
      console.error("Erreur recherche students:", error);
      setStudents([]);
      setError(t.searchError);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSearch = async (e) => {
    const value = e.target.value;
    setSearchNom(value);
    setCurrentPage(1);

    if (!value.trim()) {
      await loadStudents();
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setPdfLoading(true);
      setError("");

      const pdfData = await downloadStudentsPdf();
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "liste_etudiants.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur téléchargement PDF:", error);
      setError(t.pdfError);
    } finally {
      setPdfLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(students.length / itemsPerPage));

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return students.slice(startIndex, startIndex + itemsPerPage);
  }, [students, currentPage, itemsPerPage]);

  const startStudent =
    students.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endStudent = Math.min(currentPage * itemsPerPage, students.length);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleChangeItemsPerPage = (e) => {
    setItemsPerPage(Number(e.target.value));
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
              value={searchNom}
              onChange={handleChangeSearch}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder={t.search}
              className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-300 sm:w-64"
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={loadStudents}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:opacity-60"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            {t.refresh}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            <FileDown size={17} />
            {pdfLoading ? t.loadingStudents : t.pdf}
          </button>
        </div>
      </div>

      <div className="rounded-[1.4rem] border p-5 shadow-sm" style={cardStyle}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white">
            <Users className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-2xl font-black" style={textStyle}>
              {students.length}
            </h3>

            <p className="text-xs font-semibold" style={mutedTextStyle}>
              {t.totalStudents}
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
              <Users size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.studentsList}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startStudent} {t.to} {endStudent} {t.of}{" "}
                {students.length} {t.students}
              </p>
            </div>
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

        <div className="overflow-x-auto" dir={language === "AR" ? "rtl" : "ltr"}>
          <table className="w-full min-w-[900px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[24%] px-5 py-4 font-black">{t.student}</th>
                <th className="w-[26%] px-5 py-4 font-black">{t.email}</th>
                <th className="w-[14%] px-5 py-4 font-black">{t.gender}</th>
                <th className="w-[16%] px-5 py-4 font-black">{t.phone}</th>
                <th className="w-[20%] px-5 py-4 font-black">{t.address}</th>
              </tr>
            </thead>

            <tbody>
              {paginatedStudents.map((student) => {
                const fullName = `${student.nom || ""} ${student.prenom || ""}`.trim();

                return (
                  <tr
                    key={student.id}
                    className="border-b text-center text-sm transition last:border-none hover:bg-violet-500/5"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 font-black text-violet-700">
                          {String(fullName || "-").charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 text-center">
                          <p className="truncate font-black" style={textStyle}>
                            {fullName || "-"}
                          </p>

                          <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                            {t.student}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="block truncate text-sm font-semibold" style={mutedTextStyle}>
                        {student.email || "-"}
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
                        {student.genre || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="block truncate text-sm font-semibold" style={mutedTextStyle}>
                        {student.telephone || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="block truncate text-sm font-semibold" style={mutedTextStyle}>
                        {student.adresse || "-"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div
          className="flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <p className="text-xs font-semibold" style={mutedTextStyle}>
            {t.showing}{" "}
            <span className="font-black" style={textStyle}>
              {startStudent}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endStudent}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {students.length}
            </span>{" "}
            {t.students}
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
                    currentPage === pageNumber
                      ? "#ffffff"
                      : "var(--text-color)",
                }}
              >
                {pageNumber}
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
    </div>
  );
}