import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Archive,
  Pencil,
  Trash2,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  TrendingUp,
  Search,
  Eye,
} from "lucide-react";

import { getAllGrades, getArchivedGrades } from "../services/gradeService";

import AddGrade from "../components/AddGrade";
import EditGrade from "../components/EditGrade";
import DeleteGrade from "../components/DeleteGrade";
import ArchiveGrade from "../components/ArchiveGrade";
import DetailsGrade from "../components/DetailsGrade";

const headerGradient =
  "linear-gradient(135deg, #2e1a72, #4c1d95, #6d4aff)";

const translations = {
  EN: {
    management: "Grades Management",
    title: "Teacher Grades",
    subtitle: "Manage, create, update, archive and restore students grades.",
    search: "Search grade...",
    add: "Add",
    archive: "Archive",
    total: "Total Grades",
    active: "Active Grades",
    archived: "Archived Grades",
    lastDays: "Last 30 days",
    list: "Grades List",
    showing: "Showing",
    to: "to",
    of: "of",
    grades: "grades",
    rows: "Rows:",
    student: "Student",
    course: "Course",
    note: "Note",
    semestre: "Semester",
    actions: "Actions",
    loading: "Loading grades...",
    empty: "No grades found.",
    page: "Page",
  },
  FR: {
    management: "Gestion des notes",
    title: "Notes des étudiants",
    subtitle: "Gérer, créer, modifier, archiver et restaurer les notes.",
    search: "Rechercher une note...",
    add: "Ajouter",
    archive: "Archive",
    total: "Total des notes",
    active: "Notes actives",
    archived: "Notes archivées",
    lastDays: "Derniers 30 jours",
    list: "Liste des notes",
    showing: "Affichage de",
    to: "à",
    of: "sur",
    grades: "notes",
    rows: "Lignes :",
    student: "Étudiant",
    course: "Cours",
    note: "Note",
    semestre: "Semestre",
    actions: "Actions",
    loading: "Chargement des notes...",
    empty: "Aucune note trouvée.",
    page: "Page",
  },
  AR: {
    management: "إدارة النقط",
    title: "نقط الأستاذ",
    subtitle: "إدارة وإنشاء وتعديل وأرشفة واسترجاع نقط الطلاب.",
    search: "البحث عن نقطة...",
    add: "إضافة",
    archive: "الأرشيف",
    total: "مجموع النقط",
    active: "النقط النشطة",
    archived: "النقط المؤرشفة",
    lastDays: "آخر 30 يومًا",
    list: "قائمة النقط",
    showing: "عرض",
    to: "إلى",
    of: "من",
    grades: "نقط",
    rows: "الأسطر:",
    student: "الطالب",
    course: "المادة",
    note: "النقطة",
    semestre: "السداسي",
    actions: "الإجراءات",
    loading: "جاري تحميل النقط...",
    empty: "لا توجد نقط.",
    page: "صفحة",
  },
};

