import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Search,
} from "lucide-react";

import {
  getAllDepartments,
  searchDepartmentByName,
} from "../services/DepartmentsService";

import DepartmentDetails from "../components/DepartmentDetails";

const headerGradient =
  "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #134e4a 100%)";

const translations = {
  EN: {
    management: "Student / Departments",
    title: "Departments",
    subtitle: "View available departments.",

    search: "Search department...",
    list: "Departments List",
    total: "Total Departments",

    department: "Department",
    description: "Description",
    status: "Status",
    action: "Action",

    active: "Active",
    archived: "Archived",

    showing: "Showing",
    to: "to",
    of: "of",
    departments: "departments",
    rows: "Rows:",
    page: "Page",

    loading: "Loading departments...",
    noData: "No departments found.",
    error: "Unable to load departments.",
  },

  FR: {
    management: "Étudiant / Départements",
    title: "Départements",
    subtitle: "Consulter les départements disponibles.",

    search: "Rechercher un département...",
    list: "Liste des départements",
    total: "Total départements",

    department: "Département",
    description: "Description",
    status: "Statut",
    action: "Action",

    active: "Actif",
    archived: "Archivé",

    showing: "Affichage de",
    to: "à",
    of: "sur",
    departments: "départements",
    rows: "Lignes :",
    page: "Page",

    loading: "Chargement des départements...",
    noData: "Aucun département trouvé.",
    error: "Impossible de charger les départements.",
  },

  AR: {
    management: "الطالب / الأقسام",
    title: "الأقسام",
    subtitle: "عرض الأقسام المتاحة.",

    search: "البحث عن قسم...",
    list: "قائمة الأقسام",
    total: "إجمالي الأقسام",

    department: "القسم",
    description: "الوصف",
    status: "الحالة",
    action: "الإجراء",

    active: "نشط",
    archived: "مؤرشف",

    showing: "عرض",
    to: "إلى",
    of: "من",
    departments: "أقسام",
    rows: "الأسطر:",
    page: "صفحة",

    loading: "جاري تحميل الأقسام...",
    noData: "لا توجد أقسام.",
    error: "تعذر تحميل الأقسام.",
  },
};

const normalizeDepartments = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.data?.content)) {
    return data.data.content;
  }

  return [];
};

const getDepartmentName = (department) => {
  return (
    department?.nom ||
    department?.name ||
    department?.departmentName ||
    department?.departementNom ||
    "-"
  );
};

const getDepartmentDescription = (department) => {
  return (
    department?.description ||
    department?.details ||
    department?.descriptionDepartement ||
    "-"
  );
};

