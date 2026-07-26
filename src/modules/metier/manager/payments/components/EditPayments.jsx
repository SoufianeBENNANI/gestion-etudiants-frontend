import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
  X,
  Loader2,
  Pencil,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  User,
  CircleDollarSign,
} from "lucide-react";

import { updatePayement } from "../services/payementService";

const headerGradient =
  "linear-gradient(135deg, #c2410c 0%, #9a3412 45%, #431407 100%)";

const translations = {
  EN: {
    management: "Payment Management",
    title: "Update Payment",
    subtitle: "Update selected payment information.",

    studentName: "Student",
    unavailableStudent: "Student name unavailable",

    amount: "Amount",
    amountPlaceholder: "Example: 4200",

    date: "Date",
    status: "Status",

    paid: "PAID",
    pending: "PENDING",
    unpaid: "UNPAID",
    cancelled: "CANCELLED",

    update: "Update",
    close: "Close",

    today: "Today",
    clear: "Clear",

    amountError: "Amount must be greater than zero.",
    dateError: "Please select a date.",
    updateError: "Unable to update payment.",

    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },

  FR: {
    management: "Gestion des paiements",
    title: "Modifier le paiement",
    subtitle: "Mettre à jour les informations du paiement sélectionné.",

    studentName: "Étudiant",
    unavailableStudent: "Nom étudiant non disponible",

    amount: "Montant",
    amountPlaceholder: "Exemple : 4200",

    date: "Date",
    status: "Statut",

    paid: "PAYÉ",
    pending: "EN ATTENTE",
    unpaid: "IMPAYÉ",
    cancelled: "ANNULÉ",

    update: "Modifier",
    close: "Fermer",

    today: "Aujourd’hui",
    clear: "Vider",

    amountError: "Le montant doit être supérieur à zéro.",
    dateError: "Veuillez choisir une date.",
    updateError: "Impossible de modifier le paiement.",

    days: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  },

  AR: {
    management: "إدارة المدفوعات",
    title: "تعديل الدفع",
    subtitle: "تحديث معلومات الدفع المحددة.",

    studentName: "الطالب",
    unavailableStudent: "اسم الطالب غير متوفر",

    amount: "المبلغ",
    amountPlaceholder: "مثال: 4200",

    date: "التاريخ",
    status: "الحالة",

    paid: "مدفوع",
    pending: "في الانتظار",
    unpaid: "غير مدفوع",
    cancelled: "ملغى",

    update: "تحديث",
    close: "إغلاق",

    today: "اليوم",
    clear: "مسح",

    amountError: "يجب أن يكون المبلغ أكبر من صفر.",
    dateError: "يرجى اختيار التاريخ.",
    updateError: "تعذر تعديل الدفع.",

    days: ["أحد", "اثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
  },
};

/* =========================
   HELPERS
========================= */

const createLocalDate = (value) => {
  if (!value) return null;

  const cleanValue = String(value).split("T")[0];

  const [year, month, day] = cleanValue
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const normalizeDateValue = (value) => {
  if (!value) return "";

  return String(value).split("T")[0];
};

const inputStyle = {
  backgroundColor: "var(--input-bg)",
  color: "var(--text-color)",
  borderColor: "var(--border-color)",
};

/* =====================================================
   EDIT PAYMENTS
===================================================== */

export default function EditPayments({
  open,
  payement,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    date: "",
    status: "PAYE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

  /* =========================
     LANGUAGE
  ========================= */

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

  /* =========================
     LOAD PAYMENT
  ========================= */

  useEffect(() => {
    if (!open || !payement) return;

    setForm({
      studentId:
        payement.studentId ??
        payement.student?.id ??
        "",

      amount:
        payement.amount ??
        payement.montant ??
        "",

      date: normalizeDateValue(
        payement.date ??
          payement.datePayement ??
          ""
      ),

      status:
        payement.status ??
        payement.statut ??
        "PAYE",
    });

    setError("");
  }, [open, payement]);

  /* =========================
     BODY SCROLL
  ========================= */

  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  /* =========================
     CHANGE
  ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleDateChange = (value) => {
    setForm((previous) => ({
      ...previous,
      date: value,
    }));

    setError("");
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      setError(t.amountError);
      return;
    }

    if (!form.date) {
      setError(t.dateError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updatePayement(payement.id, {
        studentId: Number(form.studentId),
        amount: Number(form.amount),
        date: form.date,
        status: form.status,
      });

      /*
       * Actualisation automatique
       */
      window.dispatchEvent(
        new CustomEvent("payments-updated")
      );

      await onSuccess?.();

      onClose();
    } catch (error) {
      console.error(
        "Erreur modification paiement :",
        error
      );

      setError(
        error?.response?.data?.message ||
          t.updateError
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open || !payement) {
    return null;
  }

  /* =========================
     STUDENT NAME
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

  /* =====================================================
     PORTAL
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
        overflow-y-auto
        bg-slate-950/60
        p-4
        backdrop-blur-sm
      "
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className="
          my-auto
          w-full
          max-w-4xl
          overflow-visible
          rounded-[2rem]
          shadow-2xl
          transition-colors
          duration-300
        "
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
        }}
      >
        {/* =============================================
            HEADER
        ============================================= */}

        <div
          className="
            relative
            overflow-hidden
            rounded-t-[2rem]
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
                  text-orange-200
                  ring-1
                  ring-white/15
                "
              >
                <Pencil size={28} />
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

        {/* =============================================
            FORM
        ============================================= */}

        <form
          onSubmit={handleSubmit}
          className="
            grid
            gap-6
            rounded-b-[2rem]
            p-7
          "
        >
          {error && (
            <div
              className="
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

          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-3
            "
          >
            {/* STUDENT */}

            <ReadOnlyStudent
              label={t.studentName}
              value={studentName}
            />

            {/* AMOUNT */}

            <AmountField
              t={t}
              value={form.amount}
              onChange={handleChange}
            />

            {/* DATE */}

            <ModernDatePicker
              label={t.date}
              value={form.date}
              onChange={handleDateChange}
              t={t}
              isArabic={isArabic}
              language={language}
            />

            {/* STATUS */}

            <div className="md:col-span-3">
              <StatusField
                t={t}
                value={form.status}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* =========================================
              UPDATE BUTTON
          ========================================= */}

          <div
            className={`
              flex
              border-t
              pt-5

              ${
                isArabic
                  ? "justify-start"
                  : "justify-end"
              }
            `}
            style={{
              borderColor:
                "var(--border-color)",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              className="
                inline-flex
                min-w-[145px]
                items-center
                justify-center
                gap-2
                rounded-2xl
                px-6
                py-3
                text-sm
                font-black
                text-white
                shadow-lg
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
              style={{
                background: headerGradient,
              }}
            >
              {loading ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Pencil size={17} />
              )}

              {t.update}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

/* =====================================================
   STUDENT
===================================================== */

function ReadOnlyStudent({
  label,
  value,
}) {
  return (
    <div>
      <label
        className="mb-2 block text-xs font-black"
        style={{
          color: "var(--muted-text)",
        }}
      >
        {label}
      </label>

      <div className="relative">
        <User
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{
            color: "var(--muted-text)",
          }}
        />

        <input
          type="text"
          value={value}
          disabled
          readOnly
          className="
            w-full
            cursor-not-allowed
            rounded-2xl
            border
            py-3
            pl-11
            pr-4
            text-sm
            font-bold
            outline-none
            opacity-80
          "
          style={{
            backgroundColor:
              "var(--section-bg)",
            color: "var(--text-color)",
            borderColor:
              "var(--border-color)",
          }}
        />
      </div>
    </div>
  );
}

/* =====================================================
   AMOUNT
===================================================== */

function AmountField({
  t,
  value,
  onChange,
}) {
  return (
    <div>
      <label
        className="mb-2 block text-xs font-black"
        style={{
          color: "var(--muted-text)",
        }}
      >
        {t.amount}
      </label>

      <div className="relative">
        <CircleDollarSign
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{
            color: "var(--muted-text)",
          }}
        />

        <input
          type="number"
          name="amount"
          value={value}
          onChange={onChange}
          min="0.01"
          step="0.01"
          required
          placeholder={t.amountPlaceholder}
          className="
            w-full
            rounded-2xl
            border
            py-3
            pl-11
            pr-4
            text-sm
            font-semibold
            outline-none
            transition
          "
          style={inputStyle}
        />
      </div>
    </div>
  );
}

/* =====================================================
   STATUS
===================================================== */

function StatusField({
  t,
  value,
  onChange,
}) {
  return (
    <div>
      <label
        className="mb-2 block text-xs font-black"
        style={{
          color: "var(--muted-text)",
        }}
      >
        {t.status}
      </label>

      <select
        name="status"
        value={value}
        onChange={onChange}
        required
        className="
          w-full
          rounded-2xl
          border
          px-4
          py-3
          text-sm
          font-semibold
          outline-none
          transition
        "
        style={inputStyle}
      >
        <option value="PAYE">
          {t.paid}
        </option>

        <option value="EN_ATTENTE">
          {t.pending}
        </option>

        <option value="IMPAYE">
          {t.unpaid}
        </option>

        <option value="ANNULE">
          {t.cancelled}
        </option>
      </select>
    </div>
  );
}

/* =====================================================
   DATE PICKER
===================================================== */

function ModernDatePicker({
  label,
  value,
  onChange,
  t,
  isArabic,
  language,
}) {
  const selectedDate =
    createLocalDate(value);

  const [open, setOpen] =
    useState(false);

  const [viewDate, setViewDate] =
    useState(
      selectedDate ||
        new Date()
    );

  const locale =
    language === "AR"
      ? "ar-MA"
      : language === "FR"
      ? "fr-FR"
      : "en-US";

  useEffect(() => {
    const date =
      createLocalDate(value);

    if (date) {
      setViewDate(date);
    }
  }, [value]);

  const monthName = useMemo(() => {
    return viewDate.toLocaleDateString(
      locale,
      {
        month: "long",
        year: "numeric",
      }
    );
  }, [viewDate, locale]);

  const calendarDays = useMemo(() => {
    const year =
      viewDate.getFullYear();

    const month =
      viewDate.getMonth();

    const firstDay =
      new Date(
        year,
        month,
        1
      );

    const startDate =
      new Date(firstDay);

    startDate.setDate(
      firstDay.getDate() -
        firstDay.getDay()
    );

    return Array.from(
      { length: 42 },
      (_, index) => {
        const date =
          new Date(startDate);

        date.setDate(
          startDate.getDate() +
            index
        );

        return date;
      }
    );
  }, [viewDate]);

  const formatDateValue = (date) => {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date) => {
  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
};

const displayValue = formatDisplayDate(selectedDate);

  const changeMonth = (step) => {
    setViewDate((previous) =>
      new Date(
        previous.getFullYear(),
        previous.getMonth() +
          step,
        1
      )
    );
  };

  const selectDate = (date) => {
    onChange(
      formatDateValue(date)
    );

    setOpen(false);
  };

  const isSameDate = (
    first,
    second
  ) =>
    first &&
    second &&
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate();

  return (
    <div className="relative">
      <label
        className="mb-2 block text-xs font-black"
        style={{
          color: "var(--muted-text)",
        }}
      >
        {label}
      </label>

      <button
        type="button"
        onClick={() =>
          setOpen(
            (previous) => !previous
          )
        }
        className="
          flex
          w-full
          items-center
          justify-between
          rounded-2xl
          border
          px-4
          py-3
          text-sm
          font-semibold
          outline-none
          transition
        "
        style={inputStyle}
      >
        <span>
          {displayValue || label}
        </span>

        <CalendarDays
          size={18}
          style={{
            color:
              "var(--muted-text)",
          }}
        />
      </button>

      {open && (
        <div
          className={`
            absolute
            top-[76px]
            z-[10000]
            w-full
            min-w-[330px]
            rounded-[1.4rem]
            border
            p-4
            shadow-2xl

            ${
              isArabic
                ? "right-0"
                : "left-0"
            }
          `}
          style={{
            backgroundColor:
              "var(--card-bg)",

            borderColor:
              "var(--border-color)",

            color:
              "var(--text-color)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                changeMonth(
                  isArabic
                    ? 1
                    : -1
                )
              }
              className="rounded-xl border p-2"
              style={inputStyle}
            >
              <ChevronLeft
                size={16}
              />
            </button>

            <h3 className="text-sm font-black capitalize">
              {monthName}
            </h3>

            <button
              type="button"
              onClick={() =>
                changeMonth(
                  isArabic
                    ? -1
                    : 1
                )
              }
              className="rounded-xl border p-2"
              style={inputStyle}
            >
              <ChevronRight
                size={16}
              />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {t.days.map((day) => (
              <div
                key={day}
                className="py-2 text-[11px] font-black"
                style={{
                  color:
                    "var(--muted-text)",
                }}
              >
                {day}
              </div>
            ))}

            {calendarDays.map(
              (date) => {
                const inCurrentMonth =
                  date.getMonth() ===
                  viewDate.getMonth();

                const selected =
                  isSameDate(
                    date,
                    selectedDate
                  );

                const today =
                  isSameDate(
                    date,
                    new Date()
                  );

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() =>
                      selectDate(date)
                    }
                    className="
                      flex
                      h-10
                      items-center
                      justify-center
                      rounded-xl
                      text-xs
                      font-black
                      transition
                      hover:opacity-80
                    "
                    style={{
                      background:
                        selected
                          ? headerGradient
                          : today
                          ? "var(--section-bg)"
                          : "transparent",

                      color:
                        selected
                          ? "#fff"
                          : inCurrentMonth
                          ? "var(--text-color)"
                          : "var(--muted-text)",

                      opacity:
                        inCurrentMonth
                          ? 1
                          : 0.45,
                    }}
                  >
                    {date.getDate()}
                  </button>
                );
              }
            )}
          </div>

          <div className="mt-4 flex justify-between gap-2">
            <button
              type="button"
              onClick={() =>
                selectDate(
                  new Date()
                )
              }
              className="
                rounded-xl
                px-4
                py-2
                text-xs
                font-black
                text-white
              "
              style={{
                background:
                  headerGradient,
              }}
            >
              {t.today}
            </button>

            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
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
              {t.clear}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}