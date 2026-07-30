import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  Archive,
  CalendarDays,
  CheckCircle,
  CircleDollarSign,
  Clock3,
  Eye,
  User,
  X,
} from "lucide-react";

const headerGradient =
  "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #134e4a 100%)";

const translations = {
  EN: {
    management: "Student / Payments",
    title: "Payment Details",
    subtitle: "View selected payment information.",

    student: "Student",
    amount: "Amount",
    date: "Date",
    status: "Status",
    archived: "Archived",
    archivedAt: "Archived Date",

    yes: "Yes",
    no: "No",
    close: "Close",
    unavailableStudent: "Student name unavailable",
  },

  FR: {
    management: "Étudiant / Paiements",
    title: "Détails du paiement",
    subtitle:
      "Afficher les informations du paiement sélectionné.",

    student: "Étudiant",
    amount: "Montant",
    date: "Date",
    status: "Statut",
    archived: "Archivé",
    archivedAt: "Date d'archivage",

    yes: "Oui",
    no: "Non",
    close: "Fermer",
    unavailableStudent:
      "Nom étudiant non disponible",
  },

  AR: {
    management: "الطالب / المدفوعات",
    title: "تفاصيل الدفع",
    subtitle: "عرض معلومات الدفع المحدد.",

    student: "الطالب",
    amount: "المبلغ",
    date: "التاريخ",
    status: "الحالة",
    archived: "مؤرشف",
    archivedAt: "تاريخ الأرشفة",

    yes: "نعم",
    no: "لا",
    close: "إغلاق",
    unavailableStudent:
      "اسم الطالب غير متوفر",
  },
};

/* =====================================================
   HELPERS
===================================================== */

const getStudentName = (payement) => {
  return (
    `${payement?.studentPrenom || ""} ${
      payement?.studentNom || ""
    }`.trim() ||
    payement?.studentName ||
    payement?.studentFullName ||
    `${payement?.student?.prenom || ""} ${
      payement?.student?.nom || ""
    }`.trim()
  );
};

const formatAmount = (amount) => {
  const numericAmount =
    Number(amount);

  if (
    Number.isNaN(
      numericAmount
    )
  ) {
    return amount || "-";
  }

  return new Intl.NumberFormat(
    "fr-FR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(
    numericAmount
  );
};

const formatDate = (
  date,
  language
) => {
  if (!date) {
    return "-";
  }

  const parsedDate =
    new Date(
      `${date}T00:00:00`
    );

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  const locale =
    language === "AR"
      ? "ar-MA"
      : language === "FR"
      ? "fr-FR"
      : "en-US";

  return parsedDate.toLocaleDateString(
    locale
  );
};

/* =====================================================
   COMPONENT
===================================================== */

