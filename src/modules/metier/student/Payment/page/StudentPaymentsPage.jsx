import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Eye,
  Loader2,
  Search,
  User,
} from "lucide-react";

import {
  getAllPayements,
  getPayementById,
} from "../services/paymentService";

import DetailsPayments from "../components/DetailsPayments";

/* =====================================================
   STYLE
===================================================== */

const headerGradient =
  "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #115e59 100%)";

/* =====================================================
   TRANSLATIONS
===================================================== */

const translations = {
  EN: {
    management: "Student / Payments",
    title: "My Payments",
    subtitle: "View your payment information.",

    search: "Search payment...",
    list: "Payments List",
    total: "Total Payments",

    student: "Student",
    amount: "Amount",
    date: "Date",
    status: "Status",
    actions: "Actions",
    view: "View details",

    showing: "Showing",
    to: "to",
    of: "of",
    rows: "Rows:",
    page: "Page",

    loading: "Loading payments...",
    noData: "No payments found.",
    error: "Unable to load payments.",
  },

  FR: {
    management: "Étudiant / Paiements",
    title: "Mes paiements",
    subtitle: "Consulter vos informations de paiement.",

    search: "Rechercher un paiement...",
    list: "Liste des paiements",
    total: "Total paiements",

    student: "Étudiant",
    amount: "Montant",
    date: "Date",
    status: "Statut",
    actions: "Actions",
    view: "Voir les détails",

    showing: "Affichage",
    to: "à",
    of: "sur",
    rows: "Lignes :",
    page: "Page",

    loading: "Chargement des paiements...",
    noData: "Aucun paiement trouvé.",
    error: "Impossible de charger les paiements.",
  },

  AR: {
    management: "الطالب / المدفوعات",
    title: "مدفوعاتي",
    subtitle: "عرض معلومات المدفوعات الخاصة بك.",

    search: "البحث عن دفعة...",
    list: "قائمة المدفوعات",
    total: "إجمالي المدفوعات",

    student: "الطالب",
    amount: "المبلغ",
    date: "التاريخ",
    status: "الحالة",
    actions: "الإجراءات",
    view: "عرض التفاصيل",

    showing: "عرض",
    to: "إلى",
    of: "من",
    rows: "الأسطر:",
    page: "صفحة",

    loading: "جاري تحميل المدفوعات...",
    noData: "لا توجد مدفوعات.",
    error: "تعذر تحميل المدفوعات.",
  },
};

/* =====================================================
   HELPERS
===================================================== */

const normalizePayements = (data) => {
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

const getStudentName = (payement) => {
  return (
    `${payement?.studentPrenom || ""} ${payement?.studentNom || ""}`.trim() ||
    payement?.studentName ||
    payement?.studentFullName ||
    `${payement?.student?.prenom || ""} ${payement?.student?.nom || ""}`.trim() ||
    "-"
  );
};

const formatAmount = (amount) => {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return amount || "-";
  }

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

const formatDate = (date, language) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  const locale =
    language === "AR"
      ? "ar-MA"
      : language === "FR"
      ? "fr-FR"
      : "en-US";

  return parsedDate.toLocaleDateString(locale);
};

/* =====================================================
   PAGE
===================================================== */

