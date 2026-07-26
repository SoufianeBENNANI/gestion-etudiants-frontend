import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";

import { addPayement } from "../services/payementService";
import { getAllStudents } from "../../students/services/studentService";

const headerGradient =
  "linear-gradient(135deg, #c2410c 0%, #9a3412 45%, #431407 100%)";

const emptyForm = {
  studentId: "",
  amount: "",
  date: "",
  status: "PAYE",
};

const translations = {
  EN: {
    management: "Payment Management",
    title: "Add Payment",
    subtitle: "Create a new student payment.",

    student: "Student",
    selectStudent: "Select student",
    loadingStudents: "Loading students...",

    amount: "Amount",
    amountPlaceholder: "Example: 4200",

    date: "Date",
    status: "Status",

    paid: "PAID",
    pending: "PENDING",
    unpaid: "UNPAID",
    cancelled: "CANCELLED",

    save: "Save",
    close: "Close",

    today: "Today",
    clear: "Clear",

    selectStudentError: "Please select a student.",
    amountError: "Amount must be greater than zero.",
    dateError: "Please select a date.",
    studentsError: "Unable to load students.",
    paymentError: "Unable to add payment.",

    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },

  FR: {
    management: "Gestion des paiements",
    title: "Ajouter un paiement",
    subtitle: "Créer un nouveau paiement étudiant.",

    student: "Étudiant",
    selectStudent: "Sélectionner un étudiant",
    loadingStudents: "Chargement des étudiants...",

    amount: "Montant",
    amountPlaceholder: "Exemple : 4200",

    date: "Date",
    status: "Statut",

    paid: "PAYÉ",
    pending: "EN ATTENTE",
    unpaid: "IMPAYÉ",
    cancelled: "ANNULÉ",

    save: "Enregistrer",
    close: "Fermer",

    today: "Aujourd’hui",
    clear: "Vider",

    selectStudentError: "Veuillez sélectionner un étudiant.",
    amountError: "Le montant doit être supérieur à zéro.",
    dateError: "Veuillez choisir une date.",
    studentsError: "Impossible de charger les étudiants.",
    paymentError: "Impossible d'ajouter le paiement.",

    days: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  },

  AR: {
    management: "إدارة المدفوعات",
    title: "إضافة دفعة",
    subtitle: "إنشاء دفعة جديدة للطالب.",

    student: "الطالب",
    selectStudent: "اختر الطالب",
    loadingStudents: "جاري تحميل الطلاب...",

    amount: "المبلغ",
    amountPlaceholder: "مثال: 4200",

    date: "التاريخ",
    status: "الحالة",

    paid: "مدفوع",
    pending: "في الانتظار",
    unpaid: "غير مدفوع",
    cancelled: "ملغى",

    save: "حفظ",
    close: "إغلاق",

    today: "اليوم",
    clear: "مسح",

    selectStudentError: "يرجى اختيار الطالب.",
    amountError: "يجب أن يكون المبلغ أكبر من صفر.",
    dateError: "يرجى اختيار التاريخ.",
    studentsError: "تعذر تحميل الطلاب.",
    paymentError: "تعذر إضافة الدفعة.",

    days: ["أحد", "اثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
  },
};

/* =========================
   HELPERS
========================= */

const normalizeStudents = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data?.content)) return data.data.content;

  return [];
};

