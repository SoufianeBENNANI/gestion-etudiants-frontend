import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Archive,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  GraduationCap,
  Loader2,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getManagerDashboardData,
} from "../services/managerDashboardService";

/* =====================================================
   STYLE
===================================================== */

const headerGradient =
  "linear-gradient(135deg, #c2410c 0%, #9a3412 45%, #431407 100%)";

/* =====================================================
   TRANSLATIONS
===================================================== */

const translations = {
  EN: {
    students: "Total students",
    teachers: "Total teachers",
    payments: "Total payments",
    archived: "Archived payments",

    monthly: "Monthly Payments Overview",
    status: "Payment Status",

    paymentsLabel: "Payments",
    paid: "Paid",
    pending: "Pending",
    cancelled: "Cancelled",

    totalAmount: "Total amount",
    paidAmount: "Paid amount",
    pendingAmount: "Pending amount",

    currentData: "Current data",

    paymentsTable: "Payments List",
    student: "Student",
    amount: "Amount",
    date: "Date",
    paymentStatus: "Status",

    rows: "Rows:",
    showing: "Showing",
    to: "to",
    of: "of",
    page: "Page",

    noPayments: "No payments found.",
    loading: "Loading dashboard...",
    error: "Unable to load dashboard.",
  },

  FR: {
    students: "Total étudiants",
    teachers: "Total enseignants",
    payments: "Total paiements",
    archived: "Paiements archivés",

    monthly: "Aperçu mensuel des paiements",
    status: "Statut des paiements",

    paymentsLabel: "Paiements",
    paid: "Payés",
    pending: "En attente",
    cancelled: "Annulés",

    totalAmount: "Montant total",
    paidAmount: "Montant payé",
    pendingAmount: "Montant en attente",

    currentData: "Données actuelles",

    paymentsTable: "Liste des paiements",
    student: "Étudiant",
    amount: "Montant",
    date: "Date",
    paymentStatus: "Statut",

    rows: "Lignes :",
    showing: "Affichage",
    to: "à",
    of: "sur",
    page: "Page",

    noPayments: "Aucun paiement trouvé.",
    loading: "Chargement du tableau de bord...",
    error: "Impossible de charger le tableau de bord.",
  },

  AR: {
    students: "إجمالي الطلاب",
    teachers: "إجمالي الأساتذة",
    payments: "إجمالي المدفوعات",
    archived: "المدفوعات المؤرشفة",

    monthly: "نظرة شهرية على المدفوعات",
    status: "حالة المدفوعات",

    paymentsLabel: "المدفوعات",
    paid: "مدفوعة",
    pending: "في الانتظار",
    cancelled: "ملغاة",

    totalAmount: "المبلغ الإجمالي",
    paidAmount: "المبلغ المدفوع",
    pendingAmount: "المبلغ المعلق",

    currentData: "البيانات الحالية",

    paymentsTable: "قائمة المدفوعات",
    student: "الطالب",
    amount: "المبلغ",
    date: "التاريخ",
    paymentStatus: "الحالة",

    rows: "الأسطر:",
    showing: "عرض",
    to: "إلى",
    of: "من",
    page: "صفحة",

    noPayments: "لا توجد مدفوعات.",
    loading: "جاري تحميل لوحة التحكم...",
    error: "تعذر تحميل لوحة التحكم.",
  },
};

/* =====================================================
   HELPERS
===================================================== */

