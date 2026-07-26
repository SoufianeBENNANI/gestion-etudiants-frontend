import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  X,
  Eye,
  CalendarDays,
  User,
  CheckCircle,
  CircleDollarSign,
  Archive,
  Clock3,
} from "lucide-react";

const headerGradient =
  "linear-gradient(135deg, #c2410c 0%, #9a3412 45%, #431407 100%)";

const translations = {
  EN: {
    management: "Payment Management",
    title: "Payment Details",
    subtitle: "View payment information.",

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
    management: "Gestion des paiements",
    title: "Détails du paiement",
    subtitle: "Afficher les informations du paiement.",

    student: "Étudiant",
    amount: "Montant",
    date: "Date",
    status: "Statut",
    archived: "Archivé",
    archivedAt: "Date d'archivage",

    yes: "Oui",
    no: "Non",
    close: "Fermer",
    unavailableStudent: "Nom étudiant non disponible",
  },

  AR: {
    management: "إدارة المدفوعات",
    title: "تفاصيل الدفع",
    subtitle: "عرض معلومات الدفع.",

    student: "الطالب",
    amount: "المبلغ",
    date: "التاريخ",
    status: "الحالة",
    archived: "مؤرشف",
    archivedAt: "تاريخ الأرشفة",

    yes: "نعم",
    no: "لا",
    close: "إغلاق",
    unavailableStudent: "اسم الطالب غير متوفر",
  },
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
};

const formatDate = (date, language) => {
  if (!date) return "-";

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

export default function DetailsPayments({
  open,
  payement,
  onClose,
}) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

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

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !payement) {
    return null;
  }

  const studentName =
    `${payement.studentPrenom || ""} ${
      payement.studentNom || ""
    }`.trim() ||
    payement.studentName ||
    payement.studentFullName ||
    `${payement.student?.prenom || ""} ${
      payement.student?.nom || ""
    }`.trim() ||
    t.unavailableStudent;

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
        overflow-y-auto
        bg-slate-950/60
        p-4
        backdrop-blur-sm
      "
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="
          my-auto
          w-full
          max-w-3xl
          overflow-hidden
          rounded-[2rem]
          shadow-2xl
          transition-colors
          duration-300
        "
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div
          className="
            relative
            overflow-hidden
            px-7
            py-7
            text-white
          "
          style={{
            background: headerGradient,
          }}
        >
          <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/5" />

          <div className="absolute -bottom-24 left-1/3 h-44 w-44 rounded-full bg-white/5" />

          <div
            className={`
              relative
              flex
              items-center
              justify-between
              gap-5

              ${isArabic ? "flex-row-reverse" : ""}
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
                  text-orange-200
                  ring-1
                  ring-white/15
                "
              >
                <Eye size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-orange-200">
                  {t.management}
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  {t.title}
                </h2>

                <p className="mt-2 text-xs text-orange-100/80">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              title={t.close}
              className="
                inline-flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-white/10
                text-white
                ring-1
                ring-white/15
                transition
                hover:bg-white/20
              "
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* MAIN PAYMENT */}
        <div className="p-6">
          <div
            className="
              mb-5
              flex
              flex-col
              gap-5
              rounded-[1.5rem]
              border
              p-5
              md:flex-row
              md:items-center
              md:justify-between
            "
            style={{
              backgroundColor: "var(--section-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Student */}
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
                  background: headerGradient,
                }}
              >
                <User size={21} />
              </div>

              <div>
                <p
                  className="text-xs font-black"
                  style={{
                    color: "var(--muted-text)",
                  }}
                >
                  {t.student}
                </p>

                <p
                  className="mt-1 text-base font-black"
                  style={{
                    color: "var(--text-color)",
                  }}
                >
                  {studentName}
                </p>
              </div>
            </div>

            {/* Amount */}
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
                  color: "var(--muted-text)",
                }}
              >
                {t.amount}
              </p>

              <p
                className="mt-1 text-2xl font-black"
                style={{
                  color: "var(--text-color)",
                }}
              >
                {formatAmount(payement.amount)} MAD
              </p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailItem
              icon={CalendarDays}
              label={t.date}
              value={formatDate(payement.date, language)}
            />

            <DetailItem
              icon={CheckCircle}
              label={t.status}
              value={payement.status || "-"}
            />

            <DetailItem
              icon={Archive}
              label={t.archived}
              value={payement.archived ? t.yes : t.no}
            />

            <DetailItem
              icon={Clock3}
              label={t.archivedAt}
              value={
                payement.archivedAt
                  ? formatDate(payement.archivedAt, language)
                  : "-"
              }
            />
          </div>

          {/* Amount summary */}
          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              rounded-2xl
              border
              px-5
              py-4
            "
            style={{
              backgroundColor: "var(--section-bg)",
              borderColor: "var(--border-color)",
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
                  background: headerGradient,
                }}
              >
                <CircleDollarSign size={19} />
              </div>

              <span
                className="text-sm font-black"
                style={{
                  color: "var(--muted-text)",
                }}
              >
                {t.amount}
              </span>
            </div>

            <span
              className="text-lg font-black"
              style={{
                color: "var(--text-color)",
              }}
            >
              {formatAmount(payement.amount)} MAD
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        p-4
        transition
      "
      style={{
        backgroundColor: "var(--section-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          text-white
        "
        style={{
          background: headerGradient,
        }}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p
          className="text-xs font-black"
          style={{
            color: "var(--muted-text)",
          }}
        >
          {label}
        </p>

        <p
          className="
            mt-1
            break-words
            text-sm
            font-black
          "
          style={{
            color: "var(--text-color)",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}