const getTodayValue = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const createLocalDate = (value) => {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const inputStyle = {
  backgroundColor: "var(--input-bg)",
  color: "var(--text-color)",
  borderColor: "var(--border-color)",
};

/* =====================================================
   ADD PAYMENTS
===================================================== */

export default function AddPayments({
  open,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState(emptyForm);

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);

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
     OPEN
  ========================= */

  useEffect(() => {
    if (!open) return;

    setForm({
      ...emptyForm,
      date: getTodayValue(),
    });

    setError("");

    loadStudents();
  }, [open]);

  /* Bloquer le scroll derrière le modal */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /* =========================
     STUDENTS
  ========================= */

  const loadStudents = async () => {
    try {
      setStudentsLoading(true);

      const data = await getAllStudents();

      setStudents(normalizeStudents(data));
    } catch (error) {
      console.error(
        "Erreur chargement étudiants :",
        error
      );

      setStudents([]);

      setError(t.studentsError);
    } finally {
      setStudentsLoading(false);
    }
  };

  /* =========================
     FORM CHANGE
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

    if (!form.studentId) {
      setError(t.selectStudentError);
      return;
    }

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

      await addPayement({
        studentId: Number(form.studentId),
        amount: Number(form.amount),
        date: form.date,
        status: form.status,
      });

      // Actualisation automatique
      window.dispatchEvent(
        new CustomEvent("payments-updated")
      );

      await onSuccess?.();

      onClose();
    } catch (error) {
      console.error(
        "Erreur ajout paiement :",
        error
      );

      setError(
        error?.response?.data?.message ||
        t.paymentError
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[9999]
        m-0
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
      dir={isArabic ? "rtl" : "ltr"}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
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
        

        <div
          className="
            relative
            overflow-hidden
            rounded-t-[2rem]
            px-7
            py-6
            text-white
          "
          style={{
            background: headerGradient,
          }}
        >
          {/* Decorative circles */}

          <div
            className="
              absolute
              -right-10
              -top-16
              h-44
              w-44
              rounded-full
              bg-white/5
            "
          />

          <div
            className="
              absolute
              -bottom-24
              left-1/3
              h-44
              w-44
              rounded-full
              bg-white/5
            "
          />

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

                ${isArabic
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
                <Plus size={27} />
              </div>

              <div>
                <p className="text-xs font-bold text-orange-200">
                  {t.management}
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  {t.title}
                </h2>

                <p className="mt-1.5 text-xs text-orange-100/80">
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
              <X size={19} />
            </button>
          </div>
        </div>

        {/* =============================================
            FORM
        ============================================= */}

        <form
          onSubmit={handleSubmit}
          className="
            rounded-b-[2rem]
            px-7
            py-7
          "
        >
          {error && (
            <div
              className="
                mb-6
                rounded-2xl
                border
                px-4
                py-3
                text-sm
                font-bold
              "
              style={{
                backgroundColor: "var(--section-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
            >
              {error}
            </div>
          )}

          {/* =========================================
              FIELDS
          ========================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-x-6
              gap-y-6
              md:grid-cols-2
            "
          >
            <SelectStudent
              label={t.student}
              value={form.studentId}
              onChange={handleChange}
              students={students}
              loading={studentsLoading}
              placeholder={t.selectStudent}
              loadingText={t.loadingStudents}
            />

            <AmountInput
              t={t}
              value={form.amount}
              onChange={handleChange}
            />

            <ModernDatePicker
              label={t.date}
              value={form.date}
              onChange={handleDateChange}
              t={t}
              isArabic={isArabic}
              language={language}
            />

            <StatusSelect
              t={t}
              value={form.status}
              onChange={handleChange}
            />
          </div>

          {/* =========================================
              SAVE
          ========================================= */}

          <div
            className={`
              mt-7
              flex
              border-t
              pt-5

              ${isArabic
                ? "justify-start"
                : "justify-end"
              }
            `}
            style={{
              borderColor: "var(--border-color)",
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
                <Save size={17} />
              )}

              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

/* =====================================================
   FIELD
===================================================== */

function Field({
  label,
  children,
}) {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-xs
          font-black
        "
        style={{
          color: "var(--muted-text)",
        }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}

/* =====================================================
   STUDENT
===================================================== */

function SelectStudent({
  label,
  value,
  onChange,
  students,
  loading,
  placeholder,
  loadingText,
}) {
  return (
    <Field label={label}>
      <select
        name="studentId"
        value={value}
        onChange={onChange}
        disabled={loading}
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

          disabled:cursor-not-allowed
          disabled:opacity-60
        "
        style={inputStyle}
      >
        <option value="">
          {loading
            ? loadingText
            : placeholder}
        </option>

        {students.map((student) => (
          <option
            key={student.id}
            value={student.id}
          >
            {student.nom} {student.prenom}
          </option>
        ))}
      </select>
    </Field>
  );
}

/* =====================================================
   AMOUNT
===================================================== */

function AmountInput({
  t,
  value,
  onChange,
}) {
  return (
    <Field label={t.amount}>
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
          px-4
          py-3
          text-sm
          font-semibold
          outline-none
          transition
        "
        style={inputStyle}
      />
    </Field>
  );
}

/* =====================================================
   STATUS
===================================================== */

function StatusSelect({
  t,
  value,
  onChange,
}) {
  return (
    <Field label={t.status}>
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

        <option value="ANNULE">
          {t.cancelled}
        </option>
      </select>
    </Field>
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
  const [open, setOpen] = useState(false);

  const [viewDate, setViewDate] = useState(
    createLocalDate(value) || new Date()
  );

  const selectedDate =
    createLocalDate(value);

  const locale =
    language === "AR"
      ? "ar-MA"
      : language === "FR"
        ? "fr-FR"
        : "en-US";

  useEffect(() => {
    if (!value) return;

    const date =
      createLocalDate(value);

    if (date) {
      setViewDate(date);
    }
  }, [value]);

  /* =========================
     MONTH
  ========================= */

  const monthName = useMemo(() => {
    return viewDate.toLocaleDateString(
      locale,
      {
        month: "long",
        year: "numeric",
      }
    );
  }, [viewDate, locale]);

  /* =========================
     DAYS
  ========================= */

  const calendarDays = useMemo(() => {
    const year =
      viewDate.getFullYear();

    const month =
      viewDate.getMonth();

    const firstDay = new Date(
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

  /* =========================
     FORMAT
  ========================= */

  const formatDate = (date) => {
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
    onChange(formatDate(date));

    setOpen(false);
  };

  const formatDisplayDate = (date) => {
  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
};

const displayValue = formatDisplayDate(selectedDate);

  return (
    <div className="relative">
      <label
        className="
          mb-2
          block
          text-xs
          font-black
        "
        style={{
          color: "var(--muted-text)",
        }}
      >
        {label}
      </label>

      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
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

      {/* =========================================
          CALENDAR
      ========================================= */}

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

            ${isArabic
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
          {/* Calendar header */}

          <div
            className="
              mb-4
              flex
              items-center
              justify-between
            "
          >
            <button
              type="button"
              onClick={() =>
                changeMonth(
                  isArabic
                    ? 1
                    : -1
                )
              }
              className="
                rounded-xl
                border
                p-2
              "
              style={inputStyle}
            >
              <ChevronLeft size={16} />
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
              className="
                rounded-xl
                border
                p-2
              "
              style={inputStyle}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Days */}

          <div
            className="
              grid
              grid-cols-7
              gap-1
              text-center
            "
          >
            {t.days.map((day) => (
              <div
                key={day}
                className="
                  py-2
                  text-[11px]
                  font-black
                "
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
                const currentMonth =
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
                          : currentMonth
                            ? "var(--text-color)"
                            : "var(--muted-text)",

                      opacity:
                        currentMonth
                          ? 1
                          : 0.4,
                    }}
                  >
                    {date.getDate()}
                  </button>
                );
              }
            )}
          </div>

          {/* Calendar footer */}

          <div
            className="
              mt-4
              flex
              justify-between
              gap-3
            "
          >
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