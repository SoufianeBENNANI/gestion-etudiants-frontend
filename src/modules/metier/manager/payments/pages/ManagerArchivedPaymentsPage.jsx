import { useEffect, useMemo, useState } from "react";

import {
  ArchiveRestore,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Loader2,
  Search,
  User,
  CalendarDays,
  WalletCards,
} from "lucide-react";

import {
  getArchivedPayements,
  restorePayement,
} from "../services/payementService";

const headerGradient =
  "linear-gradient(135deg, #c2410c 0%, #9a3412 45%, #431407 100%)";

const translations = {
  EN: {
    management: "Payment Management",
    title: "Archived Payments",
    subtitle: "View and restore archived student payments.",

    search: "Search archived payment...",
    total: "Archived Payments",
    amount: "Archived Amount",

    list: "Archived Payments List",
    showing: "Showing",
    to: "to",
    of: "of",
    payments: "payments",
    rows: "Rows:",

    student: "Student",
    amountLabel: "Amount",
    date: "Date",
    status: "Status",
    archivedAt: "Archived Date",
    actions: "Actions",

    restore: "Restore",
    restoring: "Restoring...",
    loading: "Loading archived payments...",
    empty: "No archived payments found.",
    page: "Page",

    loadError: "Unable to load archived payments.",
    restoreError: "Unable to restore payment.",
  },

  FR: {
    management: "Gestion des paiements",
    title: "Paiements archivés",
    subtitle: "Consulter et restaurer les paiements archivés des étudiants.",

    search: "Rechercher un paiement archivé...",
    total: "Paiements archivés",
    amount: "Montant archivé",

    list: "Liste des paiements archivés",
    showing: "Affichage de",
    to: "à",
    of: "sur",
    payments: "paiements",
    rows: "Lignes :",

    student: "Étudiant",
    amountLabel: "Montant",
    date: "Date",
    status: "Statut",
    archivedAt: "Date d'archivage",
    actions: "Actions",

    restore: "Restaurer",
    restoring: "Restauration...",
    loading: "Chargement des paiements archivés...",
    empty: "Aucun paiement archivé trouvé.",
    page: "Page",

    loadError: "Impossible de charger les paiements archivés.",
    restoreError: "Impossible de restaurer le paiement.",
  },

  AR: {
    management: "إدارة المدفوعات",
    title: "المدفوعات المؤرشفة",
    subtitle: "عرض واسترجاع مدفوعات الطلاب المؤرشفة.",

    search: "البحث عن دفعة مؤرشفة...",
    total: "المدفوعات المؤرشفة",
    amount: "المبلغ المؤرشف",

    list: "قائمة المدفوعات المؤرشفة",
    showing: "عرض",
    to: "إلى",
    of: "من",
    payments: "مدفوعات",
    rows: "الأسطر:",

    student: "الطالب",
    amountLabel: "المبلغ",
    date: "التاريخ",
    status: "الحالة",
    archivedAt: "تاريخ الأرشفة",
    actions: "الإجراءات",

    restore: "استرجاع",
    restoring: "جاري الاسترجاع...",
    loading: "جاري تحميل المدفوعات المؤرشفة...",
    empty: "لا توجد مدفوعات مؤرشفة.",
    page: "صفحة",

    loadError: "تعذر تحميل المدفوعات المؤرشفة.",
    restoreError: "تعذر استرجاع الدفع.",
  },
};

const normalizePayements = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data?.content)) return data.data.content;

  return [];
};

const getStudentName = (payement) =>
  `${payement?.studentNom || ""} ${payement?.studentPrenom || ""}`.trim() ||
  payement?.studentName ||
  payement?.studentFullName ||
  `${payement?.student?.nom || ""} ${
    payement?.student?.prenom || ""
  }`.trim() ||
  "-";

const getAmount = (payement) => {
  const amount = Number(
    payement?.amount ??
      payement?.montant ??
      0
  );

  return Number.isFinite(amount) ? amount : 0;
};

