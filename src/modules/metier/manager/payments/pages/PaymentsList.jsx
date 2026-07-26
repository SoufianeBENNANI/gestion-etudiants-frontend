import { useEffect, useMemo, useState } from "react";

import {
  Trash2,
  Pencil,
  CircleDollarSign,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Loader2,
  Plus,
  TrendingUp,
  Search,
  Eye,
  CheckCircle,
  WalletCards,
} from "lucide-react";

import {
  downloadPayementsPdf,
  getAllPayements,
} from "../services/payementService";

import AddPayments from "../components/AddPayments";
import EditPayments from "../components/EditPayments";
import DeletePayments from "../components/DeletePayments";
import DetailsPayments from "../components/DetailsPayments";

/* =========================
   COLOR - inchangée
========================= */

const headerGradient =
  "linear-gradient(135deg, #c2410c 0%, #9a3412 45%, #431407 100%)";

/* =========================
   TRANSLATIONS
========================= */

const translations = {
  EN: {
    management: "Payment Management",
    title: "Payments List",
    subtitle:
      "Manage, create, update and view student payments.",

    search: "Search payment...",
    add: "Add",
    pdf: "PDF",

    total: "Total Payments",
    totalAmount: "Total Amount",
    paid: "Paid Payments",
    lastDays: "Last 30 days",

    list: "Payments List",
    showing: "Showing",
    to: "to",
    of: "of",
    payments: "payments",
    rows: "Rows:",

    student: "Student",
    amount: "Amount",
    date: "Date",
    status: "Status",
    actions: "Actions",

    loading: "Loading payments...",
    empty: "No payments found.",
    page: "Page",

    pdfError: "Unable to download PDF.",
    loadError: "Unable to load payments.",
  },

  FR: {
    management: "Gestion des paiements",
    title: "Liste des paiements",
    subtitle:
      "Gérer, créer, modifier et consulter les paiements des étudiants.",

    search: "Rechercher un paiement...",
    add: "Ajouter",
    pdf: "PDF",

    total: "Total des paiements",
    totalAmount: "Montant total",
    paid: "Paiements effectués",
    lastDays: "Derniers 30 jours",

    list: "Liste des paiements",
    showing: "Affichage de",
    to: "à",
    of: "sur",
    payments: "paiements",
    rows: "Lignes :",

    student: "Étudiant",
    amount: "Montant",
    date: "Date",
    status: "Statut",
    actions: "Actions",

    loading: "Chargement des paiements...",
    empty: "Aucun paiement trouvé.",
    page: "Page",

    pdfError: "Impossible de télécharger le PDF.",
    loadError: "Impossible de charger les paiements.",
  },

  AR: {
    management: "إدارة المدفوعات",
    title: "قائمة المدفوعات",
    subtitle:
      "إدارة وإنشاء وتعديل وعرض مدفوعات الطلاب.",

    search: "البحث عن دفعة...",
    add: "إضافة",
    pdf: "PDF",

    total: "مجموع المدفوعات",
    totalAmount: "المبلغ الإجمالي",
    paid: "المدفوعات المؤداة",
    lastDays: "آخر 30 يومًا",

    list: "قائمة المدفوعات",
    showing: "عرض",
    to: "إلى",
    of: "من",
    payments: "مدفوعات",
    rows: "الأسطر:",

    student: "الطالب",
    amount: "المبلغ",
    date: "التاريخ",
    status: "الحالة",
    actions: "الإجراءات",

    loading: "جاري تحميل المدفوعات...",
    empty: "لا توجد مدفوعات.",
    page: "صفحة",

    pdfError: "تعذر تحميل PDF.",
    loadError: "تعذر تحميل المدفوعات.",
  },
};

/* =========================
   HELPERS
========================= */

const normalizePayements = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data?.content)) return data.data.content;

  return [];
};

const getStudentName = (payement) => {
  return (
    `${payement?.studentNom || ""} ${payement?.studentPrenom || ""
      }`.trim() ||
    payement?.studentName ||
    payement?.studentFullName ||
    `${payement?.student?.nom || ""} ${payement?.student?.prenom || ""
      }`.trim() ||
    "-"
  );
};

const getAmount = (payement) => {
  const amount = Number(
    payement?.amount ??
    payement?.montant ??
    0
  );

  return Number.isFinite(amount)
    ? amount
    : 0;
};

