import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Loader2,
  Search,
} from "lucide-react";

import { getMyAttendances } from "../services/attendanceService";

const headerGradient =
  "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #134e4a 100%)";

const translations = {
  EN: {
    management:
      "Student / Attendance",

    title:
      "My Attendance",

    subtitle:
      "View attendance records.",

    search:
      "Search attendance...",

    attendanceList:
      "Attendance List",

    total:
      "Total Attendance",

    student:
      "Student",

    date:
      "Date",

    status:
      "Status",

    remark:
      "Remark",

    showing:
      "Showing",

    to:
      "to",

    of:
      "of",

    rows:
      "Rows:",

    page:
      "Page",

    loading:
      "Loading attendance...",

    noData:
      "No attendance found.",

    error:
      "Unable to load attendance.",
  },

  FR: {
    management:
      "Étudiant / Présences",

    title:
      "Mes présences",

    subtitle:
      "Consulter les enregistrements de présence.",

    search:
      "Rechercher une présence...",

    attendanceList:
      "Liste des présences",

    total:
      "Total présences",

    student:
      "Étudiant",

    date:
      "Date",

    status:
      "Statut",

    remark:
      "Remarque",

    showing:
      "Affichage",

    to:
      "à",

    of:
      "sur",

    rows:
      "Lignes :",

    page:
      "Page",

    loading:
      "Chargement des présences...",

    noData:
      "Aucune présence trouvée.",

    error:
      "Impossible de charger les présences.",
  },

  AR: {
    management:
      "الطالب / الحضور",

    title:
      "حضوري",

    subtitle:
      "عرض سجلات الحضور.",

    search:
      "البحث في الحضور...",

    attendanceList:
      "قائمة الحضور",

    total:
      "إجمالي الحضور",

    student:
      "الطالب",

    date:
      "التاريخ",

    status:
      "الحالة",

    remark:
      "ملاحظة",

    showing:
      "عرض",

    to:
      "إلى",

    of:
      "من",

    rows:
      "الأسطر:",

    page:
      "صفحة",

    loading:
      "جاري تحميل الحضور...",

    noData:
      "لا توجد سجلات حضور.",

    error:
      "تعذر تحميل الحضور.",
  },
};

const normalizeAttendances = (
  data
) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (
    Array.isArray(
      data?.data
    )
  ) {
    return data.data;
  }

  if (
    Array.isArray(
      data?.content
    )
  ) {
    return data.content;
  }

  if (
    Array.isArray(
      data?.data?.content
    )
  ) {
    return data.data.content;
  }

  return [];
};

const getStudentName = (
  attendance
) => {
  return (
    `${
      attendance?.studentPrenom ||
      ""
    } ${
      attendance?.studentNom ||
      ""
    }`.trim() ||
    attendance?.studentName ||
    attendance?.studentFullName ||
    `${
      attendance?.student?.prenom ||
      ""
    } ${
      attendance?.student?.nom ||
      ""
    }`.trim() ||
    "-"
  );
};

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const cleanDate =
    String(date).split("T")[0];

  const [year, month, day] =
    cleanDate.split("-");

  if (
    !year ||
    !month ||
    !day
  ) {
    return date;
  }

  return `${day}/${month}/${String(
    year
  ).slice(-2)}`;
};