export default function GradesPage() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

  const [grades, setGrades] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [deleteGradeItem, setDeleteGradeItem] = useState(null);
  const [detailsGrade, setDetailsGrade] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
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

  const mutedTextStyle = { color: "var(--muted-text)" };
  const textStyle = { color: "var(--text-color)" };

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail || localStorage.getItem("app-language") || "EN");
    };

    window.addEventListener("app-language-change", handleLanguageChange);
    return () =>
      window.removeEventListener("app-language-change", handleLanguageChange);
  }, []);

  const loadArchivedCount = async () => {
    try {
      const data = await getArchivedGrades();
      setArchivedCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setArchivedCount(0);
    }
  };

  const loadGrades = async () => {
    try {
      setLoading(true);
      const data = await getAllGrades();
      setGrades(Array.isArray(data) ? data.filter((g) => !g.archived) : []);
      setCurrentPage(1);
      await loadArchivedCount();
    } catch (error) {
      console.error("Load grades error:", error);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades();
  }, []);

  const filteredGrades = useMemo(() => {
    const value = searchTerm.toLowerCase().trim();
    if (!value) return grades;

    return grades.filter((grade) => {
      return (
        String(grade.id || "").includes(value) ||
        String(grade.studentName || "").toLowerCase().includes(value) ||
        String(grade.courseName || "").toLowerCase().includes(value) ||
        String(grade.note || "").toLowerCase().includes(value) ||
        String(grade.semestre || "").toLowerCase().includes(value)
      );
    });
  }, [grades, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredGrades.length / itemsPerPage));

  const paginatedGrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGrades.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGrades, currentPage, itemsPerPage]);

  const startGrade =
    filteredGrades.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endGrade = Math.min(currentPage * itemsPerPage, filteredGrades.length);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const stats = [
    {
      title: t.total,
      value: grades.length,
      icon: GraduationCap,
      iconBg: "bg-orange-500",
      percentBg: "bg-orange-50",
      percentText: "text-orange-600",
      percent: "76%",
      trend: "17%",
    },
    {
      title: t.active,
      value: filteredGrades.length,
      icon: Search,
      iconBg: "bg-blue-500",
      percentBg: "bg-blue-50",
      percentText: "text-blue-600",
      percent: "73%",
      trend: "22%",
    },
    {
      title: t.archived,
      value: archivedCount,
      icon: AlertTriangle,
      iconBg: "bg-red-500",
      percentBg: "bg-red-50",
      percentText: "text-red-600",
      percent: "12%",
      trend: "0.9%",
    },
  ];

  return (
    <div
      className="min-h-screen space-y-5 px-2 py-1 transition-colors duration-300"
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
    >
      <div
        className={`flex flex-col gap-4 rounded-[1.7rem] border px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between ${
          isArabic ? "lg:flex-row-reverse text-right" : "text-left"
        }`}
        style={{
          borderColor: "var(--border-color)",
          background: headerGradient,
        }}
      >
        <div>
          <p className="text-xs font-semibold text-purple-200">
            {t.management}
          </p>

          <h1 className="mt-1 text-2xl font-black text-white">{t.title}</h1>

          <p className="mt-1 text-sm font-semibold text-purple-100">
            {t.subtitle}
          </p>
        </div>

        <div
          className={`flex flex-col gap-3 sm:flex-row sm:items-center ${
            isArabic ? "sm:flex-row-reverse" : ""
          }`}
        >
          <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t.search}
              className={`w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-purple-200 sm:w-64 ${
                isArabic ? "text-right" : "text-left"
              }`}
            />

            <Search size={17} className="text-purple-100" />
          </div>

          <button
            type="button"
            onClick={() => setOpenAdd(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 shadow-sm transition hover:bg-white/15"
          >
            <Plus size={17} />
            {t.add}
          </button>

          <button
            type="button"
            onClick={() => setOpenArchive(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 shadow-sm transition hover:bg-white/15"
          >
            <Archive size={17} />
            {t.archive}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[1.4rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              style={cardStyle}
            >
              <div
                className={`flex items-start justify-between ${
                  isArabic ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-4 ${
                    isArabic ? "flex-row-reverse text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${item.iconBg} text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black" style={textStyle}>
                      {item.value}
                    </h3>

                    <p className="text-xs font-semibold" style={mutedTextStyle}>
                      {item.title}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${item.percentBg}`}
                >
                  <span className={`text-[11px] font-black ${item.percentText}`}>
                    {item.percent}
                  </span>
                </div>
              </div>

              <div
                className={`mt-5 flex items-center gap-3 text-xs font-semibold ${
                  isArabic ? "flex-row-reverse" : ""
                }`}
              >
                <span style={mutedTextStyle}>{t.lastDays}</span>
                <span className="font-black text-emerald-500">
                  {item.trend}
                </span>
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="overflow-hidden rounded-[1.4rem] border shadow-sm transition-colors duration-300"
        style={cardStyle}
      >
        <div
          className={`flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between ${
            isArabic ? "lg:flex-row-reverse" : ""
          }`}
          style={sectionStyle}
        >
          <div
            className={`flex items-center gap-3 ${
              isArabic ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ background: headerGradient }}
            >
              <GraduationCap size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.list}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startGrade} {t.to} {endGrade} {t.of}{" "}
                {filteredGrades.length} {t.grades}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
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
          <table className="w-full min-w-[1080px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[24%] px-5 py-4 font-black">{t.student}</th>
                <th className="w-[24%] px-5 py-4 font-black">{t.course}</th>
                <th className="w-[16%] px-5 py-4 font-black">{t.note}</th>
                <th className="w-[16%] px-5 py-4 font-black">{t.semestre}</th>
                <th className="w-[14%] px-5 py-4 font-black">{t.actions}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center">
                    <div
                      className="flex items-center justify-center gap-2 text-sm font-bold"
                      style={mutedTextStyle}
                    >
                      <Loader2 size={18} className="animate-spin" />
                      {t.loading}
                    </div>
                  </td>
                </tr>
              ) : paginatedGrades.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.empty}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedGrades.map((grade) => (
                  <tr
                    key={grade.id}
                    className="border-b text-center text-sm transition last:border-none"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                          {String(grade.studentName || "-")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0 text-center">
                          <p className="truncate font-black" style={textStyle}>
                            {grade.studentName || `ID ${grade.studentId || "-"}`}
                          </p>

                          <p
                            className="mt-0.5 text-xs font-semibold"
                            style={mutedTextStyle}
                          >
                            {t.student}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="block truncate text-sm font-semibold"
                        style={mutedTextStyle}
                      >
                        {grade.courseName || `ID ${grade.courseId || "-"}`}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="inline-flex rounded-full px-4 py-1.5 text-xs font-black"
                        style={{
                          backgroundColor: "var(--section-bg)",
                          color: "var(--primary-color)",
                        }}
                      >
                        {grade.note ?? "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="block truncate text-sm font-semibold"
                        style={mutedTextStyle}
                      >
                        {grade.semestre || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailsGrade(grade)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedGrade(grade)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80"
                          style={inputStyle}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteGradeItem(grade)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          className={`flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between ${
            isArabic ? "lg:flex-row-reverse" : ""
          }`}
          style={sectionStyle}
        >
          <p className="text-xs font-semibold" style={mutedTextStyle}>
            {t.showing}{" "}
            <span className="font-black" style={textStyle}>
              {startGrade}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endGrade}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {filteredGrades.length}
            </span>{" "}
            {t.grades}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-black transition"
                style={{
                  background:
                    currentPage === page ? headerGradient : "var(--input-bg)",
                  borderColor: "var(--border-color)",
                  color: currentPage === page ? "#ffffff" : "var(--text-color)",
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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

      <AddGrade
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSaved={loadGrades}
      />

      <EditGrade
        open={!!selectedGrade}
        grade={selectedGrade}
        onClose={() => setSelectedGrade(null)}
        onUpdated={loadGrades}
      />

      <DeleteGrade
        grade={deleteGradeItem}
        onClose={() => setDeleteGradeItem(null)}
        onDeleted={loadGrades}
      />

      <ArchiveGrade
        open={openArchive}
        onClose={() => setOpenArchive(false)}
        onRestored={loadGrades}
      />

      <DetailsGrade
        open={!!detailsGrade}
        grade={detailsGrade}
        onClose={() => setDetailsGrade(null)}
      />
    </div>
  );
}