export default function StudentPaymentsPage() {
  const [payements, setPayements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedPayement, setSelectedPayement] =
    useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t =
    translations[language] ||
    translations.EN;

  const isArabic =
    language === "AR";

  /* =====================================================
     THEME
  ===================================================== */

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

  /* =====================================================
     LANGUAGE
  ===================================================== */

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

  /* =====================================================
     LOAD PAYEMENTS
  ===================================================== */

  const loadPayements = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAllPayements();

      setPayements(
        normalizePayements(data)
      );
    } catch (requestError) {
      console.error(
        "Erreur chargement paiements :",
        requestError
      );

      setPayements([]);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayements();
  }, []);

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredPayements =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return payements;
      }

      return payements.filter(
        (payement) => {
          const studentName =
            getStudentName(
              payement
            ).toLowerCase();

          const amount =
            String(
              payement?.amount ?? ""
            ).toLowerCase();

          const date =
            String(
              payement?.date ?? ""
            ).toLowerCase();

          const status =
            String(
              payement?.status ?? ""
            ).toLowerCase();

          return (
            studentName.includes(value) ||
            amount.includes(value) ||
            date.includes(value) ||
            status.includes(value)
          );
        }
      );
    }, [
      payements,
      search,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredPayements.length /
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

  const paginatedPayements =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        rowsPerPage;

      return filteredPayements.slice(
        start,
        start + rowsPerPage
      );
    }, [
      filteredPayements,
      currentPage,
      rowsPerPage,
    ]);

  const startItem =
    filteredPayements.length === 0
      ? 0
      : (currentPage - 1) *
          rowsPerPage +
        1;

  const endItem =
    Math.min(
      currentPage *
        rowsPerPage,

      filteredPayements.length
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

  /* =====================================================
     DETAILS
  ===================================================== */

  const handleDetails =
    async (payement) => {
      try {
        setDetailsLoading(true);

        const data =
          await getPayementById(
            payement.id
          );

        setSelectedPayement(
          data ||
            payement
        );

        setDetailsOpen(true);
      } catch (requestError) {
        console.error(
          "Erreur détails paiement :",
          requestError
        );

        setSelectedPayement(
          payement
        );

        setDetailsOpen(true);
      } finally {
        setDetailsLoading(false);
      }
    };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedPayement(null);
  };

  /* =====================================================
     RENDER
  ===================================================== */

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
      {/* HEADER */}

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
          "
        >
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder={t.search}
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

      {/* TOTAL */}

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
            <CircleDollarSign
              size={21}
            />
          </div>

          <div>
            <h2
              className="text-2xl font-black"
              style={textStyle}
            >
              {payements.length}
            </h2>

            <p
              className="text-xs font-semibold"
              style={mutedTextStyle}
            >
              {t.total}
            </p>
          </div>
        </div>
      </section>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      {/* TABLE */}

      <section
        className="
          overflow-hidden
          rounded-[1.7rem]
          border
          shadow-sm
        "
        style={cardStyle}
      >
        {/* TABLE TOP */}

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
          style={sectionStyle}
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
              <CircleDollarSign
                size={19}
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
                {startItem}{" "}
                {t.to}{" "}
                {endItem}{" "}
                {t.of}{" "}
                {filteredPayements.length}
              </p>
            </div>
          </div>

          {/* ROWS */}

          <div className="flex items-center gap-2">
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

        {/* TABLE */}

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
                <th className="w-[26%] px-5 py-4">
                  {t.student}
                </th>

                <th className="w-[22%] px-5 py-4">
                  {t.amount}
                </th>

                <th className="w-[22%] px-5 py-4">
                  {t.date}
                </th>

                <th className="w-[18%] px-5 py-4">
                  {t.status}
                </th>

                <th className="w-[12%] px-5 py-4">
                  {t.actions}
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 font-bold">
                      <Loader2
                        className="animate-spin"
                        size={19}
                      />

                      {t.loading}
                    </div>
                  </td>
                </tr>
              ) : paginatedPayements.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center font-bold"
                  >
                    {t.noData}
                  </td>
                </tr>
              ) : (
                paginatedPayements.map(
                  (payement) => {
                    const studentName =
                      getStudentName(
                        payement
                      );

                    return (
                      <tr
                        key={payement.id}
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
                        {/* STUDENT */}

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <div
                              className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-teal-100
                                font-black
                                text-teal-700
                              "
                            >
                              {studentName !== "-"
                                ? studentName
                                    .charAt(0)
                                    .toUpperCase()
                                : (
                                  <User size={17} />
                                )}
                            </div>

                            <div className="min-w-0">
                              <p
                                className="truncate font-black"
                                style={textStyle}
                              >
                                {studentName}
                              </p>

                              <p
                                className="mt-1 text-xs font-semibold"
                                style={mutedTextStyle}
                              >
                                {t.student}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* AMOUNT */}

                        <td className="px-5 py-4">
                          <span className="font-black text-teal-600">
                            {formatAmount(
                              payement.amount
                            )}{" "}
                            MAD
                          </span>
                        </td>

                        {/* DATE */}

                        <td
                          className="px-5 py-4 font-semibold"
                          style={mutedTextStyle}
                        >
                          {formatDate(
                            payement.date,
                            language
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <PaymentStatusBadge
                            status={
                              payement.status
                            }
                          />
                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleDetails(
                                payement
                              )
                            }
                            disabled={
                              detailsLoading
                            }
                            title={t.view}
                            className="
                              inline-flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              bg-teal-600
                              text-white
                              shadow-sm
                              transition

                              hover:bg-teal-700
                              hover:shadow-md

                              disabled:cursor-not-allowed
                              disabled:opacity-60
                            "
                          >
                            {detailsLoading ? (
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Eye
                                size={16}
                              />
                            )}
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

        {/* PAGINATION */}

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
          style={sectionStyle}
        >
          <p
            className="text-xs font-semibold"
            style={mutedTextStyle}
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
              {filteredPayements.length}
            </strong>
          </p>

          <div className="flex items-center gap-2">
            {/* PREVIOUS */}

            <button
              type="button"
              disabled={
                currentPage === 1
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

                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              style={inputStyle}
            >
              <ChevronLeft
                size={16}
              />
            </button>

            {/* PAGE NUMBERS */}

            {visiblePages.map(
              (pageNumber) => (
                <button
                  key={pageNumber}
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
                  {pageNumber}
                </button>
              )
            )}

            {/* NEXT */}

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

                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              style={inputStyle}
            >
              <ChevronRight
                size={16}
              />
            </button>

            {/* PAGE INFO */}

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
      </section>

      {/* DETAILS */}

      <DetailsPayments
        open={detailsOpen}
        payement={selectedPayement}
        onClose={closeDetails}
      />
    </div>
  );
}

/* =====================================================
   STATUS BADGE
===================================================== */

function PaymentStatusBadge({
  status,
}) {
  const value =
    String(
      status || "-"
    ).toUpperCase();

  if (
    value === "PAID" ||
    value === "PAYE" ||
    value === "PAYÉ" ||
    value === "COMPLETED"
  ) {
    return (
      <span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-black text-green-700">
        {status}
      </span>
    );
  }

  if (
    value === "PENDING" ||
    value === "EN_ATTENTE"
  ) {
    return (
      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-700">
        {status}
      </span>
    );
  }

  if (
    value === "FAILED" ||
    value === "CANCELLED" ||
    value === "CANCELED" ||
    value === "ANNULE" ||
    value === "ANNULÉ"
  ) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1.5 text-xs font-black text-red-700">
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-teal-100 px-3 py-1.5 text-xs font-black text-teal-700">
      {status || "-"}
    </span>
  );
}