export default function StudentAttendancePage() {
  const [
    attendances,
    setAttendances,
  ] = useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    rowsPerPage,
    setRowsPerPage,
  ] = useState(5);

  const [
    language,
    setLanguage,
  ] = useState(
    localStorage.getItem(
      "app-language"
    ) || "EN"
  );

  const t =
    translations[language] ||
    translations.EN;

  const isArabic =
    language === "AR";

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

    borderColor:
      "var(--border-color)",

    color:
      "var(--text-color)",
  };

  const textStyle = {
    color:
      "var(--text-color)",
  };

  const mutedTextStyle = {
    color:
      "var(--muted-text)",
  };

  useEffect(() => {
    const handleLanguageChange = (
      event
    ) => {
      setLanguage(
        event.detail ||
          localStorage.getItem(
            "app-language"
          ) ||
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

  const loadAttendances =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getMyAttendances();

        setAttendances(
          normalizeAttendances(
            data
          )
        );
      } catch (
        requestError
      ) {
        console.error(
          "Erreur chargement présences :",
          requestError
        );

        setAttendances([]);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAttendances();
  }, []);

  const filteredAttendances =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return attendances;
      }

      return attendances.filter(
        (attendance) => {
          const studentName =
            getStudentName(
              attendance
            ).toLowerCase();

          const status =
            String(
              attendance?.status ||
                ""
            ).toLowerCase();

          const date =
            String(
              attendance?.date ||
                ""
            ).toLowerCase();

          const remark =
            String(
              attendance?.remarque ||
                attendance?.remark ||
                ""
            ).toLowerCase();

          return (
            studentName.includes(
              value
            ) ||
            status.includes(
              value
            ) ||
            date.includes(
              value
            ) ||
            remark.includes(
              value
            )
          );
        }
      );
    }, [
      attendances,
      search,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredAttendances.length /
          rowsPerPage
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

  const paginatedAttendances =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        rowsPerPage;

      return filteredAttendances.slice(
        start,
        start +
          rowsPerPage
      );
    }, [
      filteredAttendances,
      currentPage,
      rowsPerPage,
    ]);

  const startItem =
    filteredAttendances.length ===
    0
      ? 0
      : (currentPage - 1) *
          rowsPerPage +
        1;

  const endItem =
    Math.min(
      currentPage *
        rowsPerPage,

      filteredAttendances.length
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
      "
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
      style={{
        color:
          "var(--text-color)",
      }}
    >
      {}

      <section
        className="
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
        "
        style={{
          background:
            headerGradient,
        }}
      >
        <div>
          <p className="text-xs font-bold text-teal-100">
            {t.management}
          </p>

          <h1 className="mt-1 text-2xl font-black">
            {t.title}
          </h1>

          <p className="mt-1 text-sm font-semibold text-teal-100/80">
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
          "
        >
          <input
            type="text"
            value={search}
            onChange={(
              event
            ) =>
              setSearch(
                event.target.value
              )
            }
            placeholder={
              t.search
            }
            className="
              w-full
              bg-transparent
              text-sm
              font-semibold
              text-white
              outline-none
              placeholder:text-teal-100/70

              sm:w-64
            "
          />

          <Search
            size={17}
            className="text-teal-100"
          />
        </div>
      </section>

      {}

      <section
        className="
          rounded-[1.5rem]
          border
          p-5
          shadow-sm
        "
        style={cardStyle}
      >
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              text-white
            "
            style={{
              background:
                headerGradient,
            }}
          >
            <ClipboardCheck
              size={21}
            />
          </div>

          <div>
            <h2
              className="text-2xl font-black"
              style={textStyle}
            >
              {
                attendances.length
              }
            </h2>

            <p
              className="text-xs font-semibold"
              style={
                mutedTextStyle
              }
            >
              {t.total}
            </p>
          </div>
        </div>
      </section>

      {}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      {}

      <section
        className="
          overflow-hidden
          rounded-[1.7rem]
          border
          shadow-sm
        "
        style={cardStyle}
      >
        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            px-5
            py-4

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
          style={
            sectionStyle
          }
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-white
              "
              style={{
                background:
                  headerGradient,
              }}
            >
              <ClipboardCheck
                size={19}
              />
            </div>

            <div>
              <h2
                className="text-lg font-black"
                style={textStyle}
              >
                {
                  t.attendanceList
                }
              </h2>

              <p
                className="text-xs font-semibold"
                style={
                  mutedTextStyle
                }
              >
                {t.showing}{" "}
                {startItem}{" "}
                {t.to}{" "}
                {endItem}{" "}
                {t.of}{" "}
                {
                  filteredAttendances.length
                }
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
                rowsPerPage
              }
              onChange={(
                event
              ) => {
                setRowsPerPage(
                  Number(
                    event.target
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed">
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
                <th className="w-[35%] px-5 py-4">
                  {t.student}
                </th>

                <th className="w-[25%] px-5 py-4">
                  {t.date}
                </th>

                <th className="w-[20%] px-5 py-4">
                  {t.status}
                </th>

                <th className="w-[20%] px-5 py-4">
                  {t.remark}
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
                    <div className="flex items-center justify-center gap-2 font-bold">
                      <Loader2
                        className="animate-spin"
                        size={19}
                      />

                      {
                        t.loading
                      }
                    </div>
                  </td>
                </tr>
              ) : paginatedAttendances.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-10 text-center font-bold"
                  >
                    {
                      t.noData
                    }
                  </td>
                </tr>
              ) : (
                paginatedAttendances.map(
                  (
                    attendance
                  ) => {
                    const studentName =
                      getStudentName(
                        attendance
                      );

                    return (
                      <tr
                        key={
                          attendance.id
                        }
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
                        }}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <div
                              className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-teal-100
                                font-black
                                text-teal-700
                              "
                            >
                              {studentName
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <span className="font-black">
                              {
                                studentName
                              }
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {formatDate(
                            attendance.date
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <AttendanceStatus
                            status={
                              attendance.status
                            }
                          />
                        </td>

                        <td
                          className="truncate px-5 py-4"
                          style={
                            mutedTextStyle
                          }
                        >
                          {attendance.remarque ||
                            attendance.remark ||
                            "-"}
                        </td>

                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>

        {}

        <div
          className="
            flex
            flex-col
            gap-3
            border-t
            px-5
            py-4

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
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
            <strong>
              {startItem}
            </strong>{" "}
            {t.to}{" "}
            <strong>
              {endItem}
            </strong>{" "}
            {t.of}{" "}
            <strong>
              {
                filteredAttendances.length
              }
            </strong>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={
                currentPage ===
                1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      1
                    )
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
                disabled:opacity-40
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
              (
                pageNumber
              ) => (
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
                    background:
                      currentPage ===
                      pageNumber
                        ? headerGradient
                        : "var(--input-bg)",

                    borderColor:
                      currentPage ===
                      pageNumber
                        ? "#0d9488"
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
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
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
                disabled:opacity-40
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
      </section>

    </div>
  );
}

function AttendanceStatus({
  status,
}) {
  const value =
    String(status || "")
      .trim()
      .toUpperCase();

  if (
    [
      "PRESENT",
      "PRÉSENT",
    ].includes(value)
  ) {
    return (
      <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
        {status}
      </span>
    );
  }

  if (
    [
      "ABSENT",
      "ABSENCE",
    ].includes(value)
  ) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-black text-red-700">
        {status}
      </span>
    );
  }

  if (
    [
      "LATE",
      "RETARD",
    ].includes(value)
  ) {
    return (
      <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-700">
        {status}
      </span>
    );
  }

  return (
    <span className="rounded-full bg-teal-100 px-3 py-1.5 text-xs font-black text-teal-700">
      {status || "-"}
    </span>
  );
}