import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  FileDown,
  Loader2,
  Search,
  Users,
  Eye,
} from "lucide-react";

import {
  downloadStudentsPdf,
  getAllStudents,
  searchStudentsByNom,
} from "../services/studentService";

import StudentDetails from "../components/StudentDetails";

const headerGradient =
  "linear-gradient(135deg, #c2410c 0%, #9a3412 45%, #431407 100%)";

const translations = {
  EN: {
    badge: "Manager / Students",
    title: "Students List",
    subtitle: "View and search students.",

    search: "Search students...",
    pdf: "PDF",
    downloading: "Downloading...",

    totalStudents: "Total students",
    studentsList: "Students list",

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
    actions: "Actions",

    view: "View",
    page: "Page",

    loadingStudents: "Loading students...",
    noStudents: "No students found.",

    loadError: "Unable to load students.",
    searchError: "Unable to search students.",
    pdfError: "Unable to download PDF.",
  },

  FR: {
    badge: "Manager / Étudiants",
    title: "Liste des étudiants",
    subtitle: "Consultation et recherche des étudiants.",

    search: "Rechercher un étudiant...",
    pdf: "PDF",
    downloading: "Téléchargement...",

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
    actions: "Actions",

    view: "Voir",
    page: "Page",

    loadingStudents:
      "Chargement des étudiants...",
    noStudents:
      "Aucun étudiant trouvé.",

    loadError:
      "Impossible de charger les étudiants.",
    searchError:
      "Impossible de rechercher les étudiants.",
    pdfError:
      "Impossible de télécharger le PDF.",
  },

  AR: {
    badge: "المدير / الطلاب",
    title: "قائمة الطلاب",
    subtitle: "عرض والبحث عن الطلاب.",

    search: "البحث عن طالب...",
    pdf: "PDF",
    downloading: "جاري التحميل...",

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
    actions: "الإجراءات",

    view: "عرض",
    page: "الصفحة",

    loadingStudents:
      "جاري تحميل الطلاب...",
    noStudents:
      "لا يوجد طلاب.",

    loadError:
      "تعذر تحميل الطلاب.",
    searchError:
      "تعذر البحث عن الطلاب.",
    pdfError:
      "تعذر تحميل ملف PDF.",
  },
};

/* =========================
   HELPERS
========================= */

