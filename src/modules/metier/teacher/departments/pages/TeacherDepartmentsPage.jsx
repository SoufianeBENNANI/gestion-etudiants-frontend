import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Loader2,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getAllDepartments,
  searchDepartmentsByNom,
} from "../services/departmentService";

import DepartmentDetails from "../components/DepartmentDetails";

const headerGradient =
  "linear-gradient(135deg, #2e1a72, #4c1d95, #6d4aff)";

const translations = {
  EN: {
    management: "Departments Management",
    title: "Teacher Departments",
    subtitle: "View and search available departments.",
    search: "Search department...",
    list: "Departments List",
    showing: "Showing",
    to: "to",
    of: "of",
    departments: "departments",
    rows: "Rows:",
    department: "Department",
    description: "Description",
    status: "Status",
    action: "Action",
    active: "Active",
    archived: "Archived",
    loading: "Loading departments...",
    empty: "No departments found.",
    page: "Page",
  },
  FR: {
    management: "Gestion des départements",
    title: "Départements enseignant",
    subtitle: "Afficher et rechercher les départements disponibles.",
    search: "Rechercher un département...",
    list: "Liste des départements",
    showing: "Affichage de",
    to: "à",
    of: "sur",
    departments: "départements",
    rows: "Lignes :",
    department: "Département",
    description: "Description",
    status: "Statut",
    action: "Action",
    active: "Actif",
    archived: "Archivé",
    loading: "Chargement des départements...",
    empty: "Aucun département trouvé.",
    page: "Page",
  },
  AR: {
    management: "إدارة الأقسام",
    title: "أقسام الأستاذ",
    subtitle: "عرض والبحث عن الأقسام المتاحة.",
    search: "البحث عن قسم...",
    list: "قائمة الأقسام",
    showing: "عرض",
    to: "إلى",
    of: "من",
    departments: "أقسام",
    rows: "الأسطر:",
    department: "القسم",
    description: "الوصف",
    status: "الحالة",
    action: "الإجراء",
    active: "نشط",
    archived: "مؤرشف",
    loading: "جاري تحميل الأقسام...",
    empty: "لا توجد أقسام.",
    page: "صفحة",
  },
};

export default function TeacherDepartmentsPage() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

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

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await getAllDepartments();
      setDepartments(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);

    if (!value.trim()) {
      await loadDepartments();
      return;
    }

    try {
      setLoading(true);
      const data = await searchDepartmentsByNom(value.trim());
      setDepartments(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(departments.length / itemsPerPage));

  const paginatedDepartments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return departments.slice(startIndex, startIndex + itemsPerPage);
  }, [departments, currentPage, itemsPerPage]);

  const startDepartment =
    departments.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endDepartment = Math.min(currentPage * itemsPerPage, departments.length);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

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

        <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder={t.search}
            className={`w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-purple-200 sm:w-64 ${
              isArabic ? "text-right" : "text-left"
            }`}
          />

          <Search size={17} className="text-purple-100" />
        </div>
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
              <Building2 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.list}
              </h2>

              <p className="text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startDepartment} {t.to} {endDepartment} {t.of}{" "}
                {departments.length} {t.departments}
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
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="px-5 py-4 font-black">{t.department}</th>
                <th className="px-5 py-4 font-black">{t.description}</th>
                <th className="px-5 py-4 font-black">{t.status}</th>
                <th className="px-5 py-4 font-black">{t.action}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center">
                    <div
                      className="flex items-center justify-center gap-2 text-sm font-bold"
                      style={mutedTextStyle}
                    >
                      <Loader2 size={18} className="animate-spin" />
                      {t.loading}
                    </div>
                  </td>
                </tr>
              ) : paginatedDepartments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.empty}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedDepartments.map((department) => (
                  <tr
                    key={department.id}
                    className="border-b text-center text-sm last:border-none"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <td className="px-5 py-4 font-black">
                      {department.nom || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="block truncate font-semibold"
                        style={mutedTextStyle}
                      >
                        {department.description || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="rounded-full px-3 py-1.5 text-xs font-black"
                        style={{
                          backgroundColor: "var(--section-bg)",
                          color: "var(--primary-color)",
                        }}
                      >
                        {department.archived ? t.archived : t.active}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedDepartment(department)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                      >
                        <Eye size={15} />
                      </button>
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
              {startDepartment}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endDepartment}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {departments.length}
            </span>{" "}
            {t.departments}
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

      <DepartmentDetails
        department={selectedDepartment}
        onClose={() => setSelectedDepartment(null)}
      />
    </div>
  );
}