const formatAmount = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
};

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const cleanDate =
    String(date).split("T")[0];

  const [year, month, day] =
    cleanDate.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${String(year).slice(-2)}`;
};

const getPaymentStatus = (payement) => {
  return String(
    payement?.status ??
    payement?.statut ??
    payement?.etat ??
    ""
  )
    .trim()
    .toUpperCase();
};

const getPaymentAmount = (payement) => {
  const amount = Number(
    payement?.amount ??
    payement?.montant ??
    payement?.prix ??
    0
  );

  return Number.isFinite(amount)
    ? amount
    : 0;
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

const isPaidPayment = (payement) => {
  return [
    "PAYE",
    "PAYÉ",
    "PAID",
    "COMPLETE",
    "COMPLETED",
  ].includes(
    getPaymentStatus(payement)
  );
};

const isPendingPayment = (payement) => {
  return [
    "EN_ATTENTE",
    "EN ATTENTE",
    "PENDING",
    "IMPAYE",
    "IMPAYÉ",
    "UNPAID",
  ].includes(
    getPaymentStatus(payement)
  );
};

const isCancelledPayment = (payement) => {
  return [
    "ANNULE",
    "ANNULÉ",
    "CANCELLED",
    "CANCELED",
  ].includes(
    getPaymentStatus(payement)
  );
};

/* =====================================================
   DASHBOARD
===================================================== */

export default function ManagerDashboard() {
  const [dashboard, setDashboard] =
    useState({
      students: [],
      teachers: [],
      payements: [],
      archivedPayements: [],
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [language, setLanguage] =
    useState(
      localStorage.getItem(
        "app-language"
      ) || "EN"
    );

  /* =========================
     TABLE PAGINATION
  ========================= */

  const [paymentPage, setPaymentPage] =
    useState(1);

  const [paymentRows, setPaymentRows] =
    useState(5);

  const t =
    translations[language] ||
    translations.EN;

  const isArabic =
    language === "AR";

  /* =========================
     THEME
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

  /* =====================================================
     LOAD DATA
  ===================================================== */

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getManagerDashboardData();

      setDashboard({
        students:
          data?.students || [],

        teachers:
          data?.teachers || [],

        payements:
          data?.payements || [],

        archivedPayements:
          data?.archivedPayements || [],
      });
    } catch (requestError) {
      console.error(
        "Erreur Dashboard :",
        requestError
      );

      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =====================================================
     AUTO REFRESH
  ===================================================== */

  useEffect(() => {
    const handlePaymentsUpdated = () => {
      loadDashboard();
    };

    window.addEventListener(
      "payments-updated",
      handlePaymentsUpdated
    );

    return () => {
      window.removeEventListener(
        "payments-updated",
        handlePaymentsUpdated
      );
    };
  }, []);

  /* =====================================================
     PAYMENT STATISTICS
  ===================================================== */

  const paymentStatistics =
    useMemo(() => {
      const payements =
        dashboard.payements;

      const paid =
        payements.filter(
          isPaidPayment
        );

      const pending =
        payements.filter(
          isPendingPayment
        );

      const cancelled =
        payements.filter(
          isCancelledPayment
        );

      const totalAmount =
        payements.reduce(
          (total, payement) =>
            total +
            getPaymentAmount(
              payement
            ),
          0
        );

      const paidAmount =
        paid.reduce(
          (total, payement) =>
            total +
            getPaymentAmount(
              payement
            ),
          0
        );

      const pendingAmount =
        pending.reduce(
          (total, payement) =>
            total +
            getPaymentAmount(
              payement
            ),
          0
        );

      return {
        totalPayements:
          payements.length,

        paidPayements:
          paid.length,

        pendingPayements:
          pending.length,

        cancelledPayements:
          cancelled.length,

        totalAmount,

        paidAmount,

        pendingAmount,
      };
    }, [dashboard.payements]);

  /* =====================================================
     MONTHLY DATA
  ===================================================== */

  const monthlyPayments =
    useMemo(() => {
      const currentYear =
        new Date().getFullYear();

      const locale =
        language === "FR"
          ? "fr-FR"
          : language === "AR"
            ? "ar-MA"
            : "en-US";

      const months =
        Array.from(
          { length: 12 },
          (_, index) => ({
            month: new Date(
              currentYear,
              index,
              1
            ).toLocaleDateString(
              locale,
              {
                month: "short",
              }
            ),

            payments: 0,
            paid: 0,
            pending: 0,
          })
        );

      dashboard.payements.forEach(
        (payement) => {
          const dateValue =
            payement?.date ??
            payement?.datePayement;

          if (!dateValue) {
            return;
          }

          const date =
            new Date(dateValue);

          if (
            Number.isNaN(
              date.getTime()
            )
          ) {
            return;
          }

          if (
            date.getFullYear() !==
            currentYear
          ) {
            return;
          }

          const month =
            months[
            date.getMonth()
            ];

          month.payments += 1;

          if (
            isPaidPayment(
              payement
            )
          ) {
            month.paid += 1;
          }

          if (
            isPendingPayment(
              payement
            )
          ) {
            month.pending += 1;
          }
        }
      );

      return months;
    }, [
      dashboard.payements,
      language,
    ]);

  /* =====================================================
     GENERAL STATISTICS
  ===================================================== */

  const statistics = [
    {
      title: t.students,

      value:
        dashboard.students.length,

      icon:
        GraduationCap,

      iconBackground:
        "bg-orange-100",

      iconColor:
        "text-orange-600",
    },

    {
      title: t.teachers,

      value:
        dashboard.teachers.length,

      icon:
        Users,

      iconBackground:
        "bg-emerald-100",

      iconColor:
        "text-emerald-600",
    },

    {
      title: t.payments,

      value:
        dashboard.payements.length,

      icon:
        WalletCards,

      iconBackground:
        "bg-blue-100",

      iconColor:
        "text-blue-600",
    },

    {
      title: t.archived,

      value:
        dashboard
          .archivedPayements
          .length,

      icon:
        Archive,

      iconBackground:
        "bg-amber-100",

      iconColor:
        "text-amber-600",
    },
  ];

  /* =====================================================
     PIE DATA
  ===================================================== */

  const paymentStatusData = [
    {
      name:
        t.paid,

      value:
        paymentStatistics
          .paidPayements,

      color:
        "#22c55e",
    },

    {
      name:
        t.pending,

      value:
        paymentStatistics
          .pendingPayements,

      color:
        "#f59e0b",
    },

    {
      name:
        t.cancelled,

      value:
        paymentStatistics
          .cancelledPayements,

      color:
        "#ef4444",
    },
  ];

  /* =====================================================
     TABLE PAGINATION
  ===================================================== */

  const totalPaymentPages = Math.max(
    1,
    Math.ceil(
      dashboard.payements.length /
      paymentRows
    )
  );

  useEffect(() => {
    if (
      paymentPage >
      totalPaymentPages
    ) {
      setPaymentPage(
        totalPaymentPages
      );
    }
  }, [
    paymentPage,
    totalPaymentPages,
  ]);

  const paginatedPayments =
    useMemo(() => {
      const startIndex =
        (paymentPage - 1) *
        paymentRows;

      return dashboard.payements.slice(
        startIndex,
        startIndex +
        paymentRows
      );
    }, [
      dashboard.payements,
      paymentPage,
      paymentRows,
    ]);

  const paymentStart =
    dashboard.payements.length === 0
      ? 0
      : (paymentPage - 1) *
      paymentRows +
      1;

  const paymentEnd =
    Math.min(
      paymentPage *
      paymentRows,

      dashboard.payements.length
    );

  const visiblePaymentPages = Array.from(
    {
      length: totalPaymentPages,
    },
    (_, index) => index + 1
  ).slice(
    Math.max(paymentPage - 3, 0),
    Math.min(paymentPage + 2, totalPaymentPages)
  );

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            font-black
          "
          style={
            mutedTextStyle
          }
        >
          <Loader2
            size={22}
            className="animate-spin"
          />

          {t.loading}
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="
        min-h-screen
        space-y-6
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
      {/* =================================================
          GENERAL STATISTICS
      ================================================= */}

      <section
        className="
          grid
          gap-5

          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {statistics.map(
          (statistic) => (
            <StatisticCard
              key={
                statistic.title
              }
              {...statistic}
              label={
                t.currentData
              }
              cardStyle={
                cardStyle
              }
              textStyle={
                textStyle
              }
              mutedTextStyle={
                mutedTextStyle
              }
            />
          )
        )}
      </section>

      {/* =================================================
          AMOUNTS
      ================================================= */}

      <section
        className="
          grid
          gap-5

          md:grid-cols-3
        "
      >
        <AmountCard
          title={
            t.totalAmount
          }
          amount={
            paymentStatistics
              .totalAmount
          }
        />

        <AmountCard
          title={
            t.paidAmount
          }
          amount={
            paymentStatistics
              .paidAmount
          }
        />

        <AmountCard
          title={
            t.pendingAmount
          }
          amount={
            paymentStatistics
              .pendingAmount
          }
        />
      </section>

      {/* =================================================
          CHARTS
      ================================================= */}

      <section
        className="
          grid
          gap-6

          xl:grid-cols-[2fr_1fr]
        "
      >
        {/* MONTHLY */}

        <div
          className="
            rounded-[1.7rem]
            border
            p-6
            shadow-sm
          "
          style={
            cardStyle
          }
        >
          <h2
            className="
              mb-6
              text-xl
              font-black
            "
            style={
              textStyle
            }
          >
            {t.monthly}
          </h2>

          <div className="h-[350px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={
                  monthlyPayments
                }
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="var(--border-color)"
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="payments"
                  name={
                    t.paymentsLabel
                  }
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="paid"
                  name={
                    t.paid
                  }
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="pending"
                  name={
                    t.pending
                  }
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STATUS */}

        <div
          className="
            rounded-[1.7rem]
            border
            p-6
            shadow-sm
          "
          style={
            cardStyle
          }
        >
          <h2
            className="
              text-xl
              font-black
            "
            style={
              textStyle
            }
          >
            {t.status}
          </h2>

          <div className="h-[285px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={
                    paymentStatusData
                  }
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                >
                  {paymentStatusData.map(
                    (entry) => (
                      <Cell
                        key={
                          entry.name
                        }
                        fill={
                          entry.color
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3">
            {paymentStatusData.map(
              (item) => (
                <div
                  key={
                    item.name
                  }
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    px-4
                    py-3
                  "
                  style={{
                    borderColor:
                      "var(--border-color)",

                    backgroundColor:
                      "var(--section-bg)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        h-3
                        w-3
                        rounded-full
                      "
                      style={{
                        backgroundColor:
                          item.color,
                      }}
                    />

                    <span
                      className="
                        text-sm
                        font-semibold
                      "
                      style={
                        mutedTextStyle
                      }
                    >
                      {item.name}
                    </span>
                  </div>

                  <span
                    className="font-black"
                    style={
                      textStyle
                    }
                  >
                    {item.value}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          PAYMENTS TABLE
      ================================================= */}

      <section
        className="
          overflow-hidden
          rounded-[1.7rem]
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
            gap-4
            border-b
            px-6
            py-5

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
                h-11
                w-11
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
              <WalletCards
                size={20}
              />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-black
                "
                style={
                  textStyle
                }
              >
                {t.paymentsTable}
              </h2>

              <p
                className="
                  mt-0.5
                  text-xs
                  font-semibold
                "
                style={
                  mutedTextStyle
                }
              >
                {t.showing}{" "}
                {paymentStart}{" "}
                {t.to}{" "}
                {paymentEnd}{" "}
                {t.of}{" "}
                {
                  dashboard
                    .payements
                    .length
                }
              </p>
            </div>
          </div>

          {/* ROWS */}

          <div className="flex items-center gap-2">
            <span
              className="
                text-xs
                font-black
              "
              style={
                mutedTextStyle
              }
            >
              {t.rows}
            </span>

            <select
              value={
                paymentRows
              }
              onChange={(
                event
              ) => {
                setPaymentRows(
                  Number(
                    event.target
                      .value
                  )
                );

                setPaymentPage(
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

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table
            className="
              w-full
              min-w-[850px]
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
                <th className="w-[30%] px-5 py-4 font-black">
                  {t.student}
                </th>

                <th className="w-[25%] px-5 py-4 font-black">
                  {t.amount}
                </th>

                <th className="w-[20%] px-5 py-4 font-black">
                  {t.date}
                </th>

                <th className="w-[25%] px-5 py-4 font-black">
                  {t.paymentStatus}
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedPayments.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="
                      px-5
                      py-10
                      text-center
                      text-sm
                      font-bold
                    "
                    style={
                      mutedTextStyle
                    }
                  >
                    {
                      t.noPayments
                    }
                  </td>
                </tr>
              ) : (
                paginatedPayments.map(
                  (
                    payement,
                    index
                  ) => {
                    const studentName =
                      getStudentName(
                        payement
                      );

                    const status =
                      getPaymentStatus(
                        payement
                      );

                    return (
                      <tr
                        key={
                          payement.id ??
                          `${studentName}-${index}`
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
                              {studentName
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p
                                className="
                                  truncate
                                  font-black
                                "
                                style={
                                  textStyle
                                }
                              >
                                {
                                  studentName
                                }
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  text-xs
                                  font-semibold
                                "
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
                          <span className="font-black text-orange-600">
                            {formatAmount(
                              getPaymentAmount(
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
                              text-sm
                              font-semibold
                            "
                            style={
                              mutedTextStyle
                            }
                          >
                            {formatDate(
                              payement.date ??
                              payement.datePayement
                            )}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              status
                            }
                          />
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>

      {/* =================================================
    PAGINATION
================================================= */}

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
  {/* SHOWING */}

  <p
    className="text-xs font-semibold"
    style={mutedTextStyle}
  >
    {t.showing}{" "}

    <span
      className="font-black"
      style={textStyle}
    >
      {paymentStart}
    </span>{" "}

    {t.to}{" "}

    <span
      className="font-black"
      style={textStyle}
    >
      {paymentEnd}
    </span>{" "}

    {t.of}{" "}

    <span
      className="font-black"
      style={textStyle}
    >
      {dashboard.payements.length}
    </span>{" "}

    {t.paymentsLabel}
  </p>

  {/* PAGINATION BUTTONS */}

  <div className="flex flex-wrap items-center gap-2">
    {/* PREVIOUS */}

    <button
      type="button"
      onClick={() =>
        setPaymentPage((page) =>
          Math.max(page - 1, 1)
        )
      }
      disabled={paymentPage === 1}
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

        hover:opacity-80
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
      style={inputStyle}
    >
      {isArabic ? (
        <ChevronRight size={16} />
      ) : (
        <ChevronLeft size={16} />
      )}
    </button>

    {/* PAGE NUMBERS */}

    {visiblePaymentPages.map(
      (pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() =>
            setPaymentPage(pageNumber)
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
            shadow-sm
            transition

            hover:opacity-90
          "
          style={{
            background:
              paymentPage === pageNumber
                ? headerGradient
                : "var(--input-bg)",

            borderColor:
              paymentPage === pageNumber
                ? "#c2410c"
                : "var(--border-color)",

            color:
              paymentPage === pageNumber
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
      onClick={() =>
        setPaymentPage((page) =>
          Math.min(
            page + 1,
            totalPaymentPages
          )
        )
      }
      disabled={
        paymentPage ===
        totalPaymentPages
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

        hover:opacity-80
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
      style={inputStyle}
    >
      {isArabic ? (
        <ChevronLeft size={16} />
      ) : (
        <ChevronRight size={16} />
      )}
    </button>

    {/* PAGE INFO */}

    <span
      className="
        inline-flex
        h-9
        min-w-[105px]
        items-center
        justify-center
        rounded-xl
        border
        px-4
        text-xs
        font-black
      "
      style={inputStyle}
    >
      {t.page}{" "}
      {paymentPage} /{" "}
      {totalPaymentPages}
    </span>
  </div>
</div>
      </section>

      {/* ERROR */}

      {error && (
        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            font-black
            text-red-600
          "
        >
          {error}
        </div>
      )}
    </div>
  );
}

/* =====================================================
   STATISTIC CARD
===================================================== */

function StatisticCard({
  title,
  value,
  icon: Icon,
  iconBackground,
  iconColor,
  label,
  cardStyle,
  textStyle,
  mutedTextStyle,
}) {
  return (
    <div
      className="
        rounded-[1.5rem]
        border
        p-5
        shadow-sm
        transition

        hover:-translate-y-1
        hover:shadow-md
      "
      style={
        cardStyle
      }
    >
      <div className="flex items-center gap-4">
        <div
          className={`
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-full

            ${iconBackground}
          `}
        >
          <Icon
            size={22}
            className={
              iconColor
            }
          />
        </div>

        <div>
          <h3
            className="
              text-2xl
              font-black
            "
            style={
              textStyle
            }
          >
            {value}
          </h3>

          <p
            className="
              text-xs
              font-semibold
            "
            style={
              mutedTextStyle
            }
          >
            {title}
          </p>
        </div>
      </div>

      <div
        className="
          mt-5
          flex
          items-center
          gap-2
        "
      >
        <span
          className="
            text-xs
            font-semibold
          "
          style={
            mutedTextStyle
          }
        >
          {label}
        </span>

        <TrendingUp
          size={15}
          className="text-emerald-500"
        />
      </div>
    </div>
  );
}

/* =====================================================
   AMOUNT CARD
===================================================== */

function AmountCard({
  title,
  amount,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-[1.5rem]
        border
        p-5
        shadow-sm
      "
      style={{
        backgroundColor:
          "var(--card-bg)",

        borderColor:
          "var(--border-color)",
      }}
    >
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
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

      <div className="min-w-0">
        <p
          className="
            text-xs
            font-semibold
          "
          style={{
            color:
              "var(--muted-text)",
          }}
        >
          {title}
        </p>

        <h3
          className="
            mt-1
            truncate
            text-xl
            font-black
          "
          style={{
            color:
              "var(--text-color)",
          }}
        >
          {formatAmount(
            amount
          )}{" "}
          MAD
        </h3>
      </div>
    </div>
  );
}

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({
  status,
}) {
  const normalized =
    String(status || "")
      .trim()
      .toUpperCase();

  if (
    [
      "PAYE",
      "PAYÉ",
      "PAID",
      "COMPLETE",
      "COMPLETED",
    ].includes(normalized)
  ) {
    return (
      <span
        className="
          inline-flex
          rounded-full
          bg-emerald-100
          px-3
          py-1.5
          text-xs
          font-black
          text-emerald-700
        "
      >
        {status}
      </span>
    );
  }

  if (
    [
      "EN_ATTENTE",
      "EN ATTENTE",
      "PENDING",
      "IMPAYE",
      "IMPAYÉ",
      "UNPAID",
    ].includes(normalized)
  ) {
    return (
      <span
        className="
          inline-flex
          rounded-full
          bg-amber-100
          px-3
          py-1.5
          text-xs
          font-black
          text-amber-700
        "
      >
        {status}
      </span>
    );
  }

  if (
    [
      "ANNULE",
      "ANNULÉ",
      "CANCELLED",
      "CANCELED",
    ].includes(normalized)
  ) {
    return (
      <span
        className="
          inline-flex
          rounded-full
          bg-red-100
          px-3
          py-1.5
          text-xs
          font-black
          text-red-700
        "
      >
        {status}
      </span>
    );
  }

  return (
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
          "var(--text-color)",
      }}
    >
      {status || "-"}
    </span>
  );
}