const normalizeStudents = (data) => {
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

const getStudentFullName = (student) => {
  const nom =
    student?.nom || "";

  const prenom =
    student?.prenom || "";

  return `${nom} ${prenom}`.trim() || "-";
};

/* =====================================================
   STUDENT PAGE
===================================================== */

export default function StudentPage() {
  const [students, setStudents] =
    useState([]);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [searchValue, setSearchValue] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [pdfLoading, setPdfLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [language, setLanguage] =
    useState(
      localStorage.getItem(
        "app-language"
      ) || "EN"
    );

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  const t =
    translations[language] ||
    translations.EN;

  const isArabic =
    language === "AR";

  /* =========================
     STYLES
  ========================= */

  const cardStyle = {
    backgroundColor:
      "var(--card-bg)",

    borderColor:
      "var(--border-color)",

    color:
      "var(--text-color)",
  };

  const sectionStyle = {
    backgroundColor:
      "var(--section-bg)",

    borderColor:
      "var(--border-color)",
  };

  const inputStyle = {
    backgroundColor:
      "var(--input-bg)",

    color:
      "var(--text-color)",

    borderColor:
      "var(--border-color)",
  };

  const textStyle = {
    color:
      "var(--text-color)",
  };

  const mutedTextStyle = {
    color:
      "var(--muted-text)",
  };

  /* =========================
     LANGUAGE
  ========================= */

  useEffect(() => {
    const handleLanguageChange = (
      event
    ) => {
      const nextLanguage =
        event.detail ||
        localStorage.getItem(
          "app-language"
        ) ||
        "EN";

      setLanguage(
        nextLanguage
      );
    };

    window.addEventListener(
      "app-language-change",
      handleLanguageChange
    );

    window.addEventListener(
      "storage",
      handleLanguageChange
    );

    return () => {
      window.removeEventListener(
        "app-language-change",
        handleLanguageChange
      );

      window.removeEventListener(
        "storage",
        handleLanguageChange
      );
    };
  }, []);

  /* =========================
     LOAD STUDENTS
  ========================= */

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAllStudents();

      setStudents(
        normalizeStudents(data)
      );

      setCurrentPage(1);
    } catch (requestError) {
      console.error(
        "Erreur chargement étudiants :",
        requestError
      );

      setStudents([]);

      setError(
        t.loadError
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  /* =========================
     SEARCH
  ========================= */

  const handleSearch = async () => {
    const nom =
      searchValue.trim();

    if (!nom) {
      await loadStudents();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await searchStudentsByNom(
          nom
        );

      setStudents(
        normalizeStudents(data)
      );

      setCurrentPage(1);
    } catch (requestError) {
      console.error(
        "Erreur recherche étudiants :",
        requestError
      );

      setStudents([]);

      setError(
        t.searchError
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (
    event
  ) => {
    const value =
      event.target.value;

    setSearchValue(value);

    setCurrentPage(1);

    if (!value.trim()) {
      await loadStudents();
    }
  };

  /* =========================
     PDF
  ========================= */

  const handleDownloadPdf =
    async () => {
      try {
        setPdfLoading(true);
        setError("");

        const pdfData =
          await downloadStudentsPdf();

        const blob = new Blob(
          [pdfData],
          {
            type: "application/pdf",
          }
        );

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          "liste_etudiants.pdf";

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          url
        );
      } catch (requestError) {
        console.error(
          "Erreur téléchargement PDF :",
          requestError
        );

        setError(
          t.pdfError
        );
      } finally {
        setPdfLoading(false);
      }
    };

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      students.length /
      itemsPerPage
    )
  );

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const paginatedStudents =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        itemsPerPage;

      return students.slice(
        startIndex,
        startIndex +
        itemsPerPage
      );
    }, [
      students,
      currentPage,
      itemsPerPage,
    ]);

  const startStudent =
    students.length === 0
      ? 0
      : (currentPage - 1) *
      itemsPerPage +
      1;

  const endStudent = Math.min(
    currentPage *
    itemsPerPage,

    students.length
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
      style={{
        backgroundColor:
          "var(--app-bg)",

        color:
          "var(--text-color)",
      }}
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      {/* =====================
          HEADER
      ===================== */}

      <div
        className={`
          flex
          flex-col
          gap-4
          rounded-[1.7rem]
          border
          border-white/15
          px-6
          py-5
          text-white
          shadow-sm

          lg:flex-row
          lg:items-center
          lg:justify-between

          ${isArabic
            ? "lg:flex-row-reverse text-right"
            : "text-left"
          }
        `}
        style={{
          background:
            headerGradient,
        }}
      >
        <div>
          <p className="text-xs font-semibold text-orange-200">
            {t.badge}
          </p>

          <h1 className="mt-1 text-2xl font-black text-white">
            {t.title}
          </h1>

          <p className="mt-1 text-sm font-semibold text-orange-100/80">
            {t.subtitle}
          </p>
        </div>

        <div
          className={`
            flex
            flex-col
            gap-3

            sm:flex-row
            sm:items-center

            ${isArabic
              ? "sm:flex-row-reverse"
              : ""
            }
          `}
        >
          {/* SEARCH */}

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
              value={
                searchValue
              }
              onChange={
                handleSearchChange
              }
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  handleSearch();
                }
              }}
              placeholder={
                t.search
              }
              className={`
                w-full
                bg-transparent
                text-sm
                font-semibold
                text-white
                outline-none
                placeholder:text-orange-100/70

                sm:w-64

                ${isArabic
                  ? "text-right"
                  : "text-left"
                }
              `}
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="
    flex
    h-8
    w-8
    shrink-0
    items-center
    justify-center
    rounded-full
    bg-transparent
    text-orange-100
    transition
    hover:bg-white/10
    disabled:opacity-60
  "
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* PDF */}

          <button
            type="button"
            onClick={
              handleDownloadPdf
            }
            disabled={
              pdfLoading
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-full
              bg-orange-500
              px-5
              text-sm
              font-black
              text-white
              transition
              hover:bg-orange-600
              disabled:opacity-60
            "
          >
            {pdfLoading ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <FileDown
                size={17}
              />
            )}

            {pdfLoading
              ? t.downloading
              : t.pdf}
          </button>
        </div>
      </div>

      {/* =====================
          TOTAL
      ===================== */}

      <div
        className="
          rounded-[1.4rem]
          border
          p-5
          shadow-sm
        "
        style={
          cardStyle
        }
      >
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-orange-600
              text-white
            "
          >
            <Users className="h-5 w-5" />
          </div>

          <div>
            <h3
              className="text-2xl font-black"
              style={
                textStyle
              }
            >
              {students.length}
            </h3>

            <p
              className="text-xs font-semibold"
              style={
                mutedTextStyle
              }
            >
              {
                t.totalStudents
              }
            </p>
          </div>
        </div>
      </div>

      {/* =====================
          ERROR
      ===================== */}

      {error && (
        <div
          className="
            rounded-[1.4rem]
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

      {/* =====================
          TABLE
      ===================== */}

      <div
        className="
          overflow-hidden
          rounded-[1.4rem]
          border
          shadow-sm
        "
        style={
          cardStyle
        }
      >
        {/* TABLE HEADER */}

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

            ${isArabic
              ? "lg:flex-row-reverse"
              : ""
            }
          `}
          style={
            sectionStyle
          }
        >
          <div
            className={`
              flex
              items-center
              gap-3

              ${isArabic
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
                bg-orange-600
                text-white
              "
            >
              <Users
                size={20}
              />
            </div>

            <div>
              <h2
                className="text-lg font-black"
                style={
                  textStyle
                }
              >
                {
                  t.studentsList
                }
              </h2>

              <p
                className="mt-0.5 text-xs font-semibold"
                style={
                  mutedTextStyle
                }
              >
                {t.showing}{" "}
                {startStudent}{" "}
                {t.to}{" "}
                {endStudent}{" "}
                {t.of}{" "}
                {students.length}{" "}
                {t.students}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black"
              style={
                mutedTextStyle
              }
            >
              {t.rows}
            </span>

            <select
              value={
                itemsPerPage
              }
              onChange={(
                event
              ) => {
                setItemsPerPage(
                  Number(
                    event
                      .target
                      .value
                  )
                );

                setCurrentPage(
                  1
                );
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
              style={
                inputStyle
              }
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

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table
            className="
              w-full
              min-w-[1050px]
              table-fixed
              border-collapse
            "
          >
            <thead>
              <tr
                className="
                  border-b
                  text-center
                  text-[11px]
                  uppercase
                  tracking-wide
                "
                style={{
                  borderColor:
                    "var(--border-color)",

                  color:
                    "var(--muted-text)",
                }}
              >
                <th className="w-[22%] px-5 py-4 font-black">
                  {t.student}
                </th>

                <th className="w-[23%] px-5 py-4 font-black">
                  {t.email}
                </th>

                <th className="w-[13%] px-5 py-4 font-black">
                  {t.gender}
                </th>

                <th className="w-[15%] px-5 py-4 font-black">
                  {t.phone}
                </th>

                <th className="w-[17%] px-5 py-4 font-black">
                  {t.address}
                </th>

                <th className="w-[10%] px-5 py-4 font-black">
                  {t.actions}
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="
                      px-5
                      py-10
                      text-center
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        font-bold
                      "
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />

                      {
                        t.loadingStudents
                      }
                    </div>
                  </td>
                </tr>
              ) : paginatedStudents.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="
                      px-5
                      py-10
                      text-center
                      font-bold
                    "
                  >
                    {
                      t.noStudents
                    }
                  </td>
                </tr>
              ) : (
                paginatedStudents.map(
                  (student) => {
                    const fullName =
                      getStudentFullName(
                        student
                      );

                    return (
                      <tr
                        key={
                          student?.id ??
                          student?.email
                        }
                        className="
                          border-b
                          text-center
                          text-sm
                          transition
                          last:border-none

                          hover:bg-orange-500/5
                        "
                        style={{
                          borderColor:
                            "var(--border-color)",

                          color:
                            "var(--text-color)",
                        }}
                      >
                        {/* STUDENT */}

                        <td className="px-5 py-4">
                          <div
                            className="
                              mx-auto
                              flex
                              max-w-full
                              items-center
                              justify-center
                              gap-3
                            "
                          >
                            <div
                              className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-orange-100
                                font-black
                                text-orange-700
                              "
                            >
                              {fullName
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0 text-center">
                              <p
                                className="truncate font-black"
                                style={
                                  textStyle
                                }
                              >
                                {
                                  fullName
                                }
                              </p>

                              <p
                                className="mt-0.5 text-xs font-semibold"
                                style={
                                  mutedTextStyle
                                }
                              >
                                {
                                  t.student
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}

                        <td className="px-5 py-4">
                          <span
                            className="
                              block
                              truncate
                              text-sm
                              font-semibold
                            "
                            style={
                              mutedTextStyle
                            }
                          >
                            {student?.email ||
                              "-"}
                          </span>
                        </td>

                        {/* GENDER */}

                        <td className="px-5 py-4">
                          <span
                            className="
                              inline-flex
                              rounded-full
                              bg-orange-100
                              px-3
                              py-1.5
                              text-xs
                              font-black
                              text-orange-700
                            "
                          >
                            {student?.genre ||
                              "-"}
                          </span>
                        </td>

                        {/* PHONE */}

                        <td className="px-5 py-4">
                          <span
                            className="
                              block
                              truncate
                              text-sm
                              font-semibold
                            "
                            style={
                              mutedTextStyle
                            }
                          >
                            {student?.telephone ||
                              "-"}
                          </span>
                        </td>

                        {/* ADDRESS */}

                        <td className="px-5 py-4">
                          <span
                            className="
                              block
                              truncate
                              text-sm
                              font-semibold
                            "
                            style={
                              mutedTextStyle
                            }
                          >
                            {student?.adresse ||
                              "-"}
                          </span>
                        </td>

                        {/* DETAILS */}

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedStudent(
                                student
                              )
                            }
                            title={
                              t.view
                            }
                            className="
                              inline-flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              bg-blue-600
                              text-white
                              transition

                              hover:bg-blue-700
                            "
                          >
                            <Eye
                              size={15}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>

        {/* =====================
            PAGINATION
        ===================== */}

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

            ${isArabic
              ? "lg:flex-row-reverse"
              : ""
            }
          `}
          style={
            sectionStyle
          }
        >
          <p
            className="text-xs font-semibold"
            style={
              mutedTextStyle
            }
          >
            {t.showing}{" "}
            {startStudent}{" "}
            {t.to}{" "}
            {endStudent}{" "}
            {t.of}{" "}
            {students.length}{" "}
            {t.students}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
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

                disabled:opacity-50
              "
              style={
                inputStyle
              }
            >
              <ChevronLeft
                size={16}
              />
            </button>

            {visiblePages.map(
              (pageNumber) => (
                <button
                  key={
                    pageNumber
                  }
                  type="button"
                  onClick={() =>
                    setCurrentPage(
                      pageNumber
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
                  "
                  style={{
                    backgroundColor:
                      currentPage ===
                        pageNumber
                        ? "#c2410c"
                        : "var(--input-bg)",

                    borderColor:
                      currentPage ===
                        pageNumber
                        ? "#c2410c"
                        : "var(--border-color)",

                    color:
                      currentPage ===
                        pageNumber
                        ? "#ffffff"
                        : "var(--text-color)",
                  }}
                >
                  {
                    pageNumber
                  }
                </button>
              )
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      page + 1,
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

                disabled:opacity-50
              "
              style={
                inputStyle
              }
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
              style={
                inputStyle
              }
            >
              {t.page}{" "}
              {currentPage} /{" "}
              {totalPages}
            </span>
          </div>
        </div>
      </div>


      <StudentDetails
        student={
          selectedStudent
        }
        onClose={() =>
          setSelectedStudent(
            null
          )
        }
      />
    </div>
  );
}