export default function DepartmentsStudentPage() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [
    selectedDepartment,
    setSelectedDepartment,
  ] = useState(null);

  const [
    detailsOpen,
    setDetailsOpen,
  ] = useState(false);

  const [
    detailsLoading,
    setDetailsLoading,
  ] = useState(false);

  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t =
    translations[language] ||
    translations.EN;

  const isArabic =
    language === "AR";

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

  const textStyle = {
    color: "var(--text-color)",
  };

  const mutedTextStyle = {
    color: "var(--muted-text)",
  };

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(
        event.detail ||
          localStorage.getItem("app-language") ||
          "EN"
      );
    };

    window.addEventListener(
      "app-language-change",
      handleLanguageChange
    );

    return () => {
      window.removeEventListener(
        "app-language-change",
        handleLanguageChange
      );
    };
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAllDepartments();

      setDepartments(
        normalizeDepartments(data)
      );

      setCurrentPage(1);
    } catch (requestError) {
      console.error(
        "Erreur chargement départements :",
        requestError
      );

      setDepartments([]);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const filteredDepartments =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return departments;
      }

      return departments.filter(
        (department) => {
          const name =
            getDepartmentName(
              department
            ).toLowerCase();

          const description =
            getDepartmentDescription(
              department
            ).toLowerCase();

          return (
            name.includes(value) ||
            description.includes(value)
          );
        }
      );
    }, [
      departments,
      search,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredDepartments.length /
          rowsPerPage
      )
    );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const paginatedDepartments =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        rowsPerPage;

      return filteredDepartments.slice(
        start,
        start + rowsPerPage
      );
    }, [
      filteredDepartments,
      currentPage,
      rowsPerPage,
    ]);

  const startDepartment =
    filteredDepartments.length === 0
      ? 0
      : (currentPage - 1) *
          rowsPerPage +
        1;

  const endDepartment =
    Math.min(
      currentPage *
        rowsPerPage,
      filteredDepartments.length
    );

  const visiblePages =
    Array.from(
      {
        length:
          totalPages,
      },
      (_, index) =>
        index + 1
    ).slice(
      Math.max(
        currentPage - 3,
        0
      ),
      Math.min(
        currentPage + 2,
        totalPages
      )
    );

  const handleDetails = async (department) => {
    try {
      setDetailsLoading(true);

      const departmentName =
        getDepartmentName(
          department
        );

      const data =
        await searchDepartmentByName(
          departmentName
        );

      const result =
        Array.isArray(data)
          ? data[0]
          : data;

      setSelectedDepartment(
        result ||
          department
      );

      setDetailsOpen(true);
    } catch (requestError) {
      console.error(
        "Erreur détails département :",
        requestError
      );

      setSelectedDepartment(
        department
      );

      setDetailsOpen(true);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        space-y-5
        px-2
        py-1
        transition-colors
        duration-300
      "
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
      style={{
        backgroundColor:
          "var(--app-bg)",
        color:
          "var(--text-color)",
      }}
    >
      <div
        className={`
          flex
          flex-col
          gap-4
          rounded-[1.7rem]
          border
          px-6
          py-5
          text-white
          shadow-sm

          lg:flex-row
          lg:items-center
          lg:justify-between

          ${
            isArabic
              ? "lg:flex-row-reverse text-right"
              : "text-left"
          }
        `}
        style={{
          borderColor:
            "var(--border-color)",
          background:
            headerGradient,
        }}
      >
        <div>
          <p className="text-xs font-semibold text-teal-200">
            {t.management}
          </p>

          <h1 className="mt-1 text-2xl font-black text-white">
            {t.title}
          </h1>

          <p className="mt-1 text-sm font-semibold text-teal-100">
            {t.subtitle}
          </p>
        </div>

        <div
          className="
            flex
            h-11
            items-center
            gap-2
            rounded-full
            border
            border-white/15
            bg-white/10
            px-4
            backdrop-blur-xl
          "
        >
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(
                event.target.value
              );

              setCurrentPage(1);
            }}
            placeholder={t.search}
            className={`
              w-full
              bg-transparent
              text-sm
              font-semibold
              text-white
              outline-none
              placeholder:text-teal-200
              sm:w-64

              ${
                isArabic
                  ? "text-right"
                  : "text-left"
              }
            `}
          />

          <Search
            size={17}
            className="text-teal-100"
          />
        </div>
      </div>

      {error && (
        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            font-bold
            text-red-600
          "
        >
          {error}
        </div>
      )}

      <div
        className="
          overflow-hidden
          rounded-[1.4rem]
          border
          shadow-sm
          transition-colors
          duration-300
        "
        style={cardStyle}
      >
        <div
          className={`
            flex
            flex-col
            gap-3
            border-b
            px-5
            py-4

            lg:flex-row
            lg:items-center
            lg:justify-between

            ${
              isArabic
                ? "lg:flex-row-reverse"
                : ""
            }
          `}
          style={sectionStyle}
        >
          <div
            className={`
              flex
              items-center
              gap-3

              ${
                isArabic
                  ? "flex-row-reverse text-right"
                  : "text-left"
              }
            `}
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-white
              "
              style={{
                background:
                  headerGradient,
              }}
            >
              <Building2
                size={20}
              />
            </div>

            <div>
              <h2
                className="text-lg font-black"
                style={textStyle}
              >
                {t.list}
              </h2>

              <p
                className="text-xs font-semibold"
                style={mutedTextStyle}
              >
                {t.showing}{" "}
                {startDepartment}{" "}
                {t.to}{" "}
                {endDepartment}{" "}
                {t.of}{" "}
                {filteredDepartments.length}{" "}
                {t.departments}
              </p>
            </div>
          </div>

          <div
            className={`
              flex
              items-center
              gap-2

              ${
                isArabic
                  ? "flex-row-reverse"
                  : ""
              }
            `}
          >
            <span
              className="text-xs font-black"
              style={mutedTextStyle}
            >
              {t.rows}
            </span>

            <select
              value={rowsPerPage}
              onChange={(event) => {
                setRowsPerPage(
                  Number(
                    event.target.value
                  )
                );

                setCurrentPage(1);
              }}
              className="
                rounded-xl
                border
                px-3
                py-2
                text-xs
                font-bold
                outline-none
                transition
              "
              style={inputStyle}
            >
              <option value={5}>
                5
              </option>

              <option value={10}>
                10
              </option>

              <option value={15}>
                15
              </option>

              <option value={20}>
                20
              </option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr
                className="
                  border-b
                  text-center
                  text-[11px]
                  uppercase
                "
                style={{
                  borderColor:
                    "var(--border-color)",
                  color:
                    "var(--muted-text)",
                }}
              >
                <th className="px-5 py-4 font-black">
                  {t.department}
                </th>

                <th className="px-5 py-4 font-black">
                  {t.description}
                </th>

                <th className="px-5 py-4 font-black">
                  {t.status}
                </th>

                <th className="px-5 py-4 font-black">
                  {t.action}
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-10 text-center"
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-sm
                        font-bold
                      "
                      style={mutedTextStyle}
                    >
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      {t.loading}
                    </div>
                  </td>
                </tr>
              ) : paginatedDepartments.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-10 text-center"
                  >
                    <span
                      className="text-sm font-bold"
                      style={mutedTextStyle}
                    >
                      {t.noData}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedDepartments.map(
                  (department) => (
                    <tr
                      key={department.id}
                      className="
                        border-b
                        text-center
                        text-sm
                        transition
                        last:border-none
                        hover:bg-teal-500/5
                      "
                      style={{
                        borderColor:
                          "var(--border-color)",
                        color:
                          "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4 font-black">
                        {getDepartmentName(
                          department
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="
                            block
                            truncate
                            font-semibold
                          "
                          style={mutedTextStyle}
                        >
                          {getDepartmentDescription(
                            department
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="
                            rounded-full
                            px-3
                            py-1.5
                            text-xs
                            font-black
                          "
                          style={{
                            backgroundColor:
                              "var(--section-bg)",
                            color:
                              "var(--primary-color)",
                          }}
                        >
                          {department.archived
                            ? t.archived
                            : t.active}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleDetails(
                              department
                            )
                          }
                          disabled={
                            detailsLoading
                          }
                          className="
                            inline-flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-teal-600
                            text-white
                            transition
                            hover:bg-teal-700

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          {detailsLoading ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Eye
                              size={15}
                            />
                          )}
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        <div
          className={`
            flex
            flex-col
            gap-3
            border-t
            px-5
            py-4

            lg:flex-row
            lg:items-center
            lg:justify-between

            ${
              isArabic
                ? "lg:flex-row-reverse"
                : ""
            }
          `}
          style={sectionStyle}
        >
          <p
            className="text-xs font-semibold"
            style={mutedTextStyle}
          >
            {t.showing}{" "}

            <span
              className="font-black"
              style={textStyle}
            >
              {startDepartment}
            </span>{" "}

            {t.to}{" "}

            <span
              className="font-black"
              style={textStyle}
            >
              {endDepartment}
            </span>{" "}

            {t.of}{" "}

            <span
              className="font-black"
              style={textStyle}
            >
              {filteredDepartments.length}
            </span>{" "}

            {t.departments}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (previous) =>
                    Math.max(
                      previous - 1,
                      1
                    )
                )
              }
              disabled={
                currentPage === 1
              }
              className="
                inline-flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                shadow-sm
                transition

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              style={inputStyle}
            >
              <ChevronLeft
                size={16}
              />
            </button>

            {visiblePages.map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    text-xs
                    font-black
                    transition
                  "
                  style={{
                    background:
                      currentPage === page
                        ? headerGradient
                        : "var(--input-bg)",

                    borderColor:
                      "var(--border-color)",

                    color:
                      currentPage === page
                        ? "#ffffff"
                        : "var(--text-color)",
                  }}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (previous) =>
                    Math.min(
                      previous + 1,
                      totalPages
                    )
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className="
                inline-flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                shadow-sm
                transition

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              style={inputStyle}
            >
              <ChevronRight
                size={16}
              />
            </button>

            <span
              className="
                rounded-xl
                border
                px-4
                py-2
                text-xs
                font-black
              "
              style={inputStyle}
            >
              {t.page}{" "}
              {currentPage} /{" "}
              {totalPages}
            </span>
          </div>
        </div>
      </div>

      <DepartmentDetails
        open={detailsOpen}
        department={selectedDepartment}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedDepartment(null);
        }}
      />
    </div>
  );
}