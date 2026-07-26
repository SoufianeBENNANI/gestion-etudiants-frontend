import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  X,
  Trash2,
  AlertTriangle,
  Loader2,
  User,
  CircleDollarSign,
  CalendarDays,
} from "lucide-react";

import { deletePayement } from "../services/payementService";

const headerGradient =
  "linear-gradient(135deg, #c2410c 0%, #9a3412 45%, #431407 100%)";

const translations = {
  EN: {
    management: "Payment Management",
    title: "Delete Payment",
    subtitle: "Confirm payment deletion.",

    question: "Are you sure you want to delete this payment?",
    description:
      "This payment will be permanently removed from the list.",

    student: "Student",
    amount: "Amount",
    date: "Date",

    delete: "Delete",
    deleting: "Deleting...",
    close: "Close",

    unavailableStudent: "Student name unavailable",
    deleteError: "Unable to delete payment.",
  },

  FR: {
    management: "Gestion des paiements",
    title: "Supprimer le paiement",
    subtitle: "Confirmer la suppression du paiement.",

    question:
      "Êtes-vous sûr de vouloir supprimer ce paiement ?",
    description:
      "Ce paiement sera définitivement supprimé de la liste.",

    student: "Étudiant",
    amount: "Montant",
    date: "Date",

    delete: "Supprimer",
    deleting: "Suppression...",
    close: "Fermer",

    unavailableStudent:
      "Nom étudiant non disponible",
    deleteError:
      "Impossible de supprimer le paiement.",
  },

  AR: {
    management: "إدارة المدفوعات",
    title: "حذف الدفع",
    subtitle: "تأكيد حذف الدفع.",

    question:
      "هل أنت متأكد أنك تريد حذف هذا الدفع؟",
    description:
      "سيتم حذف هذا الدفع نهائيًا من القائمة.",

    student: "الطالب",
    amount: "المبلغ",
    date: "التاريخ",

    delete: "حذف",
    deleting: "جاري الحذف...",
    close: "إغلاق",

    unavailableStudent:
      "اسم الطالب غير متوفر",
    deleteError:
      "تعذر حذف الدفع.",
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

  const cleanDate =
    String(date).split("T")[0];

  const parsedDate =
    new Date(`${cleanDate}T00:00:00`);

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

export default function DeletePayments({
  open,
  payement,
  onClose,
  onSuccess,
}) {
  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

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
     RESET ERROR
  ========================= */

  useEffect(() => {
    if (open) {
      setError("");
    }
  }, [open, payement]);

  /* =========================
     BLOCK SCROLL
  ========================= */

  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async () => {
    if (!payement?.id) return;

    try {
      setDeleting(true);
      setError("");

      await deletePayement(
        payement.id
      );

      /* Actualisation automatique */
      window.dispatchEvent(
        new CustomEvent(
          "payments-updated"
        )
      );

      await onSuccess?.();

      onClose();
    } catch (error) {
      console.error(
        "Erreur suppression paiement :",
        error
      );

      setError(
        error?.response?.data
          ?.message ||
          t.deleteError
      );
    } finally {
      setDeleting(false);
    }
  };

  if (!open || !payement) {
    return null;
  }

  /* =========================
     STUDENT
  ========================= */

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
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      <div
        className="
          my-auto
          w-full
          max-w-lg
          overflow-hidden
          rounded-[2rem]
          shadow-2xl
          transition-colors
          duration-300
        "
        style={{
          backgroundColor:
            "var(--card-bg)",
          color:
            "var(--text-color)",
        }}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* ======================
            HEADER
        ====================== */}

        <div
          className="
            relative
            overflow-hidden
            px-6
            py-6
            text-white
          "
          style={{
            background:
              headerGradient,
          }}
        >
          <div className="absolute -right-10 -top-14 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

          <div
            className={`
              relative
              flex
              items-center
              justify-between
              gap-4

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
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/15
                  text-orange-100
                  ring-1
                  ring-white/20
                "
              >
                <AlertTriangle
                  size={24}
                />
              </div>

              <div>
                <p className="text-xs font-bold text-orange-200">
                  {t.management}
                </p>

                <h2 className="mt-1 text-xl font-black">
                  {t.title}
                </h2>

                <p className="mt-1 text-xs font-semibold text-orange-100/80">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              title={t.close}
              className="
                inline-flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-white/10
                text-white
                transition
                hover:bg-white/20
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ======================
            CONTENT
        ====================== */}

        <div className="p-6">
          {error && (
            <div
              className="
                mb-5
                rounded-2xl
                border
                px-4
                py-3
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

          {/* CONFIRMATION */}

          <div
            className="
              rounded-2xl
              border
              p-5
            "
            style={{
              backgroundColor:
                "var(--section-bg)",
              borderColor:
                "var(--border-color)",
            }}
          >
            <div
              className={`
                flex
                items-start
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
                  h-11
                  w-11
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
                <Trash2 size={20} />
              </div>

              <div>
                <p
                  className="text-sm font-black"
                  style={{
                    color:
                      "var(--text-color)",
                  }}
                >
                  {t.question}
                </p>

                <p
                  className="mt-2 text-sm font-semibold"
                  style={{
                    color:
                      "var(--muted-text)",
                  }}
                >
                  {t.description}
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT INFO */}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <InfoItem
              icon={User}
              label={t.student}
              value={studentName}
            />

            <InfoItem
              icon={CircleDollarSign}
              label={t.amount}
              value={`${formatAmount(
                payement.amount
              )} MAD`}
            />

            <InfoItem
              icon={CalendarDays}
              label={t.date}
              value={formatDate(
                payement.date,
                language
              )}
            />
          </div>

          {/* DELETE BUTTON */}

          <div
            className={`
              mt-6
              flex

              ${
                isArabic
                  ? "justify-start"
                  : "justify-end"
              }
            `}
          >
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="
                inline-flex
                min-w-[145px]
                items-center
                justify-center
                gap-2
                rounded-2xl
                px-5
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
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
              {deleting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  {t.deleting}
                </>
              ) : (
                <>
                  <Trash2
                    size={17}
                  />

                  {t.delete}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* =====================================================
   INFO ITEM
===================================================== */

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        p-4
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
          mb-3
          flex
          h-9
          w-9
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
        <Icon size={17} />
      </div>

      <p
        className="text-[11px] font-black"
        style={{
          color:
            "var(--muted-text)",
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
          color:
            "var(--text-color)",
        }}
      >
        {value || "-"}
      </p>
    </div>
  );
}