const formatAmount = (amount) =>
  new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const formatDate = (date) => {
  if (!date) return "-";

  const cleanDate = String(date).split("T")[0];
  const [year, month, day] = cleanDate.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${String(year).slice(-2)}`;
};

export default function ManagerArchivedPaymentsPage() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

  const [payements, setPayements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);
  const [error, setError] = useState("");

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const mutedTextStyle = {
    color: "var(--muted-text)",
  };

  const textStyle = {
    color: "var(--text-color)",
  };

  const loadArchivedPayements = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getArchivedPayements();

      setPayements(normalizePayements(data));
    } catch (error) {
      console.error(
        "Erreur chargement paiements archivés :",
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
    loadArchivedPayements();
  }, []);

  const handleRestore = async (id) => {
    try {
      setRestoringId(id);
      setError("");

      await restorePayement(id);

      await loadArchivedPayements();

      window.dispatchEvent(
        new CustomEvent("payments-updated")
      );
    } catch (error) {
      console.error(
        "Erreur restauration paiement :",
        error
      );

      setError(
        error?.response?.data?.message ||
          t.restoreError
      );
    } finally {
      setRestoringId(null);
    }
  };

  const filteredPayements = useMemo(() => {
    const value = searchValue.trim().toLowerCase();

    if (!value) return payements;

    return payements.filter((payement) => {
      const studentName =
        getStudentName(payement).toLowerCase();

      return (
        studentName.includes(value) ||
        String(getAmount(payement)).includes(value) ||
        String(payement.status || "")
          .toLowerCase()
          .includes(value) ||
        String(payement.date || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [payements, searchValue]);

  const totalAmount = useMemo(
    () =>
      payements.reduce(
        (total, payement) =>
          total + getAmount(payement),
        0
      ),
    [payements]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredPayements.length /
        itemsPerPage
    )
  );

  const paginatedPayements = useMemo(() => {
    const startIndex =
      (currentPage - 1) * itemsPerPage;

    return filteredPayements.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [
    filteredPayements,
    currentPage,
    itemsPerPage,
  ]);

  const startPayement =
    filteredPayements.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endPayement = Math.min(
    currentPage * itemsPerPage,
    filteredPayements.length
  );

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(
    Math.max(currentPage - 3, 0),
    Math.min(currentPage + 2, totalPages)
  );

  return (
    <div
      className="min-h-screen space-y-5 px-2 py-1 transition-colors duration-300"
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
    >
      {/* HEADER */}
      <div
        className={`
          flex flex-col gap-4
          rounded-[1.7rem]
          border
          px-6 py-5
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
          borderColor: "var(--border-color)",
          background: headerGradient,
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

        <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
          <input
            type="text"
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
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
              sm:w-72

              ${isArabic ? "text-right" : "text-left"}
            `}
          />

          <Search
            size={17}
            className="text-orange-100"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <StatCard
          icon={WalletCards}
          value={payements.length}
          label={t.total}
          iconClass="bg-orange-500"
          cardStyle={cardStyle}
          textStyle={textStyle}
          mutedTextStyle={mutedTextStyle}
        />

        <StatCard
          icon={CircleDollarSign}
          value={`${formatAmount(totalAmount)} MAD`}
          label={t.amount}
          iconClass="bg-amber-500"
          cardStyle={cardStyle}
          textStyle={textStyle}
          mutedTextStyle={mutedTextStyle}
        />
      </div>

      {error && (
        <div
          className="rounded-[1.4rem] border p-4 text-sm font-bold"
          style={sectionStyle}
        >
          {error}
        </div>
      )}

      {/* LIST */}
      <div
        className="overflow-hidden rounded-[1.4rem] border shadow-sm"
        style={cardStyle}
      >
        <div
          className={`
            flex flex-col gap-3
            border-b
            px-5 py-4

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
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{
                background: headerGradient,
              }}
            >
              <ArchiveRestore size={20} />
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
                style={mutedTextStyle}
              >
                {t.showing} {startPayement} {t.to}{" "}
                {endPayement} {t.of}{" "}
                {filteredPayements.length} {t.payments}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black"
              style={mutedTextStyle}
            >
              {t.rows}
            </span>

            <select
              value={itemsPerPage}
              onChange={(event) => {
                setItemsPerPage(
                  Number(event.target.value)
                );
                setCurrentPage(1);
              }}
              className="rounded-xl border px-3 py-2 text-xs font-bold outline-none"
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
          <table className="w-full min-w-[1100px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[24%] px-5 py-4 font-black">
                  {t.student}
                </th>

                <th className="w-[18%] px-5 py-4 font-black">
                  {t.amountLabel}
                </th>

                <th className="w-[16%] px-5 py-4 font-black">
                  {t.date}
                </th>

                <th className="w-[16%] px-5 py-4 font-black">
                  {t.status}
                </th>

                <th className="w-[16%] px-5 py-4 font-black">
                  {t.archivedAt}
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
                    className="px-5 py-10 text-center"
                  >
                    <div
                      className="flex items-center justify-center gap-2 text-sm font-bold"
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
              ) : paginatedPayements.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-10 text-center"
                  >
                    <span
                      className="text-sm font-bold"
                      style={mutedTextStyle}
                    >
                      {t.empty}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedPayements.map((payement) => {
                  const studentName =
                    getStudentName(payement);

                  return (
                    <tr
                      key={payement.id}
                      className="border-b text-center text-sm last:border-none"
                      style={{
                        borderColor:
                          "var(--border-color)",
                        color:
                          "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                            {String(studentName)
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p
                              className="truncate font-black"
                              style={textStyle}
                            >
                              {studentName}
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
                        <span className="font-black text-orange-600">
                          {formatAmount(
                            getAmount(payement)
                          )}{" "}
                          MAD
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {formatDate(payement.date)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex rounded-full px-3 py-1.5 text-xs font-black"
                          style={{
                            backgroundColor:
                              "var(--section-bg)",
                            color:
                              "var(--primary-color)",
                          }}
                        >
                          {payement.status || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {formatDate(
                            payement.archivedAt
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleRestore(payement.id)
                          }
                          disabled={
                            restoringId === payement.id
                          }
                          title={t.restore}
                          className="
                            inline-flex
                            h-10 w-10
                            items-center
                            justify-center
                            rounded-xl
                            text-white
                            shadow-sm
                            transition
                            hover:opacity-90
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          "
                          style={{
                            background:
                              headerGradient,
                          }}
                        >
                          {restoringId === payement.id ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <ArchiveRestore
                              size={16}
                            />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div
          className={`
            flex flex-col gap-3
            border-t
            px-5 py-4

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
              {filteredPayements.length}
            </span>{" "}
            {t.payments}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((previous) =>
                  Math.max(previous - 1, 1)
                )
              }
              disabled={currentPage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(page)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-black"
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
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((previous) =>
                  Math.min(
                    previous + 1,
                    totalPages
                  )
                )
              }
              disabled={
                currentPage === totalPages
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border disabled:opacity-50"
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

function StatCard({
  icon: Icon,
  value,
  label,
  iconClass,
  cardStyle,
  textStyle,
  mutedTextStyle,
}) {
  return (
    <div
      className="rounded-[1.4rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      style={cardStyle}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${iconClass}`}
        >
          <Icon size={20} />
        </div>

        <div>
          <h3
            className="text-2xl font-black"
            style={textStyle}
          >
            {value}
          </h3>

          <p
            className="text-xs font-semibold"
            style={mutedTextStyle}
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}