const getStatus = (payement) => {
  return String(
    payement?.status ??
    payement?.statut ??
    "-"
  )
    .trim()
    .toUpperCase();
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/* jj/mm/aa */
const formatDate = (date) => {
  if (!date) return "-";

  const value =
    String(date).split("T")[0];

  const [year, month, day] =
    value.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${String(
    year
  ).slice(-2)}`;
};

const isPaid = (payement) => {
  return [
    "PAYE",
    "PAYÉ",
    "PAID",
    "COMPLETE",
    "COMPLETED",
  ].includes(getStatus(payement));
};

/* =========================
   PAGE
========================= */

export default function PaymentsList() {
  const [language, setLanguage] =
    useState(
      localStorage.getItem(
        "app-language"
      ) || "EN"
    );

  const t =
    translations[language] ||
    translations.EN;

  const isArabic =
    language === "AR";

  const [payements, setPayements] =
    useState([]);

  const [
    selectedPayement,
    setSelectedPayement,
  ] = useState(null);

  const [addOpen, setAddOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [searchValue, setSearchValue] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [pdfLoading, setPdfLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  /* =========================
     LANGUAGE
  ========================= */

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

  /* =========================
     STYLES
  ========================= */

  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--border-color)",
    color: "var(--text-color)",
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

  const mutedTextStyle = {
    color:
      "var(--muted-text)",
  };

  const textStyle = {
    color:
      "var(--text-color)",
  };

  /* =========================
     LOAD
  ========================= */

  const loadPayements = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAllPayements();

      setPayements(
        normalizePayements(data)
      );
    } catch (error) {
      console.error(
        "Erreur chargement paiements :",
        error
      );

      setPayements([]);

      setError(
        error?.response?.data?.message ||
        t.loadError
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayements();
  }, []);

  /* Actualisation automatique */
  useEffect(() => {
    const handleUpdate = () => {
      loadPayements();
    };

    window.addEventListener(
      "payments-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "payments-updated",
        handleUpdate
      );
    };
  }, []);

  /* =========================
     SEARCH
  ========================= */

  const filteredPayements =
    useMemo(() => {
      const value =
        searchValue
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
              getAmount(payement)
            ).toLowerCase();

          const status =
            getStatus(
              payement
            ).toLowerCase();

          const date =
            String(
              payement.date || ""
            ).toLowerCase();

          return (
            studentName.includes(
              value
            ) ||
            amount.includes(value) ||
            status.includes(value) ||
            date.includes(value)
          );
        }
      );
    }, [payements, searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  /* =========================
     STATISTICS
  ========================= */

  const totalAmount = useMemo(
    () =>
      payements.reduce(
        (total, payement) =>
          total +
          getAmount(payement),
        0
      ),
    [payements]
  );

  const paidPayments = useMemo(
    () =>
      payements.filter(isPaid)
        .length,
    [payements]
  );

  const stats = [
    {
      title: t.total,
      value: payements.length,
      icon: WalletCards,

      iconBg: "bg-orange-500",
      percentBg: "bg-orange-50",
      percentText:
        "text-orange-600",

      percent: "76%",
      trend: "17%",
    },

    {
      title: t.totalAmount,
      value: `${formatAmount(
        totalAmount
      )} MAD`,

      icon: CircleDollarSign,

      iconBg: "bg-amber-500",
      percentBg: "bg-amber-50",
      percentText:
        "text-amber-600",

      percent: "73%",
      trend: "22%",
    },

    {
      title: t.paid,
      value: paidPayments,

      icon: CheckCircle,

      iconBg: "bg-green-500",
      percentBg: "bg-green-50",
      percentText:
        "text-green-600",

      percent: "12%",
      trend: "0.9%",
    },
  ];

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredPayements.length /
      itemsPerPage
    )
  );

  const paginatedPayements =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        itemsPerPage;

      return filteredPayements.slice(
        startIndex,
        startIndex +
        itemsPerPage
      );
    }, [
      filteredPayements,
      currentPage,
      itemsPerPage,
    ]);

  const startPayement =
    filteredPayements.length === 0
      ? 0
      : (currentPage - 1) *
      itemsPerPage +
      1;

  const endPayement = Math.min(
    currentPage * itemsPerPage,
    filteredPayements.length
  );

  const visiblePages =
    Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1
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

  /* =========================
     PDF
  ========================= */

  const handleDownloadPdf =
    async () => {
      try {
        setPdfLoading(true);
        setError("");

        const pdfData =
          await downloadPayementsPdf();

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
          "liste_paiements.pdf";

        document.body.appendChild(
          link
        );

        link.click();
        link.remove();

        window.URL.revokeObjectURL(
          url
        );
      } catch (error) {
        console.error(
          "Erreur téléchargement PDF :",
          error
        );

        setError(t.pdfError);
      } finally {
        setPdfLoading(false);
      }
    };

  /* =========================
     MODALS
  ========================= */

  const openDetails = (
    payement
  ) => {
    setSelectedPayement(
      payement
    );

    setDetailsOpen(true);
  };

  const openEdit = (
    payement
  ) => {
    setSelectedPayement(
      payement
    );

    setEditOpen(true);
  };

  const openDelete = (
    payement
  ) => {
    setSelectedPayement(
      payement
    );

    setDeleteOpen(true);
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
          borderColor:
            "var(--border-color)",

          background:
            headerGradient,
        }}
      >
        <div>
          <p className="text-xs font-semibold text-orange-200">
            {t.management}
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
              value={searchValue}
              onChange={(event) => {
                setSearchValue(
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
                placeholder:text-orange-100/70
                sm:w-64

                ${isArabic
                  ? "text-right"
                  : "text-left"
                }
              `}
            />

            <Search
              size={17}
              className="text-orange-100"
            />
          </div>

          {/* ADD */}

          <button
            type="button"
            onClick={() =>
              setAddOpen(true)
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-full
              bg-white/10
              px-5
              text-sm
              font-black
              text-white
              ring-1
              ring-white/15
              shadow-sm
              transition
              hover:bg-white/15
            "
          >
            <Plus size={17} />

            {t.add}
          </button>

          {/* PDF */}

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
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
    shadow-sm
    transition
    hover:bg-orange-600
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
          >
            {pdfLoading ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <FileDown size={17} />
            )}

            {pdfLoading
              ? t.downloading
              : t.pdf}
          </button>
        </div>
      </div>

      {/* =====================
          STATS
      ===================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                rounded-[1.4rem]
                border
                p-5
                shadow-sm
                transition

                hover:-translate-y-1
                hover:shadow-md
              "
              style={cardStyle}
            >
              <div
                className={`
                  flex
                  items-start
                  justify-between

                  ${isArabic
                    ? "flex-row-reverse"
                    : ""
                  }
                `}
              >
                <div
                  className={`
                    flex
                    items-center
                    gap-4

                    ${isArabic
                      ? "flex-row-reverse text-right"
                      : "text-left"
                    }
                  `}
                >
                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      text-white

                      ${item.iconBg}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3
                      className={
                        item.title ===
                          t.totalAmount
                          ? "text-xl font-black"
                          : "text-2xl font-black"
                      }
                      style={textStyle}
                    >
                      {item.value}
                    </h3>

                    <p
                      className="text-xs font-semibold"
                      style={
                        mutedTextStyle
                      }
                    >
                      {item.title}
                    </p>
                  </div>
                </div>

                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full

                    ${item.percentBg}
                  `}
                >
                  <span
                    className={`
                      text-[11px]
                      font-black

                      ${item.percentText}
                    `}
                  >
                    {item.percent}
                  </span>
                </div>
              </div>

              <div
                className={`
                  mt-5
                  flex
                  items-center
                  gap-3
                  text-xs
                  font-semibold

                  ${isArabic
                    ? "flex-row-reverse"
                    : ""
                  }
                `}
              >
                <span
                  style={
                    mutedTextStyle
                  }
                >
                  {t.lastDays}
                </span>

                <span className="font-black text-emerald-500">
                  {item.trend}
                </span>

                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================
          ERROR
      ===================== */}

      {error && (
        <div
          className="
            rounded-[1.4rem]
            border
            p-4
            text-sm
            font-bold
          "
          style={{
            backgroundColor:
              "var(--section-bg)",

            borderColor:
              "var(--border-color)",

            color:
              "var(--text-color)",
          }}
        >
          {error}
        </div>
      )}

      {/* =====================
          LIST
      ===================== */}

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
        {/* LIST HEADER */}

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
          style={sectionStyle}
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
                text-white
              "
              style={{
                background:
                  headerGradient,
              }}
            >
              <CircleDollarSign
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
                className="mt-0.5 text-xs font-semibold"
                style={
                  mutedTextStyle
                }
              >
                {t.showing}{" "}
                {startPayement}{" "}
                {t.to}{" "}
                {endPayement}{" "}
                {t.of}{" "}
                {
                  filteredPayements.length
                }{" "}
                {t.payments}
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
              value={itemsPerPage}
              onChange={(event) => {
                setItemsPerPage(
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

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] table-fixed border-collapse">
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
                <th className="w-[25%] px-5 py-4 font-black">
                  {t.student}
                </th>

                <th className="w-[20%] px-5 py-4 font-black">
                  {t.amount}
                </th>

                <th className="w-[18%] px-5 py-4 font-black">
                  {t.date}
                </th>

                <th className="w-[18%] px-5 py-4 font-black">
                  {t.status}
                </th>

                <th className="w-[19%] px-5 py-4 font-black">
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
                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-sm
                        font-bold
                      "
                      style={
                        mutedTextStyle
                      }
                    >
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      {t.loading}
                    </div>
                  </td>
                </tr>
              ) : paginatedPayements.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center"
                  >
                    <span
                      className="text-sm font-bold"
                      style={
                        mutedTextStyle
                      }
                    >
                      {t.empty}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedPayements.map(
                  (payement) => {
                    const studentName =
                      getStudentName(
                        payement
                      );

                    const status =
                      getStatus(
                        payement
                      );

                    return (
                      <tr
                        key={
                          payement.id
                        }
                        className="
                          border-b
                          text-center
                          text-sm
                          transition
                          last:border-none
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
                                text-orange-600
                              "
                            >
                              {String(
                                studentName ||
                                "-"
                              )
                                .charAt(0)
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
                                  studentName
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

                        {/* AMOUNT */}

                        <td className="px-5 py-4">
                          <span
                            className="font-black"
                            style={{
                              color:
                                "#c2410c",
                            }}
                          >
                            {formatAmount(
                              getAmount(
                                payement
                              )
                            )}{" "}
                            MAD
                          </span>
                        </td>

                        {/* DATE */}

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
                            {formatDate(
                              payement.date
                            )}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <span
                            className="
                              inline-flex
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
                            {status}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openDetails(
                                  payement
                                )
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

                            <button
                              type="button"
                              onClick={() =>
                                openEdit(
                                  payement
                                )
                              }
                              className="
                                inline-flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                border
                                transition
                                hover:opacity-80
                              "
                              style={
                                inputStyle
                              }
                            >
                              <Pencil
                                size={15}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openDelete(
                                  payement
                                )
                              }
                              className="
                                inline-flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                bg-red-600
                                text-white
                                transition
                                hover:bg-red-700
                              "
                            >
                              <Trash2
                                size={15}
                              />
                            </button>
                          </div>
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
          style={sectionStyle}
        >
          <p
            className="text-xs font-semibold"
            style={
              mutedTextStyle
            }
          >
            {t.showing}{" "}
            <span
              className="font-black"
              style={textStyle}
            >
              {startPayement}
            </span>{" "}
            {t.to}{" "}
            <span
              className="font-black"
              style={textStyle}
            >
              {endPayement}
            </span>{" "}
            {t.of}{" "}
            <span
              className="font-black"
              style={textStyle}
            >
              {
                filteredPayements.length
              }
            </span>{" "}
            {t.payments}
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
                      currentPage ===
                        page
                        ? headerGradient
                        : "var(--input-bg)",

                    borderColor:
                      "var(--border-color)",

                    color:
                      currentPage ===
                        page
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

      {/* =====================
          MODALS
      ===================== */}

      <AddPayments
        open={addOpen}
        onClose={() =>
          setAddOpen(false)
        }
        onSuccess={
          loadPayements
        }
      />

      <EditPayments
        open={editOpen}
        payement={
          selectedPayement
        }
        onClose={() => {
          setEditOpen(false);
          setSelectedPayement(
            null
          );
        }}
        onSuccess={
          loadPayements
        }
      />

      <DeletePayments
        open={deleteOpen}
        payement={
          selectedPayement
        }
        onClose={() => {
          setDeleteOpen(false);
          setSelectedPayement(
            null
          );
        }}
        onSuccess={
          loadPayements
        }
      />

      <DetailsPayments
        open={detailsOpen}
        payement={
          selectedPayement
        }
        onClose={() => {
          setDetailsOpen(false);
          setSelectedPayement(
            null
          );
        }}
      />
    </div>
  );
}