export default function DetailsPayments({
  open,
  payement,
  onClose,
}) {
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
     BODY SCROLL
  ===================================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previous;
    };
  }, [open]);

  if (
    !open ||
    !payement
  ) {
    return null;
  }

  const studentName =
    getStudentName(
      payement
    ) ||
    t.unavailableStudent;

  /* =====================================================
     RENDER
  ===================================================== */

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        h-[100dvh]
        w-screen
        items-center
        justify-center
        bg-slate-950/60
        p-4
        backdrop-blur-sm
      "
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-3xl
          overflow-hidden
          rounded-[2rem]
          border
          shadow-2xl
        "
        style={{
          backgroundColor:
            "var(--card-bg)",

          borderColor:
            "var(--border-color)",

          color:
            "var(--text-color)",
        }}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            relative
            overflow-hidden
            px-7
            py-7
            text-white
          "
          style={{
            background:
              headerGradient,
          }}
        >
          <div
            className="
              absolute
              -right-16
              -top-16
              h-44
              w-44
              rounded-full
              bg-white/10
            "
          />

          <div
            className={`
              relative
              flex
              items-center
              justify-between
              gap-5

              ${
                isArabic
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
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/10
                  ring-1
                  ring-white/20
                "
              >
                <Eye
                  size={28}
                />
              </div>

              <div>
                <p className="text-xs font-bold text-teal-100">
                  {t.management}
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {t.title}
                </h2>

                <p className="mt-1 text-xs font-semibold text-teal-100/80">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              title={t.close}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-white/10
                ring-1
                ring-white/15
                transition
                hover:bg-white/20
              "
            >
              <X
                size={18}
              />
            </button>
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="p-6">
          {/* MAIN INFO */}

          <div
            className="
              mb-4
              flex
              flex-col
              gap-5
              rounded-2xl
              border
              p-5

              md:flex-row
              md:items-center
              md:justify-between
            "
            style={{
              backgroundColor:
                "var(--section-bg)",

              borderColor:
                "var(--border-color)",
            }}
          >
            {/* STUDENT */}

            <div className="flex items-center gap-4">
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
                <User
                  size={21}
                />
              </div>

              <div>
                <p
                  className="text-xs font-black"
                  style={{
                    color:
                      "var(--muted-text)",
                  }}
                >
                  {t.student}
                </p>

                <p
                  className="mt-1 text-base font-black"
                  style={{
                    color:
                      "var(--text-color)",
                  }}
                >
                  {studentName}
                </p>
              </div>
            </div>

            {/* AMOUNT */}

            <div
              className={
                isArabic
                  ? "text-left"
                  : "text-right"
              }
            >
              <p
                className="text-xs font-black"
                style={{
                  color:
                    "var(--muted-text)",
                }}
              >
                {t.amount}
              </p>

              <p className="mt-1 text-2xl font-black text-teal-600">
                {formatAmount(
                  payement.amount
                )}{" "}
                MAD
              </p>
            </div>
          </div>

          {/* =================================================
              DETAILS GRID
          ================================================= */}

          <div className="grid gap-4 md:grid-cols-2">
            <DetailItem
              icon={
                CalendarDays
              }
              label={
                t.date
              }
              value={
                formatDate(
                  payement.date,
                  language
                )
              }
            />

            <DetailItem
              icon={
                CheckCircle
              }
              label={
                t.status
              }
              value={
                payement.status ||
                "-"
              }
            />

            <DetailItem
              icon={
                Archive
              }
              label={
                t.archived
              }
              value={
                payement.archived
                  ? t.yes
                  : t.no
              }
            />

            <DetailItem
              icon={
                Clock3
              }
              label={
                t.archivedAt
              }
              value={
                payement.archivedAt
                  ? formatDate(
                      payement.archivedAt,
                      language
                    )
                  : "-"
              }
            />
          </div>

          {/* =================================================
              AMOUNT SUMMARY
          ================================================= */}

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              rounded-2xl
              border
              px-5
              py-4
            "
            style={{
              backgroundColor:
                "var(--section-bg)",

              borderColor:
                "var(--border-color)",
            }}
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

              <span
                className="text-sm font-black"
                style={{
                  color:
                    "var(--muted-text)",
                }}
              >
                {t.amount}
              </span>
            </div>

            <span className="text-lg font-black text-teal-600">
              {formatAmount(
                payement.amount
              )}{" "}
              MAD
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* =====================================================
   DETAIL ITEM
===================================================== */

function DetailItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        p-5
        transition
        hover:-translate-y-0.5
        hover:shadow-md
      "
      style={{
        backgroundColor:
          "var(--section-bg)",

        borderColor:
          "var(--border-color)",
      }}
    >
      <div
        className="
          mb-4
          flex
          h-11
          w-11
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
        <Icon
          size={19}
        />
      </div>

      <p
        className="text-xs font-black"
        style={{
          color:
            "var(--muted-text)",
        }}
      >
        {label}
      </p>

      <p
        className="mt-2 break-words text-sm font-black"
        style={{
          color:
            "var(--text-color)",
        }}
      >
        {value}
      </p>
    </div>
  );
}